import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import multer from "multer";

dotenv.config();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Auto-delete files older than 1 hour (runs every 15 minutes)
setInterval(() => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return console.error('Failed to read uploads directory for cleanup', err);
    files.forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const now = new Date().getTime();
        const endTime = new Date(stats.ctime).getTime() + 3600000; // 1 hour
        if (now > endTime) {
          fs.unlink(filePath, err => {
            if (err) console.error(`Error deleting old file ${file}`, err);
          });
        }
      });
    });
  });
}, 15 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Dynamic CORS
  const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());
  
  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // File upload endpoint
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      fileUrl, 
      filename: req.file.filename,
      message: "File uploaded successfully (will be auto-deleted after 1 hour)" 
    });
  });

  app.post("/api/log_error", (req, res) => {
    fs.appendFileSync('production_error.log', `[${new Date().toISOString()}] ${JSON.stringify(req.body)}\n`);
    console.error(">>> FRONTEND ERROR LOGGED >>>", req.body);
    res.json({ ok: true });
  });

  // Safe lazy initializer for Google GenAI SDK
  let aiClient: any = null;
  let currentApiKey: string | undefined = undefined;

  function getAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== currentApiKey) {
      currentApiKey = apiKey;
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': "aistudio-build",
          },
        },
      });
    }
    return apiKey ? aiClient : null;
  }

  // API route for downloading video info
  app.post("/api/download", async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      let result: any = null;
      let mediaData: any = null;

      const bd = (await import('btch-downloader')).default || (await import('btch-downloader'));
      let isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
      let isX = url.includes("twitter.com") || url.includes("x.com");
      let isFb = url.includes("facebook.com") || url.includes("fb.watch");
      let isIg = url.includes("instagram.com");
      let isTiktok = url.includes("tiktok.com");
      let isPinterest = url.includes("pinterest.com") || url.includes("pin.it");
      
      let isReddit = url.includes("reddit.com");
      
      try {
        if (isYoutube && bd.youtube) {
           result = await bd.youtube(url);
        } else if (isX && bd.twitter) {
           result = await bd.twitter(url);
        } else if (isFb && bd.fbdown) {
           result = await bd.fbdown(url);
        } else if (isIg && bd.igdl) {
           let igRes = await bd.igdl(url);
           if (igRes && Array.isArray(igRes)) {
               result = { url: igRes[0].url, video: igRes.map(i => i.url) };
           } else {
               result = igRes;
           }
        } else if (isTiktok && bd.ttdl) {
           result = await bd.ttdl(url);
           if (result && result.video && result.video.length === 0) {
              result = null; // force fallback
           }
        } else if (isPinterest && bd.pinterest) {
           let pinRes = await bd.pinterest(url);
           if (pinRes && pinRes.result && pinRes.result.result) {
               const data = pinRes.result.result;
               result = {
                   title: data.title || data.description || "Pinterest Media",
                   url: data.video_url || data.image || data.link,
                   thumbnail: data.image,
                   mp4: data.video_url,
                   video: data.video_url ? [data.video_url] : []
               };
           } else {
               // Try manual scraping as fallback
               try {
                   const htmlRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
                   const html = await htmlRes.text();
                   const mp4Match = html.match(/https:\/\/[^"]+\.mp4/);
                   const imgMatch = html.match(/https:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x|1200x)\/[^"]+\.(?:jpg|png|jpeg|webp)/);
                   if (mp4Match || imgMatch) {
                       const foundUrl = mp4Match ? mp4Match[0] : imgMatch![0];
                       result = {
                           title: "Pinterest Media",
                           url: foundUrl,
                           thumbnail: imgMatch ? imgMatch[0] : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                           mp4: mp4Match ? mp4Match[0] : undefined,
                           video: mp4Match ? [{url: mp4Match[0], quality: 'HD'}] : []
                       };
                   }
               } catch (e) {}
               if (!result) result = pinRes;
           }
        } else if (bd.aio) {
           result = await bd.aio(url);
        }

        if (result && result.url && Array.isArray(result.url) && result.url.every(u => typeof u === 'object' && Object.keys(u).length === 0)) {
           result = null; // Twitter empty array object bug
        }
        if (result && (result.mp4 || result.url || (result.video && result.video.length > 0) || result.Normal_video)) {
            let bestUrl = result.mp4 || result.url || result.Normal_video || (Array.isArray(result.video) ? (typeof result.video[0] === 'string' ? result.video[0] : result.video[0]?.url) : result.video) || result.HD || result.SD;
            if (Array.isArray(bestUrl) && bestUrl.length > 0 && typeof bestUrl[0] === 'object' && bestUrl[0].url) bestUrl = bestUrl[0].url;
            if (typeof bestUrl === 'object' && bestUrl !== null && bestUrl.url) bestUrl = bestUrl.url;
            if (typeof bestUrl !== 'string') bestUrl = "";
            
            if (Array.isArray(result.url) && result.url.length > 0 && typeof result.url[0] === 'object' && result.url[0].url) {
                bestUrl = result.url[0].url;
            }
            
            let picker = [];
            if (result.mp4) picker.push({ url: result.mp4, quality: 'MP4 Video' });
            if (result.mp3) picker.push({ url: result.mp3, quality: 'MP3 Audio' });
            if (result.HD) picker.push({ url: result.HD, quality: 'HD Video' });
            if (result.SD) picker.push({ url: result.SD, quality: 'SD Video' });
            if (result.Normal_video) picker.push({ url: result.Normal_video, quality: 'Normal Video' });
            if (Array.isArray(result.video)) {
                result.video.forEach((v: any) => {
                    if (typeof v === 'string') picker.push({ url: v, quality: 'Video' });
                    else if (typeof v === 'object' && v.url) picker.push({ url: v.url, quality: v.quality || 'Video' });
                });
            }
            if (Array.isArray(result.url)) {
                result.url.forEach((u: any) => {
                    if (typeof u === 'object' && u.url) picker.push({ url: u.url, quality: u.quality || u.type || 'Media' });
                });
            }

            // Remove duplicates
            picker = picker.filter((value, index, self) =>
              index === self.findIndex((t) => (
                t.url === value.url
              ))
            );

            mediaData = {
                title: result.title || "Extracted Video",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: result.thumbnail || result.thumb || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: result.author ? `Author: ${result.author}` : "No description",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: picker.length > 0 ? picker : [{ url: bestUrl, quality: 'Standard' }]
            };
        }
      } catch (err: any) {
         console.warn("Primary downloader failed, attempting fallback...", err.message);
      }

      // Fallback public APIs for other platforms if btch-downloader fails
      if (!mediaData && (isTiktok || isIg || isFb || isX || isPinterest || isReddit || isYoutube)) {
         try {
             const cobaltRes = await fetch("https://api.cobalt.tools/api/json", {
                 method: "POST",
                 headers: {
                     "Accept": "application/json",
                     "Content-Type": "application/json",
                 },
                 body: JSON.stringify({
                     url: url,
                     vQuality: "1080",
                     isAudioOnly: false
                 })
             });
             const cobaltData = await cobaltRes.json();
             if (cobaltData && (cobaltData.url || cobaltData.picker || cobaltData.status === "redirect" || cobaltData.status === "stream" || cobaltData.status === "success" || cobaltData.status === "picker")) {
                 let bestUrl = cobaltData.url || (cobaltData.picker && cobaltData.picker[0]?.url) || "";
                 let picker = cobaltData.picker ? cobaltData.picker.map((p) => ({ url: p.url, quality: 'Media' })) : [{ url: bestUrl, quality: 'Auto Best' }];
                 mediaData = {
                     title: "Extracted Media",
                     url: bestUrl,
                     tunnel: bestUrl,
                     thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                     description: "Extracted via Cobalt API",
                     duration: "Unknown",
                     viewCount: "N/A",
                     likeCount: "N/A",
                     picker: picker
                 };
             }
         } catch (err) {
             console.warn("Cobalt fallback failed:", err);
         }
      }

      if (!mediaData) {
         // Return a graceful placeholder so the frontend doesn't crash on unsupported links
         mediaData = {
             title: "Media Preview (Unavailable)",
             url: "https://www.w3schools.com/html/mov_bbb.mp4",
             tunnel: "https://www.w3schools.com/html/mov_bbb.mp4",
             thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
             description: "Could not fetch original video. Showing placeholder preview. The platform might be temporarily blocked or require authentication.",
             duration: "0:10",
             viewCount: "N/A",
             likeCount: "N/A",
             picker: [
               { url: "https://www.w3schools.com/html/mov_bbb.mp4", quality: "Placeholder Video" }
             ]
         };
      }

      res.json(mediaData);
    } catch (error: any) {
      let friendlyError = "Failed to fetch video information. " + (error.message || "Unknown error");
      res.status(500).json({ error: friendlyError });
    }
  });

  // AI Content Generator API Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    const { tool, prompt, options, apiKey } = req.body;

    if (!tool || !prompt) {
      return res.status(400).json({ error: "Tool and Prompt are required fields." });
    }

    try {
      let ai = getAI();
      if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
      }
      let responseText = "";

      if (ai) {
        // Construct the prompt based on the specific tool
        let systemPrompt = "You are a professional social media marketing copywriter and content growth SEO consultant.";
        let finalPrompt = "";

        if (tool === "hashtag") {
          systemPrompt += " Generate 15-20 highly engaging visual tags, categorizing them by Top, Medium, and Niche size.";
          finalPrompt = `Generate optimized trending social media hashtags for: "${prompt}". Focus Platform: ${options?.platform || 'Instagram'}.`;
        } else if (tool === "caption") {
          systemPrompt += " Write a compelling caption including hook lines, call to actions, and custom formatting spacing.";
          finalPrompt = `Write an optimized caption for: "${prompt}". Tone: ${options?.tone || 'Professional'}, Platform: ${options?.platform || 'TikTok'}.`;
        } else if (tool === "title") {
          systemPrompt += " Produce 10 distinct clicking hooks and high CTR headline variations.";
          finalPrompt = `Generate video titles and hooks for the topic: "${prompt}". Video Goal: ${options?.goal || 'Viral View count'}.`;
        } else if (tool === "bio") {
          systemPrompt += " Create 3 completely distinct bio concepts with line breaks and custom emojis.";
          finalPrompt = `Create a social media profile biography for: "${prompt}". Style: ${options?.style || 'Creative'}, Platform: ${options?.platform || 'Instagram'}.`;
        } else if (tool === "idea") {
          systemPrompt += " Suggest 5 unique viral video concepts with outline, specific hook, and sound advice.";
          finalPrompt = `Analyze and list complete content idea outlines for: "${prompt}". Niche Category: ${options?.category || 'General Creator'}.`;
        } else if (tool === "tags") {
          systemPrompt += " Produce active tags formatted cleanly as a comma-separated list and direct checklist.";
          finalPrompt = `Generate search tags and key terms for YouTube upload: "${prompt}". Niche focus: ${options?.audience || 'General Discoverability'}.`;
        }

        const schema = {
          type: "OBJECT",
          properties: {
            sections: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        title: { type: "STRING" },
                        content: { type: "STRING" }
                      },
                      required: ["content"]
                    }
                  }
                },
                required: ["title", "items"]
              }
            }
          },
          required: ["sections"]
        };

        const modelRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: finalPrompt,
          config: {
            systemInstruction: systemPrompt + " MUST output JSON matching the required schema.",
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: schema
          },
        });

        responseText = modelRes.text || "{}";
      } else {
        // Fallback generator for a key-less preview environment
        const fallbackObj = {
          sections: [
            {
              title: "Preview Mode Hashtags",
              items: [
                { content: "#" + prompt.replace(/\s+/g, "") + "Creator" },
                { content: "#SocialTrend2026" },
                { content: "#ViralCreator" },
                { content: "#MediaTools" }
              ]
            },
            {
              title: "Strategy",
              items: [
                { title: "Core Strategy", content: "Optimizing content with high-intent keywords relative to your target query." },
                { title: "Actionable", content: "Post during high-activity hours (11AM - 2PM, and 6PM - 8PM local time)." }
              ]
            }
          ]
        };
        responseText = JSON.stringify(fallbackObj);
      }

      res.json({ output: responseText });
    } catch (e: any) {
      console.error("AI Generation endpoint crashed", e);
      let errMsg = e.message || "An error occurred during AI generation";
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
          errMsg = "AI Generation quota exceeded. Please try again later. Wait about a minute for limits to refresh.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

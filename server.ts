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

  // SEO endpoints for Googlebot and search crawlers
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      res.type('text/plain; charset=utf-8').send(content);
    } else {
      res.type('text/plain; charset=utf-8').send("User-agent: *\nAllow: /\nSitemap: https://videodownloder.online/sitemap.xml\n");
    }
  });

  app.get("/ads.txt", (req, res) => {
    const adsTxtPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsTxtPath)) {
      const content = fs.readFileSync(adsTxtPath, 'utf-8');
      res.type('text/plain; charset=utf-8').send(content);
    } else {
      res.type('text/plain; charset=utf-8').send("google.com, pub-7035962451879722, DIRECT, f08c47fec0942fa0\n");
    }
  });

  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      let xml = fs.readFileSync(sitemapPath, 'utf-8');
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(xml);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  // Google site verification file handler
  app.get("/google:code.html", (req, res) => {
    const fileName = `google${req.params.code}.html`;
    const verificationPath = path.join(process.cwd(), 'public', fileName);
    if (fs.existsSync(verificationPath)) {
      res.type('text/html').sendFile(verificationPath);
    } else {
      res.type('text/html').send(`google-site-verification: ${fileName}`);
    }
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

  // High-speed direct media streaming tunnel & download endpoint
  app.get("/api/tunnel", async (req, res) => {
    const rawUrl = req.query.url as string;
    const rawFilename = (req.query.filename as string) || "video.mp4";
    if (!rawUrl) {
      return res.status(400).send("Missing media URL parameter");
    }

    try {
      const targetUrl = decodeURIComponent(rawUrl);
      const cleanFilename = (decodeURIComponent(rawFilename) || "video.mp4")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 80);
      const filenameWithExt = cleanFilename.endsWith(".mp4") || cleanFilename.endsWith(".mp3") 
        ? cleanFilename 
        : `${cleanFilename}.mp4`;

      let referer = "https://www.google.com/";
      if (targetUrl.includes("tiktok.com") || targetUrl.includes("tikwm.com")) {
        referer = "https://www.tikwm.com/";
      } else if (targetUrl.includes("instagram.com") || targetUrl.includes("cdninstagram.com")) {
        referer = "https://www.instagram.com/";
      } else if (targetUrl.includes("fbcdn.net") || targetUrl.includes("facebook.com")) {
        referer = "https://www.facebook.com/";
      } else if (targetUrl.includes("twimg.com") || targetUrl.includes("x.com")) {
        referer = "https://twitter.com/";
      } else if (targetUrl.includes("pinterest.com") || targetUrl.includes("pinimg.com")) {
        referer = "https://www.pinterest.com/";
      }

      const fetchRes = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "Referer": referer,
          "Accept": "*/*"
        }
      });

      if (!fetchRes.ok || !fetchRes.body) {
        return res.redirect(targetUrl);
      }

      res.setHeader("Content-Disposition", `attachment; filename="${filenameWithExt}"`);
      const contentType = fetchRes.headers.get("content-type") || "video/mp4";
      res.setHeader("Content-Type", contentType);
      const contentLength = fetchRes.headers.get("content-length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Cache-Control", "no-cache");

      // Stream data chunk by chunk
      const reader = fetchRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (e: any) {
      if (!res.headersSent) {
        try {
          res.redirect(rawUrl);
        } catch (_) {
          res.status(500).send("Stream error");
        }
      }
    }
  });

  // API route for downloading video info
  app.post("/api/download", async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required", reason: "missing_url", status: 400 });
    }

    try {
      let mediaData: any = null;
      let errors: any[] = [];
      let extractorUsed = "";

      let isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
      let isX = url.includes("twitter.com") || url.includes("x.com");
      let isFb = url.includes("facebook.com") || url.includes("fb.watch");
      let isIg = url.includes("instagram.com");
      let isTiktok = url.includes("tiktok.com");
      let isPinterest = url.includes("pinterest.com") || url.includes("pin.it");
      let isReddit = url.includes("reddit.com");

      let platform = isYoutube ? "youtube" : isX ? "x" : isFb ? "facebook" : isIg ? "instagram" : isTiktok ? "tiktok" : isPinterest ? "pinterest" : isReddit ? "reddit" : "unknown";

      // Helper for resolving short URLs (like vm.tiktok.com)
      async function resolveRedirect(targetUrl: string) {
          try {
             if (targetUrl.includes('vm.tiktok.com') || targetUrl.includes('vt.tiktok.com') || targetUrl.includes('pin.it')) {
                 const res = await fetch(targetUrl, { redirect: 'follow', method: 'GET' });
                 return res.url;
             }
          } catch(e) {}
          return targetUrl;
      }
      
      const resolvedUrl = await resolveRedirect(url);

      // --- 1. TikTok Specific Primary: TikWM (Handles TikTok extremely well) ---
      if (isTiktok) {
          try {
              const params = new URLSearchParams();
              params.append('url', resolvedUrl);
              params.append('count', '12');
              params.append('cursor', '0');
              params.append('web', '1');
              params.append('hd', '1');

              const tikRes = await fetch("https://www.tikwm.com/api/", {
                  method: "POST",
                  body: params
              });
              const tikData = await tikRes.json();
              if (tikData && tikData.code === 0 && tikData.data) {
                  const data = tikData.data;
                  
                  // Helper to resolve relative tikwm urls
                  const resolveTikwmUrl = (u: string) => {
                      if (!u) return "";
                      return u.startsWith("/") ? `https://www.tikwm.com${u}` : u;
                  };

                  const bestUrl = resolveTikwmUrl(data.hdplay || data.play || data.wmplay || (data.images && data.images[0]) || "");
                  if (bestUrl) {
                      let picker: any[] = [];
                      if (data.hdplay) picker.push({ url: resolveTikwmUrl(data.hdplay), quality: 'HD Video' });
                      if (data.play) picker.push({ url: resolveTikwmUrl(data.play), quality: 'No Watermark' });
                      if (data.wmplay) picker.push({ url: resolveTikwmUrl(data.wmplay), quality: 'Watermark' });
                      if (data.music) picker.push({ url: resolveTikwmUrl(data.music), quality: 'Audio' });
                      if (data.images && Array.isArray(data.images)) {
                          data.images.forEach((img: string, i: number) => {
                              picker.push({ url: resolveTikwmUrl(img), quality: `Image ${i+1}` });
                          });
                      }

                      mediaData = {
                          title: data.title || "TikTok Media",
                          url: bestUrl,
                          tunnel: bestUrl,
                          thumbnail: resolveTikwmUrl(data.cover || data.origin_cover || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600"),
                          description: data.title || "",
                          duration: data.duration ? data.duration + "s" : "Unknown",
                          viewCount: data.play_count || "N/A",
                          likeCount: data.digg_count || "N/A",
                          picker: picker
                      };
                      extractorUsed = "tikwm";
                  } else {
                     errors.push({ extractor: "tikwm", message: "No valid media URL found in response" });
                  }
              } else {
                  errors.push({ extractor: "tikwm", message: tikData.msg || "Unknown TikWM error" });
              }
          } catch (e: any) {
              errors.push({ extractor: "tikwm", message: e.message });
          }
      }

      // --- 2. Universal Primary: yt-dlp ---
      if (!mediaData) {
          try {
              const youtubedl = (await import('youtube-dl-exec')).default;
              const ytRes: any = await youtubedl(resolvedUrl, {
                  dumpJson: true,
                  noWarnings: true,
                  noCallHome: true,
                  noCheckCertificates: true,
                  preferFreeFormats: true,
                  youtubeSkipDashManifest: true,
                  referer: resolvedUrl,
              } as any);
              
              if (ytRes && ytRes.url) {
                  let bestUrl = ytRes.url;
                  let picker: any[] = [{ url: bestUrl, quality: ytRes.format_note || 'Standard' }];
                  
                  if (ytRes.formats) {
                     const videoFormats = ytRes.formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
                     if (videoFormats.length > 0) {
                        picker = videoFormats.map((f: any) => ({ url: f.url, quality: f.format_note || f.height + 'p' }));
                     }
                  }
                  
                  mediaData = {
                      title: ytRes.title || "Extracted Video",
                      url: bestUrl,
                      tunnel: bestUrl,
                      thumbnail: ytRes.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                      description: ytRes.description || "",
                      duration: ytRes.duration ? ytRes.duration + "s" : "Unknown",
                      viewCount: ytRes.view_count || "N/A",
                      likeCount: ytRes.like_count || "N/A",
                      picker: picker
                  };
                  extractorUsed = "yt-dlp";
              } else {
                  errors.push({ extractor: "yt-dlp", message: "Response did not contain a valid URL (possibly an image post)." });
              }
          } catch (err: any) {
              errors.push({ extractor: "yt-dlp", message: err.message });
          }
      }

      // --- 3. Secondary Fallback: Cobalt API ---
      if (!mediaData && (isTiktok || isIg || isFb || isX || isPinterest || isReddit || isYoutube)) {
          try {
              const cobaltUrl = "https://api.cobalt.tools/api/json";
              const payload = {
                  url: resolvedUrl,
                  vQuality: "1080",
                  isAudioOnly: false,
                  disableMetadata: false,
                  twitterConvert: true
              };

              let cobaltData: any = null;
              let retries = 2;
              
              while (retries > 0) {
                  try {
                      const cobaltRes = await fetch(cobaltUrl, {
                          method: "POST",
                          headers: {
                              "Accept": "application/json",
                              "Content-Type": "application/json",
                              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                              "Origin": "https://cobalt.tools",
                              "Referer": "https://cobalt.tools/",
                              "Accept-Language": "en-US,en;q=0.9",
                              "Sec-Fetch-Dest": "empty",
                              "Sec-Fetch-Mode": "cors",
                              "Sec-Fetch-Site": "same-origin"
                          },
                          body: JSON.stringify(payload)
                      });
                      
                      if (cobaltRes.ok) {
                          cobaltData = await cobaltRes.json();
                          break;
                      } else {
                          const errText = await cobaltRes.text();
                          errors.push({ extractor: "cobalt", message: `HTTP ${cobaltRes.status}: ${errText.slice(0, 50)}` });
                      }
                  } catch (e: any) {
                      errors.push({ extractor: "cobalt", message: e.message });
                  }
                  retries--;
                  await new Promise(resolve => setTimeout(resolve, 1000));
              }

              if (cobaltData && (cobaltData.url || (cobaltData.picker && cobaltData.picker.length > 0))) {
                  let bestUrl = cobaltData.url || (cobaltData.picker && cobaltData.picker[0]?.url) || "";
                  let picker = cobaltData.picker ? cobaltData.picker.map((p: any) => ({ url: p.url, quality: p.quality || 'Media' })) : [{ url: bestUrl, quality: 'Auto Best' }];
                  
                  mediaData = {
                      title: cobaltData.filename || "Extracted Media",
                      url: bestUrl,
                      tunnel: bestUrl,
                      thumbnail: cobaltData.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                      description: cobaltData.text || "Extracted via Cobalt API",
                      duration: cobaltData.duration ? Math.floor(cobaltData.duration) + "s" : "Unknown",
                      viewCount: "N/A",
                      likeCount: "N/A",
                      picker: picker
                  };
                  extractorUsed = "cobalt";
              }
          } catch (err: any) {
              errors.push({ extractor: "cobalt", message: err.message });
          }
      }

      // --- 4. Final Fallback: btch-downloader ---
      if (!mediaData) {
          let retries = 2;
          while (retries > 0 && !mediaData) {
              try {
                  const bd: any = (await import('btch-downloader')).default || (await import('btch-downloader'));
                  let result: any = null;
                  
                  if (isYoutube && bd.youtube) {
                     result = await bd.youtube(resolvedUrl);
                  } else if (isX && bd.twitter) {
                     result = await bd.twitter(resolvedUrl);
                  } else if (isFb && bd.fbdown) {
                     result = await bd.fbdown(resolvedUrl);
                  } else if (isIg) {
                     try {
                         let igRes = await bd.igdl(resolvedUrl);
                         if (igRes && Array.isArray(igRes) && igRes.length > 0 && igRes[0].url) {
                             result = { url: igRes[0].url, video: igRes.map(i => i.url) };
                         } else if (igRes && igRes.result && Array.isArray(igRes.result) && igRes.result.length > 0) {
                             result = {
                                 url: igRes.result[0].url,
                                 thumbnail: igRes.result[0].thumbnail,
                                 video: igRes.result.map((i: any) => i.url)
                             };
                         } else {
                             // Try ab-downloader if btch-downloader fails
                             const abd = (await import('ab-downloader')).default || (await import('ab-downloader'));
                             const abdRes = await abd.igdl(resolvedUrl);
                             if (abdRes && Array.isArray(abdRes) && abdRes.length > 0 && abdRes[0].url) {
                                 result = { url: abdRes[0].url, video: abdRes.map(i => i.url) };
                             } else {
                                 result = igRes;
                             }
                         }
                     } catch(e: any) {
                         const abd = (await import('ab-downloader')).default || (await import('ab-downloader'));
                         const abdRes = await abd.igdl(resolvedUrl);
                         if (abdRes && Array.isArray(abdRes) && abdRes.length > 0 && abdRes[0].url) {
                             result = { url: abdRes[0].url, video: abdRes.map(i => i.url) };
                         } else {
                             errors.push({ extractor: "ig-fallback", message: e.message });
                         }
                     }
                  } else if (isTiktok && bd.ttdl) {
                     let ttRes: any = await bd.ttdl(resolvedUrl);
                     if (ttRes && ttRes.result && ttRes.result.video && ttRes.result.video.length > 0) {
                         result = ttRes.result;
                     } else if (ttRes && ttRes.video && ttRes.video.length > 0) {
                         result = ttRes;
                     } else {
                         const { Downloader } = await import('@tobyg74/tiktok-api-dl');
                         try {
                             const ttdlRes: any = await Downloader(resolvedUrl, { version: "v1" });
                             if (ttdlRes && ttdlRes.status === "success" && ttdlRes.result) {
                                 result = {
                                     url: ttdlRes.result.video?.playAddr?.[0] || ttdlRes.result.video?.[0] || "",
                                     video: ttdlRes.result.video?.playAddr || ttdlRes.result.video || [],
                                     thumbnail: ttdlRes.result.cover?.[0] || "",
                                     author: ttdlRes.result.author?.nickname || "",
                                     title: ttdlRes.result.description || ""
                                 };
                             } else {
                                 errors.push({ extractor: "tobyg74-tiktok-api-dl", message: "No result found in tobyg74" });
                             }
                         } catch(e: any) {
                             errors.push({ extractor: "tobyg74-tiktok-api-dl", message: e.message });
                         }
                     }
                  } else if (isPinterest && bd.pinterest) {
                     let pinRes: any = await bd.pinterest(resolvedUrl);
                     if (pinRes && pinRes.result && pinRes.result.result) {
                         const data: any = pinRes.result.result;
                         result = {
                             title: data.title || data.description || "Pinterest Media",
                             url: data.video_url || data.image || data.link,
                             thumbnail: data.image,
                             mp4: data.video_url,
                             video: data.video_url ? [data.video_url] : []
                         };
                     }
                  }
                  
                  if (result && (result.mp4 || result.url || (result.video && result.video.length > 0) || result.Normal_video)) {
                      let allPotentialUrls: string[] = [];
                      if (result.mp4) allPotentialUrls.push(result.mp4);
                      if (result.HD) allPotentialUrls.push(result.HD);
                      if (result.SD) allPotentialUrls.push(result.SD);
                      if (result.Normal_video) allPotentialUrls.push(result.Normal_video);
                      if (Array.isArray(result.video)) result.video.forEach((v: any) => allPotentialUrls.push(typeof v === 'string' ? v : v?.url));
                      if (Array.isArray(result.url)) result.url.forEach((u: any) => allPotentialUrls.push(typeof u === 'object' && u.url ? u.url : u));
                      
                      let bestUrl = allPotentialUrls.find(u => u && u.includes('.mp4')) || allPotentialUrls[0] || result.url || "";
                      
                      if (typeof bestUrl !== 'string' || bestUrl.trim() === '') {
                          bestUrl = "";
                      }
                      
                      if (bestUrl) {
                          let picker: any[] = [];
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
                          extractorUsed = "btch-downloader";
                      } else {
                          errors.push({ extractor: "btch-downloader", message: "Could not find a valid URL string" });
                      }
                  } else {
                      errors.push({ extractor: "btch-downloader", message: "Result did not contain video URLs" });
                  }
              } catch (err: any) {
                  errors.push({ extractor: "btch-downloader", message: err.message });
              }
              retries--;
              if (!mediaData) await new Promise(resolve => setTimeout(resolve, 1000));
          }
      }

      if (!mediaData) {
         return res.status(400).json({
             error: "Failed to download media. All extractors failed or were blocked.",
             reason: "extractors_failed",
             platform: platform,
             extractor_used: "none",
             status: 400,
             details: process.env.NODE_ENV !== 'production' ? errors : undefined
         });
      }

      // Final sanitization of picker URLs to make sure they are strings
      if (mediaData && Array.isArray(mediaData.picker)) {
          mediaData.picker = mediaData.picker.filter((p: any) => typeof p.url === 'string' && p.url.trim() !== '');
      }

      return res.json(mediaData);
    } catch (error: any) {
      return res.status(500).json({ 
          error: "Internal server error during download process.",
          reason: error.message,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
          status: 500
      });
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
        // High-quality smart generator for all creative tools
        const cleanPrompt = prompt.trim();
        const baseWord = cleanPrompt.replace(/[^a-zA-Z0-9]/g, "");

        let fallbackObj: any = { sections: [] };

        if (tool === "title") {
          fallbackObj = {
            sections: [
              {
                title: "High-CTR Viral Hooks",
                items: [
                  { title: "Hook 1", content: `I Tested ${cleanPrompt} For 30 Days (Here's What Happened)` },
                  { title: "Hook 2", content: `Why Everyone Is Wrong About ${cleanPrompt} in 2026` },
                  { title: "Hook 3", content: `The Ultimate Secret To ${cleanPrompt} Nobody Tells You` },
                  { title: "Hook 4", content: `Stop Doing ${cleanPrompt} Until You Watch This!` },
                  { title: "Hook 5", content: `How To Master ${cleanPrompt} in 10 Minutes (Step-by-Step)` }
                ]
              },
              {
                title: "Curiosity & Storytelling Headlines",
                items: [
                  { title: "Story 1", content: `The Shocking Truth Behind ${cleanPrompt}` },
                  { title: "Story 2", content: `From Beginner to Pro: Complete Guide to ${cleanPrompt}` },
                  { title: "Story 3", content: `3 Mistakes You're Making With ${cleanPrompt} Right Now` }
                ]
              }
            ]
          };
        } else if (tool === "caption") {
          fallbackObj = {
            sections: [
              {
                title: "Engaging Social Media Caption",
                items: [
                  { 
                    title: "Full Post Caption", 
                    content: `🔥 Want to take your content to the next level with ${cleanPrompt}?\n\nHere are 3 quick rules you need to know:\n1️⃣ Consistency beats perfection every single time.\n2️⃣ Focus on the hook in the first 3 seconds.\n3️⃣ Always give a clear reason to save and share.\n\n👇 Drop your thoughts in the comments below!\n\n#${baseWord} #ContentCreator #ViralTips2026 #CreativeHacks` 
                  }
                ]
              },
              {
                title: "Short & Punchy Variation",
                items: [
                  { 
                    title: "Quick Reel Caption", 
                    content: `Save this before you plan your next video on ${cleanPrompt} ✨ Tap follow for daily creator breakdowns!` 
                  }
                ]
              }
            ]
          };
        } else if (tool === "bio") {
          fallbackObj = {
            sections: [
              {
                title: "Professional Bio Concepts",
                items: [
                  { title: "Option 1 (Creator/Expert)", content: `🚀 Helping you master ${cleanPrompt}\n💡 Daily tips, frameworks & tools\n👇 Start free below` },
                  { title: "Option 2 (Sleek & Minimal)", content: `Visuals • Growth • ${cleanPrompt}\nSharing what works in 2026 ⚡\nLink in bio 🔗` },
                  { title: "Option 3 (High-Impact Brand)", content: `The #1 Resource for ${cleanPrompt}\nOver 100k+ creators inspired weekly 📈\nDownload free assets 👇` }
                ]
              }
            ]
          };
        } else if (tool === "idea") {
          fallbackObj = {
            sections: [
              {
                title: "5 Viral Video Concepts",
                items: [
                  { title: "Concept 1: The Myth Buster", content: `Disprove the most common misconception about ${cleanPrompt}. Start with: "Stop believing this myth..."` },
                  { title: "Concept 2: The Fast Tutorial", content: `Teach one specific trick related to ${cleanPrompt} in under 45 seconds using on-screen text callouts.` },
                  { title: "Concept 3: Behind The Scenes", content: `Show the raw, unedited process of working on ${cleanPrompt}. Contrast expectations vs reality.` },
                  { title: "Concept 4: Tool / Resource Review", content: `Compare the best free tools for ${cleanPrompt} and share your top recommendation.` },
                  { title: "Concept 5: The Challenge", content: `Challenge yourself or your audience to try ${cleanPrompt} for 7 days and record daily progress.` }
                ]
              }
            ]
          };
        } else if (tool === "tags") {
          fallbackObj = {
            sections: [
              {
                title: "Recommended YouTube Search Tags",
                items: [
                  { title: "Tags List", content: `${cleanPrompt}, how to ${cleanPrompt}, ${cleanPrompt} 2026, ${cleanPrompt} tutorial, best ${cleanPrompt}, ${cleanPrompt} tips, ${cleanPrompt} guide, ${cleanPrompt} for beginners` }
                ]
              }
            ]
          };
        } else {
          // Default hashtag generator
          fallbackObj = {
            sections: [
              {
                title: "Top Viral Hashtags",
                items: [
                  { content: `#${baseWord} #${baseWord}Tips #${baseWord}Tutorial #Viral${baseWord} #Trending2026 #CreatorTools` }
                ]
              },
              {
                title: "Niche Community Tags",
                items: [
                  { content: `#Learn${baseWord} #${baseWord}Life #${baseWord}Hacks #Daily${baseWord} #ContentStrategy` }
                ]
              },
              {
                title: "Broad Discovery Tags",
                items: [
                  { content: `#ExplorePage #ViralVideo #DigitalCreator #SocialMediaTips #TrendingNow` }
                ]
              }
            ]
          };
        }

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

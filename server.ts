import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { execFile } from "child_process";
import { renderPageHtml } from "./serverSeo.js";
import { tryDirectFileOrOgMedia, tryYtDlp, tryTikTok, tryYouTube, tryInstagram, tryTwitter, tryFacebook, tryPinterest, tryReddit, tryVimeo } from "./src/utils/mediaExtractor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const serveRobots = (req: any, res: any) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'robots.txt'),
      path.join(process.cwd(), 'dist', 'robots.txt'),
      path.join(__dirname, 'public', 'robots.txt'),
      path.join(__dirname, 'dist', 'robots.txt'),
      path.join(__dirname, 'robots.txt'),
    ];
    let content = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          content = fs.readFileSync(p, 'utf-8');
          if (content) break;
        } catch (_) {}
      }
    }
    if (!content) {
      content = "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://videodownloder.online/sitemap-index.xml\n";
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(content);
  };

  app.get(["/robots.txt", "/robots.txt/", "/Robots.txt", "/Robots.txt/"], serveRobots);

  const serveAdsTxt = (req: any, res: any) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'ads.txt'),
      path.join(process.cwd(), 'dist', 'ads.txt'),
      path.join(__dirname, 'public', 'ads.txt'),
      path.join(__dirname, 'dist', 'ads.txt'),
      path.join(__dirname, 'ads.txt'),
    ];
    let content = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          content = fs.readFileSync(p, 'utf-8');
          if (content) break;
        } catch (_) {}
      }
    }
    if (!content) {
      content = "google.com, pub-7035962451879722, DIRECT, f08c47fec0942fa0\n";
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(content);
  };

  app.get(["/ads.txt", "/ads.txt/", "/Ads.txt", "/Ads.txt/"], serveAdsTxt);

  const serveXmlFile = (filename: string, defaultXml: string) => (req: any, res: any) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', filename),
      path.join(process.cwd(), 'dist', filename),
      path.join(__dirname, 'public', filename),
      path.join(__dirname, 'dist', filename),
      path.join(__dirname, filename),
    ];
    let xml = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          xml = fs.readFileSync(p, 'utf-8');
          if (xml && (xml.includes('<urlset') || xml.includes('<sitemapindex'))) break;
        } catch (_) {}
      }
    }
    if (!xml) {
      xml = defaultXml;
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(xml);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://videodownloder.online/sitemap-pages.xml</loc>\n    <lastmod>${todayStr}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>https://videodownloder.online/sitemap-tools.xml</loc>\n    <lastmod>${todayStr}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>https://videodownloder.online/sitemap-posts.xml</loc>\n    <lastmod>${todayStr}</lastmod>\n  </sitemap>\n</sitemapindex>`;

  const defaultPagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://videodownloder.online/</loc><lastmod>${todayStr}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n  <url><loc>https://videodownloder.online/tools</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/blog</loc><lastmod>${todayStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/about</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n  <url><loc>https://videodownloder.online/contact</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n  <url><loc>https://videodownloder.online/faq</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/privacy</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n  <url><loc>https://videodownloder.online/terms</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n  <url><loc>https://videodownloder.online/disclaimer</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n  <url><loc>https://videodownloder.online/dmca</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n  <url><loc>https://videodownloder.online/cookies</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n  <url><loc>https://videodownloder.online/sitemap</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>`;

  const defaultToolsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://videodownloder.online/youtube-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/tiktok-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/instagram-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/facebook-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/facebook-video-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/twitter-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/twitter-video-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/pinterest-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/reddit-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/reddit-video-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://videodownloder.online/vimeo-downloader</loc><lastmod>${todayStr}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n</urlset>`;

  const defaultPostsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://videodownloder.online/blog/how-online-video-downloaders-work</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/mp4-vs-mp3-whats-the-difference</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-save-videos-for-offline-personal-use</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-download-videos-on-android</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-download-videos-on-iphone</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-download-videos-on-windows</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-download-videos-on-mac</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/what-does-1080p-mean</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/720p-vs-1080p-video-quality</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/why-video-download-quality-can-vary</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-choose-the-best-video-format</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/video-compression-explained</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-reduce-video-file-size</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-convert-video-to-mp4</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-extract-audio-from-your-own-videos</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/safe-online-video-downloading-practices</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/copyright-and-video-downloads-explained</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/how-to-download-your-own-social-media-videos</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/troubleshooting-failed-video-downloads</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/frequently-asked-video-downloading-questions</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://videodownloder.online/blog/pixeldoc-free-online-tools-pdf-images-text-seo-devs</loc><lastmod>${todayStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`;

  app.get(["/sitemap-index.xml", "/sitemap-index.xml/", "/sitemap_index.xml", "/sitemap_index.xml/"], serveXmlFile('sitemap-index.xml', defaultIndexXml));
  app.get(["/sitemap-pages.xml", "/sitemap-pages.xml/"], serveXmlFile('sitemap-pages.xml', defaultPagesXml));
  app.get(["/sitemap-tools.xml", "/sitemap-tools.xml/"], serveXmlFile('sitemap-tools.xml', defaultToolsXml));
  app.get(["/sitemap-posts.xml", "/sitemap-posts.xml/"], serveXmlFile('sitemap-posts.xml', defaultPostsXml));
  app.get(["/sitemap.xml", "/sitemap.xml/", "/Sitemap.xml", "/Sitemap.xml/", "/sitemap"], serveXmlFile('sitemap.xml', defaultIndexXml));

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

      if (req.query.inline === "true" || req.query.stream === "true") {
        res.setHeader("Content-Disposition", "inline");
      } else {
        res.setHeader("Content-Disposition", `attachment; filename="${filenameWithExt}"`);
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Accept-Ranges", "bytes");
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

  // API route for downloading video info with multi-tier fallback extractors
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
      let isVimeo = url.includes("vimeo.com");

      let platform = isYoutube ? "youtube" : isX ? "x" : isFb ? "facebook" : isIg ? "instagram" : isTiktok ? "tiktok" : isPinterest ? "pinterest" : isReddit ? "reddit" : isVimeo ? "vimeo" : "unknown";

      async function resolveRedirect(targetUrl: string) {
          try {
             if (targetUrl.includes('vm.tiktok.com') || targetUrl.includes('vt.tiktok.com') || targetUrl.includes('pin.it') || targetUrl.includes('v.redd.it') || targetUrl.includes('redd.it') || targetUrl.includes('t.co')) {
                 const res = await fetch(targetUrl, { redirect: 'follow', method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' } });
                 if (res.url) return res.url;
             }
          } catch(e) {}
          return targetUrl;
      }
      
      const resolvedUrl = await resolveRedirect(url);

      // 1. Check Direct File or OpenGraph
      mediaData = await tryDirectFileOrOgMedia(resolvedUrl);

      // 2. Primary Platform Extractor
      if (!mediaData && isYoutube) mediaData = await tryYouTube(resolvedUrl);
      if (!mediaData && isTiktok) mediaData = await tryTikTok(resolvedUrl);
      if (!mediaData && isIg) mediaData = await tryInstagram(resolvedUrl);
      if (!mediaData && isX) mediaData = await tryTwitter(resolvedUrl);
      if (!mediaData && isFb) mediaData = await tryFacebook(resolvedUrl);
      if (!mediaData && isPinterest) mediaData = await tryPinterest(resolvedUrl);
      if (!mediaData && isReddit) mediaData = await tryReddit(resolvedUrl);
      if (!mediaData && isVimeo) mediaData = await tryVimeo(resolvedUrl);

      // 3. Fallback Universal yt-dlp Engine
      if (!mediaData) mediaData = await tryYtDlp(resolvedUrl);

      // --- HELPER 1: Cobalt API Engine ---
      async function tryCobalt(targetUrl: string) {
        const instances = [
          "https://api.cobalt.tools/api/json",
          "https://co.wuk.sh/api/json",
          "https://cobalt.qtf.tw/api/json"
        ];
        for (const apiEndpoint of instances) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);
            const cRes = await fetch(apiEndpoint, {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              },
              body: JSON.stringify({ url: targetUrl, videoQuality: "max" }),
              signal: controller.signal
            });
            clearTimeout(timeout);
            if (!cRes.ok) continue;
            const cData: any = await cRes.json();
            if (cData && (cData.status === "stream" || cData.status === "redirect" || cData.status === "picker" || cData.url)) {
              let bestUrl = cData.url || "";
              let picker: any[] = [];
              if (cData.status === "picker" && Array.isArray(cData.picker)) {
                picker = cData.picker.map((item: any, idx: number) => ({
                  url: item.url,
                  quality: item.quality || item.type || `Stream ${idx + 1}`
                }));
                if (!bestUrl && picker.length > 0) bestUrl = picker[0].url;
              }
              if (bestUrl) {
                if (picker.length === 0) picker.push({ url: bestUrl, quality: "HD Quality" });
                return {
                  title: cData.filename ? cData.filename.replace(/\.[^/.]+$/, "") : "Extracted Video",
                  url: bestUrl,
                  tunnel: bestUrl,
                  thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: "High quality media stream",
                  duration: "Unknown",
                  viewCount: "N/A",
                  likeCount: "N/A",
                  picker
                };
              }
            }
          } catch (_) {}
        }
        return null;
      }

      // --- HELPER 2: Reddit Direct JSON Extractor ---
      async function tryReddit(targetUrl: string) {
        try {
          let jsonUrl = targetUrl.split('?')[0].replace(/\/$/, "") + ".json";
          const rRes = await fetch(jsonUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0" }
          });
          if (rRes.ok) {
            const rJson = await rRes.json();
            const postData = rJson?.[0]?.data?.children?.[0]?.data;
            if (postData) {
              const title = postData.title || "Reddit Post";
              const thumbnail = (postData.thumbnail && postData.thumbnail.startsWith("http"))
                ? postData.thumbnail
                : postData.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600";

              let videoUrl = postData.secure_media?.reddit_video?.fallback_url || postData.media?.reddit_video?.fallback_url;
              if (!videoUrl && postData.crosspost_parent_list?.[0]) {
                const cross = postData.crosspost_parent_list[0];
                videoUrl = cross.secure_media?.reddit_video?.fallback_url || cross.media?.reddit_video?.fallback_url;
              }
              if (!videoUrl && postData.url_overridden_by_dest) {
                if (postData.url_overridden_by_dest.match(/\.(mp4|gif|jpg|jpeg|png)$/i)) {
                  videoUrl = postData.url_overridden_by_dest;
                }
              }

              if (videoUrl) {
                const cleanUrl = videoUrl.replace(/&amp;/g, "&");
                const picker: any[] = [{ url: cleanUrl, quality: "HD Video (Original)" }];
                if (cleanUrl.includes("DASH_")) {
                  const baseUrl = cleanUrl.split("DASH_")[0];
                  picker.push({ url: `${baseUrl}DASH_720.mp4`, quality: "720p HD" });
                  picker.push({ url: `${baseUrl}DASH_480.mp4`, quality: "480p SD" });
                  picker.push({ url: `${baseUrl}DASH_360.mp4`, quality: "360p Mobile" });
                  picker.push({ url: `${baseUrl}DASH_AUDIO_128.mp4`, quality: "Audio Track" });
                }
                return {
                  title,
                  url: cleanUrl,
                  tunnel: cleanUrl,
                  thumbnail,
                  description: postData.selftext ? postData.selftext.slice(0, 150) : title,
                  duration: postData.secure_media?.reddit_video?.duration ? `${postData.secure_media.reddit_video.duration}s` : "Unknown",
                  viewCount: postData.score ? postData.score.toString() : "N/A",
                  likeCount: postData.ups ? postData.ups.toString() : "N/A",
                  picker
                };
              }
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 3: Vimeo Config & oEmbed Extractor ---
      async function tryVimeo(targetUrl: string) {
        try {
          const match = targetUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
          const vimeoId = match ? match[1] : null;
          if (vimeoId) {
            const configRes = await fetch(`https://player.vimeo.com/video/${vimeoId}/config`, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
            });
            if (configRes.ok) {
              const configData = await configRes.json();
              const files = configData?.request?.files?.progressive || [];
              if (files.length > 0) {
                const picker = files.map((f: any) => ({
                  url: f.url,
                  quality: f.quality ? `${f.quality} (${f.width}x${f.height})` : `${f.height}p`
                }));
                const best = files[0];
                return {
                  title: configData?.video?.title || "Vimeo Video",
                  url: best.url,
                  tunnel: best.url,
                  thumbnail: configData?.video?.thumbs?.['640'] || configData?.video?.thumbs?.['1280'] || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: configData?.video?.title || "",
                  duration: configData?.video?.duration ? `${configData?.video?.duration}s` : "Unknown",
                  viewCount: "N/A",
                  likeCount: "N/A",
                  picker
                };
              }
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 4: Pinterest Multi-Engine ---
      async function tryPinterest(targetUrl: string) {
        try {
          // @ts-ignore
          const nayanMod: any = await import('nayan-videos-downloader');
          if (nayanMod && typeof nayanMod.pinterestdown === 'function') {
            const pRes = await nayanMod.pinterestdown(targetUrl);
            if (pRes && (pRes.data || pRes.url)) {
              const bestUrl = pRes.data || pRes.url;
              return {
                title: "Pinterest Media",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: pRes.thumb || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Pinterest Pin",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: bestUrl, quality: "HD Media" }]
              };
            }
          }
        } catch (_) {}

        try {
          const pRes = await fetch(targetUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0" }
          });
          if (pRes.ok) {
            const html = await pRes.text();
            const videoMatch = html.match(/https:\/\/[^"]+v\.pinimg\.com\/videos\/[^\s"<]+\.mp4/i) || html.match(/<meta property="og:video" content="([^"]+)"/i);
            const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
            const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
            if (videoMatch) {
              const bestUrl = videoMatch[1] || videoMatch[0];
              return {
                title: titleMatch ? titleMatch[1] : "Pinterest Video Pin",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Pinterest Video",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: bestUrl, quality: "HD Video" }]
              };
            } else if (imgMatch) {
              const bestUrl = imgMatch[1];
              return {
                title: titleMatch ? titleMatch[1] : "Pinterest Image Pin",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: bestUrl,
                description: "Pinterest Image",
                duration: "Image",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: bestUrl, quality: "High Res Image" }]
              };
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 5: YouTube @distube/ytdl-core Extractor ---
      async function tryYouTube(targetUrl: string) {
        try {
          const ytdl: any = (await import("@distube/ytdl-core")).default || (await import("@distube/ytdl-core"));
          if (ytdl && typeof ytdl.getInfo === 'function') {
            const info = await ytdl.getInfo(targetUrl);
            if (info && info.videoDetails) {
              const details = info.videoDetails;
              const formats = info.formats || [];
              const videoFormats = formats.filter((f: any) => f.hasVideo && f.hasAudio && f.url);
              const videoOnly = formats.filter((f: any) => f.hasVideo && f.url);
              const audioOnly = formats.filter((f: any) => !f.hasVideo && f.hasAudio && f.url);

              let picker: any[] = [];
              videoFormats.forEach((f: any) => {
                picker.push({ url: f.url, quality: `${f.qualityLabel || f.height + 'p'} MP4 (With Audio)` });
              });
              videoOnly.forEach((f: any) => {
                picker.push({ url: f.url, quality: `${f.qualityLabel || f.height + 'p'} MP4 (Video)` });
              });
              audioOnly.forEach((f: any) => {
                picker.push({ url: f.url, quality: `${f.audioBitrate || '128'}kbps Audio (MP3)` });
              });

              let bestUrl = videoFormats[0]?.url || videoOnly[0]?.url || formats[0]?.url;
              if (bestUrl) {
                return {
                  title: details.title || "YouTube Video",
                  url: bestUrl,
                  tunnel: bestUrl,
                  thumbnail: details.thumbnails?.[details.thumbnails.length - 1]?.url || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: details.description?.slice(0, 150) || "",
                  duration: details.lengthSeconds ? `${details.lengthSeconds}s` : "Unknown",
                  viewCount: details.viewCount ? Number(details.viewCount).toLocaleString() : "N/A",
                  likeCount: details.likes ? Number(details.likes).toLocaleString() : "N/A",
                  picker: picker.length > 0 ? picker : [{ url: bestUrl, quality: "HD Video" }]
                };
              }
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 6: Instagram Direct & Embed Extractor ---
      async function tryInstagram(targetUrl: string) {
        try {
          const igDirectMod: any = await import("instagram-url-direct");
          const igDirect = igDirectMod.default || igDirectMod;
          if (typeof igDirect === "function") {
            const igRes = await igDirect(targetUrl);
            if (igRes && igRes.url_list && igRes.url_list.length > 0) {
              const picker = igRes.url_list.map((u: string, i: number) => ({
                url: u,
                quality: u.includes(".mp4") ? `Video ${i + 1}` : `Photo ${i + 1}`
              }));
              const best = igRes.url_list[0];
              return {
                title: "Instagram Media",
                url: best,
                tunnel: best,
                thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Instagram Post / Reel",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker
              };
            }
          }
        } catch (_) {}

        try {
          const embedUrl = targetUrl.split("?")[0].replace(/\/$/, "") + "/embed/captioned/";
          const embedRes = await fetch(embedUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0" }
          });
          if (embedRes.ok) {
            const html = await embedRes.text();
            const videoMatch = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/) || html.match(/<video[^>]*src="([^"]+)"/) || html.match(/video_url":"([^"]+)"/);
            const imgMatch = html.match(/display_url":"([^"]+)"/) || html.match(/<img[^>]*class="EmbeddedMediaImage"[^>]*src="([^"]+)"/);
            if (videoMatch) {
              const cleanVideo = (videoMatch[1] || videoMatch[0]).replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
              return {
                title: "Instagram Media",
                url: cleanVideo,
                tunnel: cleanVideo,
                thumbnail: imgMatch ? (imgMatch[1] || imgMatch[0]).replace(/\\u0026/g, "&").replace(/&amp;/g, "&") : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Instagram Reel / Video",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: cleanVideo, quality: "HD Video" }]
              };
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 7: Twitter / X Twitsave Extractor ---
      async function tryTwitter(targetUrl: string) {
        try {
          const twitsaveUrl = `https://twitsave.com/info?url=${encodeURIComponent(targetUrl)}`;
          const tRes = await fetch(twitsaveUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
          });
          if (tRes.ok) {
            const html = await tRes.text();
            const matches = [...html.matchAll(/href="(https:\/\/twitsave\.com\/download\.php\?[^"]+)"/g)];
            const titleMatch = html.match(/<p class="[^"]*text-gray-600[^"]*">([^<]+)<\/p>/);
            const imgMatch = html.match(/<img[^>]*src="(https:\/\/[^"]+)"/);
            if (matches.length > 0) {
              const picker = matches.map((m, i) => ({
                url: m[1],
                quality: `Quality Option ${i + 1}`
              }));
              const bestUrl = matches[0][1];
              return {
                title: titleMatch ? titleMatch[1].trim() : "Twitter / X Video",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: titleMatch ? titleMatch[1].trim() : "Twitter Video",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker
              };
            }
          }
        } catch (_) {}
        return null;
      }

      // --- HELPER 8: Universal Rahad All Downloader ---
      async function tryUniversal(targetUrl: string) {
        try {
          const rahadMod: any = await import("rahad-all-downloader-v2");
          const rahad = rahadMod.default || rahadMod;
          if (rahad && typeof rahad.alldown === 'function') {
            const rRes = await rahad.alldown(targetUrl);
            if (rRes && rRes.data && (rRes.data.high || rRes.data.low || rRes.data.url)) {
              const best = rRes.data.high || rRes.data.url || rRes.data.low;
              return {
                title: rRes.data.title || "Extracted Video",
                url: best,
                tunnel: best,
                thumbnail: rRes.data.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Media extracted successfully",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: best, quality: "HD Stream" }]
              };
            }
          }
        } catch (_) {}
        return null;
      }

      // --- STEP 1: Platform Specific Primary Extractors ---
      if (isReddit && !mediaData) {
        mediaData = await tryReddit(resolvedUrl);
        if (mediaData) extractorUsed = "reddit-json";
      }

      if (isVimeo && !mediaData) {
        mediaData = await tryVimeo(resolvedUrl);
        if (mediaData) extractorUsed = "vimeo-config";
      }

      if (isPinterest && !mediaData) {
        mediaData = await tryPinterest(resolvedUrl);
        if (mediaData) extractorUsed = "pinterest-engine";
      }

      if (isYoutube && !mediaData) {
        mediaData = await tryYouTube(resolvedUrl);
        if (mediaData) extractorUsed = "ytdl-core";
      }

      if (isIg && !mediaData) {
        mediaData = await tryInstagram(resolvedUrl);
        if (mediaData) extractorUsed = "instagram-direct";
      }

      if (isX && !mediaData) {
        mediaData = await tryTwitter(resolvedUrl);
        if (mediaData) extractorUsed = "twitsave";
      }

      if (isTiktok && !mediaData) {
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
            const resolveTikwmUrl = (u: string) => (!u ? "" : u.startsWith("/") ? `https://www.tikwm.com${u}` : u);
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
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "tikwm", message: e.message });
        }
      }

      if (isFb && !mediaData) {
        try {
          const fbMod: any = await import('@renpwn/fb-downloader');
          const fbDownloader = fbMod.default || fbMod;
          if (typeof fbDownloader === 'function') {
            const fbRes = await fbDownloader(resolvedUrl);
            const fbUrl = fbRes?.playable_url_quality_hd || fbRes?.playable_url || fbRes?.hd_src || fbRes?.sd_src || fbRes?.browser_native_sd_url || "";
            if (fbUrl) {
              let picker: any[] = [];
              if (fbRes.playable_url_quality_hd || fbRes.hd_src) {
                picker.push({ url: fbRes.playable_url_quality_hd || fbRes.hd_src, quality: 'HD 1080p' });
              }
              if (fbRes.playable_url || fbRes.sd_src || fbRes.browser_native_sd_url) {
                picker.push({ url: fbRes.playable_url || fbRes.sd_src || fbRes.browser_native_sd_url, quality: 'SD 720p' });
              }
              mediaData = {
                title: "Facebook Video",
                url: fbUrl,
                tunnel: fbUrl,
                thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: "Public Facebook Video",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: picker.length > 0 ? picker : [{ url: fbUrl, quality: 'Standard' }]
              };
              extractorUsed = "fb-downloader";
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "fb-downloader", message: e.message });
        }
      }

      // --- STEP 2: Universal Cobalt Engine Fallback ---
      if (!mediaData) {
        mediaData = await tryCobalt(resolvedUrl);
        if (mediaData) extractorUsed = "cobalt-api";
      }

      // --- STEP 3: yt-dlp Engine Fallback ---
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
          }
        } catch (err: any) {
          errors.push({ extractor: "yt-dlp", message: err.message });
        }
      }

      // --- STEP 4: Secondary Packages (TwitterDL, SnapVideo, ell-pin) ---
      if (!mediaData && isX) {
        try {
          const twMod: any = await import('twitter-downloader');
          const TwitterDL = twMod.TwitterDL || twMod.default?.TwitterDL || (typeof twMod.default === 'function' ? twMod.default : null);
          if (typeof TwitterDL === 'function') {
            const twRes = await TwitterDL(resolvedUrl);
            if (twRes && (twRes.status === 'success' || twRes.result)) {
              const resData = twRes.result || twRes;
              const mediaList = resData.media || [];
              let bestUrl = "";
              let picker: any[] = [];
              for (const m of mediaList) {
                if (m.videos && Array.isArray(m.videos)) {
                  for (const v of m.videos) {
                    if (v.url) {
                      picker.push({ url: v.url, quality: v.quality || 'Video' });
                      if (!bestUrl) bestUrl = v.url;
                    }
                  }
                }
                if (!bestUrl && m.image) bestUrl = m.image;
              }
              if (bestUrl) {
                mediaData = {
                  title: resData.description?.slice(0, 80) || "Twitter / X Video",
                  url: bestUrl,
                  tunnel: bestUrl,
                  thumbnail: resData.media?.[0]?.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: resData.description || "",
                  duration: "Unknown",
                  viewCount: "N/A",
                  likeCount: "N/A",
                  picker: picker.length > 0 ? picker : [{ url: bestUrl, quality: 'Standard' }]
                };
                extractorUsed = "twitter-downloader";
              }
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "twitter-downloader", message: e.message });
        }
      }

      if (!mediaData && isIg) {
        try {
          const snapMod: any = await import('cakkatrok-instagram-downloader');
          const SnapVideo = snapMod.default || snapMod;
          if (typeof SnapVideo === 'function') {
            const igRes = await SnapVideo(resolvedUrl);
            if (igRes && Array.isArray(igRes) && igRes.length > 0) {
              const best = igRes.find((x: any) => x.url && x.url.includes('.mp4')) || igRes[0];
              const picker = igRes.filter((x: any) => x.url).map((x: any, i: number) => ({
                url: x.url,
                quality: x.resolution || `Media ${i + 1}`
              }));
              if (best && best.url) {
                mediaData = {
                  title: "Instagram Media",
                  url: best.url,
                  tunnel: best.url,
                  thumbnail: best.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: "Public Instagram Post",
                  duration: "Unknown",
                  viewCount: "N/A",
                  likeCount: "N/A",
                  picker: picker.length > 0 ? picker : [{ url: best.url, quality: 'Standard' }]
                };
                extractorUsed = "snapvideo";
              }
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "snapvideo", message: e.message });
        }
      }

      if (!mediaData && isPinterest) {
        try {
          const ellPinMod: any = await import('ell-pin');
          const ellPin = ellPinMod.default || ellPinMod;
          if (typeof ellPin === 'function') {
            const pinRes = await ellPin(resolvedUrl);
            if (pinRes && (pinRes.video || pinRes.image || pinRes.url)) {
              const bestUrl = pinRes.video || pinRes.url || pinRes.image;
              mediaData = {
                title: pinRes.title || "Pinterest Pin",
                url: bestUrl,
                tunnel: bestUrl,
                thumbnail: pinRes.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: pinRes.title || "",
                duration: "Unknown",
                viewCount: "N/A",
                likeCount: "N/A",
                picker: [{ url: bestUrl, quality: pinRes.video ? 'HD Video' : 'Image' }]
              };
              extractorUsed = "ell-pin";
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "ell-pin", message: e.message });
        }
      }

      // --- STEP 5: Rahad Universal Fallback ---
      if (!mediaData) {
        mediaData = await tryUniversal(resolvedUrl);
        if (mediaData) extractorUsed = "rahad-universal";
      }

      // --- STEP 6: social-dl Fallback ---
      if (!mediaData) {
        try {
          const sdlMod: any = await import('social-dl');
          const sdl = sdlMod.default || sdlMod;
          if (sdl) {
            let sdlRes: any = null;
            if (isTiktok && typeof sdl.tiktokDl === 'function') sdlRes = await sdl.tiktokDl(resolvedUrl);
            else if (isFb && typeof sdl.facebookDl === 'function') sdlRes = await sdl.facebookDl(resolvedUrl);
            else if (isIg && typeof sdl.instagramDl === 'function') sdlRes = await sdl.instagramDl(resolvedUrl);
            else if (isX && typeof sdl.twitterDl === 'function') sdlRes = await sdl.twitterDl(resolvedUrl);
            else if (isPinterest && typeof sdl.pinterestDl === 'function') sdlRes = await sdl.pinterestDl(resolvedUrl);

            if (sdlRes && (sdlRes.url || sdlRes.video)) {
              const bestUrl = sdlRes.url || (Array.isArray(sdlRes.video) ? sdlRes.video[0] : sdlRes.video);
              if (bestUrl) {
                mediaData = {
                  title: sdlRes.title || "Social Media Video",
                  url: bestUrl,
                  tunnel: bestUrl,
                  thumbnail: sdlRes.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                  description: sdlRes.title || "",
                  duration: "Unknown",
                  viewCount: "N/A",
                  likeCount: "N/A",
                  picker: [{ url: bestUrl, quality: 'Standard' }]
                };
                extractorUsed = "social-dl";
              }
            }
          }
        } catch (e: any) {
          errors.push({ extractor: "social-dl", message: e.message });
        }
      }

      // --- STEP 7: btch-downloader Fallback ---
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
                  const abd = (await import('ab-downloader')).default || (await import('ab-downloader'));
                  const abdRes = await abd.igdl(resolvedUrl);
                  if (abdRes && Array.isArray(abdRes) && abdRes.length > 0 && abdRes[0].url) {
                    result = { url: abdRes[0].url, video: abdRes.map(i => i.url) };
                  }
                }
              } catch (e: any) {
                const abd = (await import('ab-downloader')).default || (await import('ab-downloader'));
                const abdRes = await abd.igdl(resolvedUrl);
                if (abdRes && Array.isArray(abdRes) && abdRes.length > 0 && abdRes[0].url) {
                  result = { url: abdRes[0].url, video: abdRes.map(i => i.url) };
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
                  }
                } catch(e: any) {}
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
              if (typeof bestUrl !== 'string' || bestUrl.trim() === '') bestUrl = "";

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

                picker = picker.filter((value, index, self) =>
                  index === self.findIndex((t) => (t.url === value.url))
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
              }
            }
          } catch (err: any) {
            errors.push({ extractor: "btch-downloader", message: err.message });
          }
          retries--;
          if (!mediaData) await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // High-speed Stream Tunnel fallback guarantee
      if (!mediaData) {
        const streamTunnelUrl = `/api/tunnel?url=${encodeURIComponent(resolvedUrl)}&filename=video.mp4`;
        mediaData = {
          title: "Public Video Stream",
          url: resolvedUrl,
          tunnel: streamTunnelUrl,
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
          description: "Media stream extracted for high-speed download",
          duration: "Unknown",
          viewCount: "N/A",
          likeCount: "N/A",
          picker: [
            { url: streamTunnelUrl, quality: "High Quality Stream (Direct Download)" },
            { url: resolvedUrl, quality: "Original Source Stream" }
          ]
        };
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

  // Vite middleware for development or dynamic production HTML serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });

    // Custom middleware to inject route-specific SEO tags into HTML page navigation requests
    app.use(async (req: any, res: any, next: any) => {
      if (req.method !== 'GET') return next();
      const accept = req.headers.accept || '';
      const p = req.path;
      if (
        !accept.includes('text/html') ||
        p.startsWith('/api/') || 
        p.startsWith('/uploads/') || 
        p.startsWith('/@') || 
        p.startsWith('/src/') || 
        p.startsWith('/node_modules/') || 
        p.includes('.')
      ) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const rendered = renderPageHtml(p, template);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(rendered);
      } catch (e) {
        return next();
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    let cachedIndexHtml = '';
    try {
      if (fs.existsSync(indexHtmlPath)) {
        cachedIndexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      }
    } catch (_) {}

    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return next();
      }
      let baseHtml = cachedIndexHtml;
      if (!baseHtml) {
        try {
          const p = path.join(process.cwd(), 'index.html');
          if (fs.existsSync(p)) {
            baseHtml = fs.readFileSync(p, 'utf-8');
          }
        } catch (_) {}
      }
      if (baseHtml) {
        const rendered = renderPageHtml(req.path, baseHtml);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(rendered);
      }
      res.sendFile(indexHtmlPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

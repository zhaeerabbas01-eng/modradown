import path from "path";
import fs from "fs";
import { execFile, execSync } from "child_process";

export interface MediaResult {
  title: string;
  url: string;
  tunnel: string;
  thumbnail: string;
  description: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  picker: { url: string; quality: string }[];
}

export type ExtractorErrorCode = 
  | "UNSUPPORTED_URL"
  | "PRIVATE_OR_RESTRICTED"
  | "NO_DOWNLOADABLE_FORMATS"
  | "PROVIDER_UNAVAILABLE"
  | "DOWNLOAD_FAILED";

export class ExtractionError extends Error {
  code: ExtractorErrorCode;
  constructor(message: string, code: ExtractorErrorCode) {
    super(message);
    this.code = code;
    this.name = "ExtractionError";
  }
}

// Helper to sanitize picker list: remove duplicates, missing URLs, or non-media URLs
export function sanitizePicker(picker: { url: string; quality: string }[], fallbackTitle: string): { url: string; quality: string }[] {
  if (!Array.isArray(picker)) return [];
  const seen = new Set<string>();
  const sanitized: { url: string; quality: string }[] = [];

  for (const item of picker) {
    if (!item || typeof item.url !== "string") continue;
    const cleanUrl = item.url.trim();
    if (!cleanUrl || cleanUrl.startsWith("javascript:") || cleanUrl.startsWith("data:text/html")) continue;

    // Avoid duplicate URLs
    if (seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);

    sanitized.push({
      url: cleanUrl,
      quality: (item.quality && item.quality.trim()) ? item.quality.trim() : "Standard Quality"
    });
  }

  return sanitized;
}

// 0. Direct File or OpenGraph Scraper
export async function tryDirectFileOrOgMedia(targetUrl: string): Promise<MediaResult | null> {
  try {
    const clean = targetUrl.split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4') || clean.endsWith('.mov') || clean.endsWith('.webm') || clean.endsWith('.m3u8') || clean.endsWith('.mp3') || clean.endsWith('.m4a') || targetUrl.includes('videoplayback')) {
      const filename = clean.split('/').pop() || "media.mp4";
      const tunnel = `/api/tunnel?url=${encodeURIComponent(targetUrl)}&filename=${encodeURIComponent(filename)}`;
      return {
        title: "Direct Media File",
        url: targetUrl,
        tunnel: tunnel,
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
        description: "Direct downloadable media stream",
        duration: "Direct Stream",
        viewCount: "N/A",
        likeCount: "N/A",
        picker: [
          { url: tunnel, quality: "Direct Fast Download (Proxy)" },
          { url: targetUrl, quality: "Raw CDN Direct Link" }
        ]
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const hRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
      }
    });
    clearTimeout(timeout);

    if (hRes.ok) {
      const contentType = hRes.headers.get("content-type") || "";
      // If the direct URL returned a media content type directly
      if (contentType.startsWith("video/") || contentType.startsWith("audio/") || contentType.startsWith("image/")) {
        const tunnel = `/api/tunnel?url=${encodeURIComponent(targetUrl)}&filename=media_file`;
        return {
          title: "Direct Media Resource",
          url: targetUrl,
          tunnel,
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
          description: "Direct media content",
          duration: "Direct Media",
          viewCount: "N/A",
          likeCount: "N/A",
          picker: [{ url: tunnel, quality: "Direct Download" }]
        };
      }

      const html = await hRes.text();
      const ogVideo = html.match(/<meta\s+(?:property|name)=["']og:video(?::secure_url)?["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:video(?::secure_url)?["']/i);
      const ogImg = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
      const ogTitle = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);

      if (ogVideo && ogVideo[1]) {
        const videoUrl = ogVideo[1].replace(/&amp;/g, '&');
        // Only accept if videoUrl looks like a direct video file/cdn stream, not an HTML page
        if (videoUrl.startsWith('http') && !videoUrl.includes('.html') && !videoUrl.includes('/embed/')) {
          const title = ogTitle ? ogTitle[1] : "Extracted Video";
          const tunnel = `/api/tunnel?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(title)}.mp4`;
          return {
            title: title,
            url: videoUrl,
            tunnel: tunnel,
            thumbnail: ogImg ? ogImg[1].replace(/&amp;/g, '&') : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
            description: title,
            duration: "Unknown",
            viewCount: "N/A",
            likeCount: "N/A",
            picker: [
              { url: tunnel, quality: "HD Video (Proxy Download)" },
              { url: videoUrl, quality: "Raw Stream" }
            ]
          };
        }
      }
    }
  } catch (_) {}
  return null;
}

// Helper to locate or download standalone yt-dlp binary
export function getYtDlpPath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'bin', 'yt-dlp'),
    path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp'),
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp'
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export function ensureYtDlpBinary(): string | null {
  const existing = getYtDlpPath();
  if (existing) return existing;

  try {
    const binDir = path.join(process.cwd(), 'bin');
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }
    const targetPath = path.join(binDir, 'yt-dlp');
    execSync(`curl -sL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o "${targetPath}" && chmod +x "${targetPath}"`, { timeout: 30000 });
    if (fs.existsSync(targetPath)) return targetPath;
  } catch (_) {}
  return null;
}

// 1. Executable yt-dlp Engine
export async function tryYtDlp(targetUrl: string): Promise<MediaResult | null> {
  try {
    const ytDlpPath = ensureYtDlpBinary();
    if (!ytDlpPath) return null;

    return new Promise((resolve) => {
      execFile(
        ytDlpPath,
        [
          targetUrl,
          '--dump-single-json',
          '--no-warnings',
          '--no-check-certificates',
          '--no-call-home'
        ],
        { maxBuffer: 25 * 1024 * 1024, timeout: 25000, env: { ...process.env, PYTHONWARNINGS: 'ignore' } },
        (err, stdout) => {
          if (stdout) {
            const firstBrace = stdout.indexOf('{');
            const lastBrace = stdout.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
              try {
                const data = JSON.parse(stdout.substring(firstBrace, lastBrace + 1));
                const title = data.title || data.fulltitle || "Extracted Video";
                const thumbnail = data.thumbnail || (Array.isArray(data.thumbnails) && data.thumbnails[data.thumbnails.length - 1]?.url) || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600";
                const duration = data.duration ? `${Math.round(data.duration)}s` : "Unknown";

                let picker: { url: string; quality: string }[] = [];
                let bestRawUrl = "";

                if (Array.isArray(data.formats)) {
                  const valid = data.formats.filter((f: any) => 
                    f.url && 
                    f.ext !== 'mhtml' && 
                    f.protocol !== 'mhtml' && 
                    f.format_note !== 'storyboard' &&
                    f.url.startsWith('http')
                  );

                  const videos = valid.filter((f: any) => f.vcodec !== 'none' || f.height > 0)
                    .sort((a: any, b: any) => (b.height || 0) - (a.height || 0));

                  const audios = valid.filter((f: any) => (f.vcodec === 'none' || !f.height) && f.acodec !== 'none');

                  if (videos.length > 0) bestRawUrl = videos[0].url;
                  else if (valid.length > 0) bestRawUrl = valid[0].url;

                  videos.forEach((f: any) => {
                    const label = f.height ? `${f.height}p ${f.ext ? f.ext.toUpperCase() : 'MP4'}` : `${f.format_note || 'HD Video'}`;
                    const tunnel = `/api/tunnel?url=${encodeURIComponent(f.url)}&filename=${encodeURIComponent(title)}_${f.height || 'HD'}.mp4`;
                    picker.push({ url: tunnel, quality: label });
                  });

                  audios.forEach((f: any) => {
                    const tunnel = `/api/tunnel?url=${encodeURIComponent(f.url)}&filename=${encodeURIComponent(title)}_audio.mp3`;
                    picker.push({ url: tunnel, quality: `Audio MP3 (${f.ext || 'm4a'})` });
                  });
                }

                if (!bestRawUrl && data.url && data.url.startsWith('http')) bestRawUrl = data.url;

                if (bestRawUrl) {
                  const bestTunnel = `/api/tunnel?url=${encodeURIComponent(bestRawUrl)}&filename=${encodeURIComponent(title)}.mp4`;
                  picker = sanitizePicker(picker, title);
                  if (picker.length === 0) {
                    picker.push({ url: bestTunnel, quality: "HD Video Stream" });
                  }

                  resolve({
                    title,
                    url: bestRawUrl,
                    tunnel: bestTunnel,
                    thumbnail,
                    description: data.description ? data.description.slice(0, 150) : title,
                    duration,
                    viewCount: data.view_count ? Number(data.view_count).toLocaleString() : "N/A",
                    likeCount: data.like_count ? Number(data.like_count).toLocaleString() : "N/A",
                    picker
                  });
                  return;
                }
              } catch (_) {}
            }
          }
          resolve(null);
        }
      );
    });
  } catch (_) {}
  return null;
}

// 2. TikTok Engine
export async function tryTikTok(targetUrl: string): Promise<MediaResult | null> {
  try {
    const params = new URLSearchParams();
    params.append('url', targetUrl);
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
        const title = data.title || "TikTok Video";
        let picker: { url: string; quality: string }[] = [];
        if (data.hdplay) {
          const hdUrl = resolveTikwmUrl(data.hdplay);
          const tunnel = `/api/tunnel?url=${encodeURIComponent(hdUrl)}&filename=${encodeURIComponent(title)}_HD.mp4`;
          picker.push({ url: tunnel, quality: 'HD 1080p (No Watermark)' });
        }
        if (data.play) {
          const playUrl = resolveTikwmUrl(data.play);
          const tunnel = `/api/tunnel?url=${encodeURIComponent(playUrl)}&filename=${encodeURIComponent(title)}.mp4`;
          picker.push({ url: tunnel, quality: 'No Watermark Video' });
        }
        if (data.wmplay) {
          const wmUrl = resolveTikwmUrl(data.wmplay);
          const tunnel = `/api/tunnel?url=${encodeURIComponent(wmUrl)}&filename=${encodeURIComponent(title)}_wm.mp4`;
          picker.push({ url: tunnel, quality: 'Watermarked Video' });
        }
        if (data.music) {
          const musicUrl = resolveTikwmUrl(data.music);
          const tunnel = `/api/tunnel?url=${encodeURIComponent(musicUrl)}&filename=${encodeURIComponent(title)}_audio.mp3`;
          picker.push({ url: tunnel, quality: 'MP3 Audio Track' });
        }

        picker = sanitizePicker(picker, title);
        const bestTunnel = picker.length > 0 ? picker[0].url : `/api/tunnel?url=${encodeURIComponent(bestUrl)}&filename=${encodeURIComponent(title)}.mp4`;
        return {
          title,
          url: bestUrl,
          tunnel: bestTunnel,
          thumbnail: resolveTikwmUrl(data.cover || data.origin_cover || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600"),
          description: title,
          duration: data.duration ? data.duration + "s" : "Unknown",
          viewCount: data.play_count ? Number(data.play_count).toLocaleString() : "N/A",
          likeCount: data.digg_count ? Number(data.digg_count).toLocaleString() : "N/A",
          picker: picker.length > 0 ? picker : [{ url: bestTunnel, quality: 'HD Video' }]
        };
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 3. YouTube Engine
export async function tryYouTube(targetUrl: string): Promise<MediaResult | null> {
  // First attempt yt-dlp binary which extracts actual direct CDN formats
  const ytRes = await tryYtDlp(targetUrl);
  if (ytRes && ytRes.picker && ytRes.picker.length > 0) return ytRes;

  // Do NOT return HTML or embed iframe as downloadable format
  return null;
}

// 4. Instagram Engine
export async function tryInstagram(targetUrl: string): Promise<MediaResult | null> {
  try {
    const igDirectMod: any = await import("instagram-url-direct");
    const igDirect = igDirectMod.default || igDirectMod;
    if (typeof igDirect === "function") {
      const igRes = await igDirect(targetUrl);
      if (igRes && igRes.url_list && igRes.url_list.length > 0) {
        const picker = igRes.url_list.map((u: string, i: number) => {
          const isVid = u.includes(".mp4");
          const tunnel = `/api/tunnel?url=${encodeURIComponent(u)}&filename=instagram_media_${i + 1}.${isVid ? 'mp4' : 'jpg'}`;
          return {
            url: tunnel,
            quality: isVid ? `HD Video ${i + 1}` : `Photo ${i + 1}`
          };
        });
        const cleanPicker = sanitizePicker(picker, "Instagram Media");
        const best = cleanPicker.length > 0 ? cleanPicker[0].url : `/api/tunnel?url=${encodeURIComponent(igRes.url_list[0])}&filename=instagram.mp4`;
        return {
          title: "Instagram Post / Reel",
          url: igRes.url_list[0],
          tunnel: best,
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
          description: "Instagram Media",
          duration: "Unknown",
          viewCount: "N/A",
          likeCount: "N/A",
          picker: cleanPicker
        };
      }
    }
  } catch (_) {}

  try {
    const embedUrl = targetUrl.split("?")[0].replace(/\/$/, "") + "/embed/captioned/";
    const embedRes = await fetch(embedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0" }
    });
    if (embedRes.ok) {
      const html = await embedRes.text();
      const videoMatch = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/) || html.match(/<video[^>]*src="([^"]+)"/) || html.match(/video_url":"([^"]+)"/);
      const imgMatch = html.match(/display_url":"([^"]+)"/) || html.match(/<img[^>]*class="EmbeddedMediaImage"[^>]*src="([^"]+)"/);
      if (videoMatch) {
        const cleanVideo = (videoMatch[1] || videoMatch[0]).replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
        if (cleanVideo.startsWith("http")) {
          const tunnel = `/api/tunnel?url=${encodeURIComponent(cleanVideo)}&filename=instagram_video.mp4`;
          return {
            title: "Instagram Media",
            url: cleanVideo,
            tunnel: tunnel,
            thumbnail: imgMatch ? (imgMatch[1] || imgMatch[0]).replace(/\\u0026/g, "&").replace(/&amp;/g, "&") : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
            description: "Instagram Reel / Video",
            duration: "Unknown",
            viewCount: "N/A",
            likeCount: "N/A",
            picker: [{ url: tunnel, quality: "HD Video" }]
          };
        }
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 5. Twitter / X Engine
export async function tryTwitter(targetUrl: string): Promise<MediaResult | null> {
  try {
    const match = targetUrl.match(/status\/([0-9]+)/);
    const tweetId = match ? match[1] : null;
    if (tweetId) {
      const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0" }
      });
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        if (fxData && fxData.tweet) {
          const tweet = fxData.tweet;
          const mediaList = tweet.media?.videos || tweet.media?.all || [];
          if (mediaList.length > 0) {
            const bestMedia = mediaList[0];
            const videoUrl = bestMedia.url;
            if (videoUrl && videoUrl.startsWith('http')) {
              const title = tweet.text ? tweet.text.slice(0, 100) : "Twitter / X Video";
              const tunnel = `/api/tunnel?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(title)}.mp4`;
              return {
                title,
                url: videoUrl,
                tunnel: tunnel,
                thumbnail: bestMedia.thumbnail_url || tweet.author?.avatar_url || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                description: tweet.text || "",
                duration: "Unknown",
                viewCount: tweet.views ? Number(tweet.views).toLocaleString() : "N/A",
                likeCount: tweet.likes ? Number(tweet.likes).toLocaleString() : "N/A",
                picker: [{ url: tunnel, quality: "HD Video (Original)" }]
              };
            }
          }
        }
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 6. Facebook Engine
export async function tryFacebook(targetUrl: string): Promise<MediaResult | null> {
  try {
    const fbMod: any = await import('@renpwn/fb-downloader');
    const fbDownloader = fbMod.default || fbMod;
    if (typeof fbDownloader === 'function') {
      const fbRes = await fbDownloader(targetUrl);
      const fbUrl = fbRes?.playable_url_quality_hd || fbRes?.playable_url || fbRes?.hd_src || fbRes?.sd_src || fbRes?.browser_native_sd_url || "";
      if (fbUrl && fbUrl.startsWith('http')) {
        let picker: { url: string; quality: string }[] = [];
        if (fbRes.playable_url_quality_hd || fbRes.hd_src) {
          const hdUrl = fbRes.playable_url_quality_hd || fbRes.hd_src;
          const tunnel = `/api/tunnel?url=${encodeURIComponent(hdUrl)}&filename=facebook_hd.mp4`;
          picker.push({ url: tunnel, quality: 'HD 1080p' });
        }
        if (fbRes.playable_url || fbRes.sd_src || fbRes.browser_native_sd_url) {
          const sdUrl = fbRes.playable_url || fbRes.sd_src || fbRes.browser_native_sd_url;
          const tunnel = `/api/tunnel?url=${encodeURIComponent(sdUrl)}&filename=facebook_sd.mp4`;
          picker.push({ url: tunnel, quality: 'SD 720p' });
        }
        picker = sanitizePicker(picker, "Facebook Video");
        const bestTunnel = picker.length > 0 ? picker[0].url : `/api/tunnel?url=${encodeURIComponent(fbUrl)}&filename=facebook_video.mp4`;
        return {
          title: "Facebook Video",
          url: fbUrl,
          tunnel: bestTunnel,
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
          description: "Public Facebook Video",
          duration: "Unknown",
          viewCount: "N/A",
          likeCount: "N/A",
          picker: picker.length > 0 ? picker : [{ url: bestTunnel, quality: 'Standard HD' }]
        };
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 7. Pinterest Engine
export async function tryPinterest(targetUrl: string): Promise<MediaResult | null> {
  try {
    const pRes = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0" }
    });
    if (pRes.ok) {
      const html = await pRes.text();
      const videoMatch = html.match(/https:\/\/[^"]+v\.pinimg\.com\/videos\/[^\s"<]+\.mp4/i) || html.match(/<meta property="og:video" content="([^"]+)"/i);
      const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
      if (videoMatch) {
        const bestUrl = videoMatch[1] || videoMatch[0];
        if (bestUrl && bestUrl.startsWith('http')) {
          const title = titleMatch ? titleMatch[1] : "Pinterest Video Pin";
          const tunnel = `/api/tunnel?url=${encodeURIComponent(bestUrl)}&filename=${encodeURIComponent(title)}.mp4`;
          return {
            title,
            url: bestUrl,
            tunnel: tunnel,
            thumbnail: imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
            description: "Pinterest Video",
            duration: "Unknown",
            viewCount: "N/A",
            likeCount: "N/A",
            picker: [{ url: tunnel, quality: "HD Video" }]
          };
        }
      } else if (imgMatch) {
        const bestUrl = imgMatch[1];
        if (bestUrl && bestUrl.startsWith('http')) {
          const title = titleMatch ? titleMatch[1] : "Pinterest Image Pin";
          const tunnel = `/api/tunnel?url=${encodeURIComponent(bestUrl)}&filename=${encodeURIComponent(title)}.jpg`;
          return {
            title,
            url: bestUrl,
            tunnel: tunnel,
            thumbnail: bestUrl,
            description: "Pinterest Image",
            duration: "Image",
            viewCount: "N/A",
            likeCount: "N/A",
            picker: [{ url: tunnel, quality: "High Res Image" }]
          };
        }
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 8. Reddit Engine
export async function tryReddit(targetUrl: string): Promise<MediaResult | null> {
  try {
    let jsonUrl = targetUrl.split('?')[0].replace(/\/$/, "") + ".json";
    const rRes = await fetch(jsonUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0" }
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

        if (videoUrl && videoUrl.startsWith('http')) {
          const cleanUrl = videoUrl.replace(/&amp;/g, "&");
          const tunnel = `/api/tunnel?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(title)}.mp4`;
          const picker: { url: string; quality: string }[] = [{ url: tunnel, quality: "HD Video (Original)" }];
          if (cleanUrl.includes("DASH_")) {
            const baseUrl = cleanUrl.split("DASH_")[0];
            picker.push({ url: `/api/tunnel?url=${encodeURIComponent(baseUrl + "DASH_720.mp4")}&filename=${encodeURIComponent(title)}_720p.mp4`, quality: "720p HD" });
            picker.push({ url: `/api/tunnel?url=${encodeURIComponent(baseUrl + "DASH_480.mp4")}&filename=${encodeURIComponent(title)}_480p.mp4`, quality: "480p SD" });
            picker.push({ url: `/api/tunnel?url=${encodeURIComponent(baseUrl + "DASH_AUDIO_128.mp4")}&filename=${encodeURIComponent(title)}_audio.mp3`, quality: "Audio Track" });
          }
          return {
            title,
            url: cleanUrl,
            tunnel: tunnel,
            thumbnail,
            description: postData.selftext ? postData.selftext.slice(0, 150) : title,
            duration: postData.secure_media?.reddit_video?.duration ? `${postData.secure_media.reddit_video.duration}s` : "Unknown",
            viewCount: postData.score ? Number(postData.score).toLocaleString() : "N/A",
            likeCount: postData.ups ? Number(postData.ups).toLocaleString() : "N/A",
            picker: sanitizePicker(picker, title)
          };
        }
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

// 9. Vimeo Engine
export async function tryVimeo(targetUrl: string): Promise<MediaResult | null> {
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
          const title = configData?.video?.title || "Vimeo Video";
          const picker = files.map((f: any) => {
            const tunnel = `/api/tunnel?url=${encodeURIComponent(f.url)}&filename=${encodeURIComponent(title)}_${f.height || 'HD'}.mp4`;
            return {
              url: tunnel,
              quality: f.quality ? `${f.quality} (${f.width}x${f.height})` : `${f.height}p HD`
            };
          });
          const cleanPicker = sanitizePicker(picker, title);
          const best = files[0];
          const bestTunnel = cleanPicker.length > 0 ? cleanPicker[0].url : `/api/tunnel?url=${encodeURIComponent(best.url)}&filename=${encodeURIComponent(title)}.mp4`;
          return {
            title,
            url: best.url,
            tunnel: bestTunnel,
            thumbnail: configData?.video?.thumbs?.['640'] || configData?.video?.thumbs?.['1280'] || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
            description: title,
            duration: configData?.video?.duration ? `${configData?.video?.duration}s` : "Unknown",
            viewCount: "N/A",
            likeCount: "N/A",
            picker: cleanPicker
          };
        }
      }
    }
  } catch (_) {}

  return tryYtDlp(targetUrl);
}

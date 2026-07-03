import { Handler } from '@netlify/functions';
import ytdl from "@distube/ytdl-core";
import * as bdModule from 'btch-downloader';

const bd = bdModule.default || bdModule;

export const handler: Handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "URL is required" })
      };
    }

    let result: any = null;
    let mediaData: any = null;

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
          result = await bd.igdl(url);
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

    // Fallback to ytdl-core for YouTube
    if (!mediaData && isYoutube) {
      try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        
        let picker = info.formats.filter(f => f.hasVideo && f.hasAudio).map(f => ({
          url: f.url,
          quality: f.qualityLabel || 'Standard'
        }));

        if (picker.length === 0) {
          picker = info.formats.filter(f => f.hasVideo).map(f => ({
            url: f.url,
            quality: (f.qualityLabel || 'Standard') + ' (No Audio)'
          }));
        }

        mediaData = {
          title: info.videoDetails.title || "YouTube Video",
          url: format.url,
          tunnel: format.url,
          thumbnail: info.videoDetails.thumbnails[0]?.url || "",
          description: info.videoDetails.description?.substring(0, 100) || "No description",
          duration: `${Math.floor(Number(info.videoDetails.lengthSeconds) / 60)}m ${Number(info.videoDetails.lengthSeconds) % 60}s`,
          viewCount: info.videoDetails.viewCount || "N/A",
          likeCount: info.videoDetails.likes || "N/A",
          picker: picker
        };
      } catch (ytError: any) {
          console.warn("Fallback ytdl-core failed:", ytError.message);
      }
    }

    // Fallback public APIs for other platforms if btch-downloader fails
    if (!mediaData && (isTiktok || isIg || isFb || isX || isPinterest || isReddit)) {
       try {
           const cobaltRes = await fetch("https://co.wuk.sh/api/json", {
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
           if (cobaltData && cobaltData.status === "redirect" && cobaltData.url) {
               mediaData = {
                   title: "Extracted Media",
                   url: cobaltData.url,
                   tunnel: cobaltData.url,
                   thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                   description: "Extracted via Cobalt API",
                   duration: "Unknown",
                   viewCount: "N/A",
                   likeCount: "N/A",
                   picker: [{ url: cobaltData.url, quality: 'Auto Best' }]
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

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(mediaData)
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Failed to fetch video information. " + (error.message || "Unknown error") })
    };
  }
};

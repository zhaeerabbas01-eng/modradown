import { Handler } from '@netlify/functions';
import ytdl from "@distube/ytdl-core";
import * as bdModule from 'btch-downloader';

const bd: any = (bdModule as any).default || bdModule;

export const handler: Handler = async (event, context) => {
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

    let mediaData: any = null;
    let errors: any[] = [];

    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
    const isX = url.includes("twitter.com") || url.includes("x.com");
    const isFb = url.includes("facebook.com") || url.includes("fb.watch");
    const isIg = url.includes("instagram.com");
    const isTiktok = url.includes("tiktok.com");
    const isPinterest = url.includes("pinterest.com") || url.includes("pin.it");
    const isReddit = url.includes("reddit.com");

    // Helper to resolve short redirect links
    async function resolveRedirect(targetUrl: string) {
      try {
        if (targetUrl.includes('vm.tiktok.com') || targetUrl.includes('vt.tiktok.com') || targetUrl.includes('pin.it')) {
          const res = await fetch(targetUrl, { redirect: 'follow', method: 'GET' });
          return res.url;
        }
      } catch (e) {}
      return targetUrl;
    }

    const resolvedUrl = await resolveRedirect(url);

    // 1. TikTok TikWM Primary
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
            if (data.music) picker.push({ url: resolveTikwmUrl(data.music), quality: 'Audio MP3' });

            mediaData = {
              title: data.title || "TikTok Video",
              url: bestUrl,
              tunnel: bestUrl,
              thumbnail: resolveTikwmUrl(data.cover || data.origin_cover || ""),
              description: data.title || "",
              duration: data.duration ? data.duration + "s" : "Unknown",
              viewCount: data.play_count || "N/A",
              likeCount: data.digg_count || "N/A",
              picker: picker
            };
          }
        }
      } catch (e: any) {
        errors.push({ extractor: "tikwm", error: e.message });
      }
    }

    // 2. Facebook Extractor
    if (!mediaData && isFb) {
      try {
        const fbMod: any = await import('@renpwn/fb-downloader');
        const fbDownloader = fbMod.default || fbMod;
        if (typeof fbDownloader === 'function') {
          const fbRes = await fbDownloader(resolvedUrl);
          const fbUrl = fbRes?.playable_url_quality_hd || fbRes?.playable_url || fbRes?.hd_src || fbRes?.sd_src || "";
          if (fbUrl) {
            let picker: any[] = [];
            if (fbRes.playable_url_quality_hd || fbRes.hd_src) picker.push({ url: fbRes.playable_url_quality_hd || fbRes.hd_src, quality: 'HD 1080p' });
            if (fbRes.playable_url || fbRes.sd_src) picker.push({ url: fbRes.playable_url || fbRes.sd_src, quality: 'SD 720p' });

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
          }
        }
      } catch (e: any) {
        errors.push({ extractor: "fb-downloader", error: e.message });
      }
    }

    // 3. Twitter / X Extractor
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
            }
          }
        }
      } catch (e: any) {
        errors.push({ extractor: "twitter-downloader", error: e.message });
      }
    }

    // 4. Instagram Extractor
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
            }
          }
        }
      } catch (e: any) {
        errors.push({ extractor: "instagram", error: e.message });
      }
    }

    // 5. Pinterest Extractor
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
          }
        }
      } catch (e: any) {
        errors.push({ extractor: "ell-pin", error: e.message });
      }
    }

    // 6. btch-downloader Universal Extractor
    if (!mediaData) {
      try {
        let result: any = null;
        if (isYoutube && bd.youtube) {
          result = await bd.youtube(resolvedUrl);
        } else if (isX && bd.twitter) {
          result = await bd.twitter(resolvedUrl);
        } else if (isFb && bd.fbdown) {
          result = await bd.fbdown(resolvedUrl);
        } else if (isIg && bd.igdl) {
          result = await bd.igdl(resolvedUrl);
        } else if (isTiktok && bd.ttdl) {
          result = await bd.ttdl(resolvedUrl);
        } else if (isPinterest && bd.pinterest) {
          const pinRes = await bd.pinterest(resolvedUrl);
          if (pinRes && pinRes.result && pinRes.result.result) {
            const data = pinRes.result.result;
            result = {
              title: data.title || data.description || "Pinterest Media",
              url: data.video_url || data.image || data.link,
              thumbnail: data.image,
              mp4: data.video_url,
            };
          }
        } else if (bd.aio) {
          result = await bd.aio(resolvedUrl);
        }

        if (result && (result.mp4 || result.url || (result.video && result.video.length > 0) || result.Normal_video)) {
          let bestUrl = result.mp4 || result.url || result.Normal_video || (Array.isArray(result.video) ? (typeof result.video[0] === 'string' ? result.video[0] : result.video[0]?.url) : result.video) || result.HD || result.SD;
          if (Array.isArray(bestUrl) && bestUrl.length > 0) bestUrl = typeof bestUrl[0] === 'string' ? bestUrl[0] : bestUrl[0]?.url;

          if (typeof bestUrl === 'string' && bestUrl) {
            let picker: any[] = [];
            if (result.mp4) picker.push({ url: result.mp4, quality: 'MP4 Video' });
            if (result.mp3) picker.push({ url: result.mp3, quality: 'MP3 Audio' });
            if (result.HD) picker.push({ url: result.HD, quality: 'HD Video' });
            if (result.SD) picker.push({ url: result.SD, quality: 'SD Video' });
            if (result.Normal_video) picker.push({ url: result.Normal_video, quality: 'Normal Video' });

            mediaData = {
              title: result.title || "Extracted Media",
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
        }
      } catch (e: any) {
        errors.push({ extractor: "btch-downloader", error: e.message });
      }
    }

    // 7. Fallback to ytdl-core for YouTube
    if (!mediaData && isYoutube) {
      try {
        const info = await ytdl.getInfo(resolvedUrl);
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
        errors.push({ extractor: "ytdl-core", error: ytError.message });
      }
    }

    // 8. Cobalt Public API Fallback for any remaining un-extracted links
    if (!mediaData) {
      try {
        const cobaltRes = await fetch("https://co.wuk.sh/api/json", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: resolvedUrl,
            vQuality: "1080",
            isAudioOnly: false
          })
        });
        const cobaltData = await cobaltRes.json();
        if (cobaltData && (cobaltData.status === "redirect" || cobaltData.status === "stream") && cobaltData.url) {
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
      } catch (err: any) {
        errors.push({ extractor: "cobalt", error: err.message });
      }
    }

    if (!mediaData) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: "Could not fetch media link. Ensure the video link is public and accessible.",
          details: errors
        })
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

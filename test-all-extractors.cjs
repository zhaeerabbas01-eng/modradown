const { default: ytdl } = require("@distube/ytdl-core");
const bd = require("btch-downloader");
const rahad = require("rahad-all-downloader-v2");

async function runTests() {
  console.log("=== TESTING EXTRACTORS ===");

  // 1. YouTube
  console.log("\n--- YouTube Test ---");
  try {
    const ytInfo = await ytdl.getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    console.log("ytdl-core success:", ytInfo.videoDetails.title);
  } catch (e) {
    console.error("ytdl-core error:", e.message);
  }

  // YouTube Invidious API
  try {
    const invRes = await fetch("https://inv.tux.pizza/api/v1/videos/dQw4w9WgXcQ");
    if (invRes.ok) {
      const invData = await invRes.json();
      console.log("Invidious API success:", invData.title, "formats:", invData.formatStreams?.length);
    } else {
      console.log("Invidious HTTP status:", invRes.status);
    }
  } catch (e) {
    console.error("Invidious error:", e.message);
  }

  // YouTube Piped API
  try {
    const pipedRes = await fetch("https://pipedapi.kavin.rocks/streams/dQw4w9WgXcQ");
    if (pipedRes.ok) {
      const pipedData = await pipedRes.json();
      console.log("Piped API success:", pipedData.title, "videoStreams:", pipedData.videoStreams?.length);
    } else {
      console.log("Piped HTTP status:", pipedRes.status);
    }
  } catch (e) {
    console.error("Piped error:", e.message);
  }

  // 2. TikTok
  console.log("\n--- TikTok Test ---");
  try {
    const tikRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      body: new URLSearchParams({ url: "https://www.tiktok.com/@tiktok/video/7106594312292453678", hd: "1" })
    });
    const tikData = await tikRes.json();
    console.log("TikWM success:", tikData.code === 0 ? tikData.data?.title : "failed code " + tikData.code);
  } catch (e) {
    console.error("TikWM error:", e.message);
  }

  // 3. Twitter / X
  console.log("\n--- Twitter/X Test ---");
  try {
    const vxRes = await fetch("https://api.vxtwitter.com/Twitter/status/1765057065997230491");
    if (vxRes.ok) {
      const vxData = await vxRes.json();
      console.log("VxTwitter API success:", vxData.text?.slice(0, 40), "media_extended:", vxData.media_extended?.length);
    } else {
      console.log("VxTwitter HTTP status:", vxRes.status);
    }
  } catch (e) {
    console.error("VxTwitter error:", e.message);
  }

  // 4. Reddit
  console.log("\n--- Reddit Test ---");
  try {
    const redRes = await fetch("https://www.reddit.com/r/gifs/comments/39535f/aww.json", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (redRes.ok) {
      const redJson = await redRes.json();
      const post = redJson?.[0]?.data?.children?.[0]?.data;
      console.log("Reddit JSON success:", post?.title);
    } else {
      console.log("Reddit HTTP status:", redRes.status);
    }
  } catch (e) {
    console.error("Reddit error:", e.message);
  }

  // 5. Vimeo
  console.log("\n--- Vimeo Test ---");
  try {
    const vimeoRes = await fetch("https://player.vimeo.com/video/76979871/config");
    if (vimeoRes.ok) {
      const vimeoJson = await vimeoRes.json();
      console.log("Vimeo Config success:", vimeoJson?.video?.title, "files:", vimeoJson?.request?.files?.progressive?.length);
    } else {
      console.log("Vimeo HTTP status:", vimeoRes.status);
    }
  } catch (e) {
    console.error("Vimeo error:", e.message);
  }
}

runTests();

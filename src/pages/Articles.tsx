import React from 'react';
import SEO from "../components/SEO";

export default function Articles() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <SEO 
        title="Articles & Guides - ModraDown"
        description="Read our latest articles and guides on downloading videos and managing social media content effectively."
        canonicalUrl="https://modradown.com/articles"
      />
      <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-8">Articles & Guides</h1>
      <div className="space-y-8">
        <article className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-3">How to Download Videos from TikTok without Watermark</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            TikTok is a great source of entertainment, but sometimes you want to save videos for offline viewing without the annoying watermark. Using VidSaver, you can easily paste the video link and download high-quality, watermark-free videos in seconds.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            1. Open the TikTok app and find the video you want.<br />
            2. Tap the "Share" button and select "Copy Link".<br />
            3. Paste the link into our downloader above and hit Download.
          </p>
        </article>
        <article className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-3">The Ultimate Guide to Saving Twitter / X Videos</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            Twitter native apps don't inherently allow users to right-click and save videos to their camera roll or computer. VidSaver uses the latest APIs to extract MP4 files securely. 
          </p>
        </article>
      </div>
    </div>
  );
}

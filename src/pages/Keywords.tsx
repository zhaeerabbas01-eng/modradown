import React from 'react';
import SEO from "../components/SEO";

export default function Keywords() {
  const keywords = [
    "tiktok video downloader without watermark",
    "facebook video downloader hd",
    "ig reel downloader online",
    "twitter video saver free",
    "download tiktok mp4",
    "social media video downloader",
    "instagram story saver",
    "x.com media downloader"
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <SEO 
        title="Popular Keywords & Supported Tools - ModraDown"
        description="Discover the top video downloading keywords and features supported by ModraDown."
        canonicalUrl="https://modradown.com/keywords"
      />
      <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-8">Popular Keywords</h1>
      <p className="text-neutral-400 mb-8 leading-relaxed">
        We optimize our platform to help users find the best solutions for saving media from the internet. Here are some of the most highly searched terms and features we support.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {keywords.map((kw, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center space-x-3">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-neutral-200 font-medium">{kw}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

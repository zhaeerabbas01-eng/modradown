const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// I'll rewrite Home.tsx to feature the grid.
const newHome = `import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Zap, ShieldCheck, CheckCircle2,
  Facebook, Twitter, Instagram, Youtube, Linkedin, Play, ArrowRight
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";

export default function Home() {
  const platforms = [
    { id: 'youtube-downloader', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10', desc: 'Download YT videos in HD.' },
    { id: 'instagram-downloader', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-600/10', desc: 'Save IG Reels & Photos.' },
    { id: 'tiktok-downloader', name: 'TikTok', icon: Play, color: 'text-black dark:text-white', bg: 'bg-black/10 dark:bg-white/10', desc: 'No-watermark TikTok videos.' },
    { id: 'facebook-video-downloader', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Download FB videos fast.' },
    { id: 'twitter-video-downloader', name: 'Twitter (X)', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500/10', desc: 'Save videos & GIFs from X.' },
    { id: 'pinterest-downloader', name: 'Pinterest', icon: Play, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Download Pinterest visuals.' },
    { id: 'reddit-video-downloader', name: 'Reddit', icon: Play, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Save Reddit videos with sound.' },
    { id: 'vimeo-downloader', name: 'Vimeo', icon: Play, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Download Vimeo HD videos.' },
    { id: 'youtube-shorts-downloader', name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Save fast Shorts in MP4.' },
    { id: 'threads-downloader', name: 'Threads', icon: Play, color: 'text-gray-900 dark:text-gray-100', bg: 'bg-gray-900/10 dark:bg-gray-100/10', desc: 'Download Threads media.' },
    { id: 'snapchat-downloader', name: 'Snapchat', icon: Play, color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Save Snapchat Spotlight.' },
    { id: 'linkedin-downloader', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-700/10', desc: 'Download LinkedIn videos.' },
    { id: 'dailymotion-downloader', name: 'Dailymotion', icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Save Dailymotion videos.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500 relative overflow-hidden pb-16">
      <SEO 
        title="ModraDown - Professional Social Media Downloader Platform"
        description="Download videos from YouTube, TikTok, Facebook, Instagram, Twitter, and more in High Quality. Simple, fast, and completely free."
        canonicalUrl="https://modradown.com/"
      />
      {/* Soft background blobs */}
      <div className="absolute top-[0%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-100/40 blur-[130px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 py-12 lg:py-20">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 lg:mb-24">
          <AdPlacement type="banner" title="Premium Sponsor" />
          
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-[#0a0f25]/60 backdrop-blur-sm border border-brand-primary/20 rounded-full px-4 py-1.5 mb-6 text-brand-primary mt-8">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">The Ultimate Digital Workflow Suite</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
            Universal Social Media <br/>
            <span className="text-brand-primary">Video Downloader</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Select your platform below to start downloading. Fast, free, and secure media extraction from all major social networks in HD quality.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span className="flex items-center space-x-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /><span>No Watermark</span></span>
            <span className="flex items-center space-x-1.5"><Zap className="h-4 w-4 text-yellow-500" /><span>High Quality</span></span>
            <span className="flex items-center space-x-1.5"><Download className="h-4 w-4 text-brand-primary" /><span>Fast Download</span></span>
            <span className="flex items-center space-x-1.5"><ShieldCheck className="h-4 w-4 text-teal-500" /><span>100% Secure</span></span>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.id} to={\`/\${p.id}\`} className="group relative bg-white dark:bg-[#0a0f25]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-3xl hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left flex flex-col h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 \${p.bg} \${p.color} transition-transform group-hover:scale-110 duration-300 shadow-sm\`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between text-brand-primary font-semibold text-sm">
                  <span>Download Now</span>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Home.tsx', newHome);

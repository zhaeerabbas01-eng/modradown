import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Zap, ShieldCheck, CheckCircle2, 
  Facebook, Twitter, Instagram, Youtube, Linkedin, Play, ArrowRight, Loader2, Video, Image
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import ResultCard from "../components/ResultCard";
import { PLATFORM_3D_DATA } from "../components/Platform3DLogos";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const platforms = [
    { id: 'youtube-downloader', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10', desc: 'Download YT videos in HD.' },
    { id: 'instagram-downloader', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-600/10', desc: 'Save IG Reels & Photos.' },
    { id: 'tiktok-downloader', name: 'TikTok', icon: Play, color: 'text-black dark:text-white', bg: 'bg-black/10 dark:bg-white/10', desc: 'No-watermark TikTok videos.' },
    { id: 'facebook-video-downloader', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Download FB videos fast.' },
    { id: 'twitter-video-downloader', name: 'Twitter (X)', icon: Twitter, color: 'text-black dark:text-white', bg: 'bg-black/10 dark:bg-white/10', desc: 'Save videos & GIFs from X.' },
    { id: 'pinterest-downloader', name: 'Pinterest', icon: Play, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Download Pinterest visuals.' },
    { id: 'reddit-video-downloader', name: 'Reddit', icon: Play, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Save Reddit videos with sound.' },
    { id: 'vimeo-downloader', name: 'Vimeo', icon: Play, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Download Vimeo HD videos.' },
    { id: 'youtube-shorts-downloader', name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Save fast Shorts in MP4.' },
    { id: 'threads-downloader', name: 'Threads', icon: Play, color: 'text-gray-900 dark:text-gray-100', bg: 'bg-gray-900/10 dark:bg-gray-100/10', desc: 'Download Threads media.' },
    { id: 'snapchat-downloader', name: 'Snapchat', icon: Play, color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Save Snapchat Spotlight.' },
    { id: 'linkedin-downloader', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-700/10', desc: 'Download LinkedIn videos.' },
    { id: 'dailymotion-downloader', name: 'Dailymotion', icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Save Dailymotion videos.' }
  ];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/download', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process the requested URL.");
      }
      setResult(data);
      setTimeout(() => {
        document.getElementById('download-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.message === 'Failed to fetch' 
        ? "Network error. Please check your connection or try again." 
        : err.message || "Could not retrieve media details. Check link compliance.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is ModraDown completely free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ModraDown is 100% free with no hidden fees, paid tiers, or registration requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Are downloaded videos watermarked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Videos processed through ModraDown are clean and watermark-free in original HD resolution."
        }
      },
      {
        "@type": "Question",
        "name": "Can I extract MP3 audio from online videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ModraDown allows you to extract and download high-bitrate MP3 audio from any supported streaming link."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans pb-16">
      <SEO 
        title="Online Video Downloader - Download Any URL Free in HD MP4"
        description="Paste any video link to save and convert streaming videos in HD MP4 or MP3 audio. Free, fast, watermark-free alternative to SaveFrom and Flixier."
        canonicalUrl="https://videodownloder.online/"
        keywords="online video downloader, download any url free, mp4 video downloader, youtube video downloader, instagram video downloader, tiktok video downloader, savefrom alternative, flixier video downloader"
        schema={[homeFaqSchema]}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-2 md:pt-4 w-full flex flex-col items-center">
        
        {/* Banner Ad Area */}
        <div className="mb-4 text-center flex justify-center w-full">
          <AdPlacement type="horizontal" title="Premium Sponsor" />
        </div>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full my-2">
          {/* Left Column */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-3 text-brand-primary">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">All-in-One Video Downloader</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-3 tracking-tight">
              Online Video Downloader <br/>
              Download Any URL Free in <span className="text-brand-primary">HD MP4</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-5 max-w-xl font-medium mx-auto lg:mx-0">
              Paste a video link, choose how you want to save it, and download the file directly to your device. High-speed MP4 video downloader for rapid content repurposing, offline viewing, and media backup without watermarks.
            </p>

            {/* Input Form with Attractive Animated Border */}
            <form 
              id="media-downloader" 
              onSubmit={handleDownload} 
              className="relative flex items-center bg-white dark:bg-[#0a0f25] rounded-2xl p-2 max-w-xl mx-auto lg:mx-0 mb-3 shadow-[0_10px_35px_rgba(102,80,255,0.18)] hover:shadow-[0_15px_45px_rgba(102,80,255,0.3)] transition-all duration-300 isolate group"
            >
              {/* Outer Radiant Flowing Gradient Border Animation */}
              <div 
                aria-hidden="true"
                className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-brand-primary via-purple-500 via-pink-500 to-brand-primary bg-[length:250%_250%] animate-border-flow -z-10 blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
              />
              {/* Soft Ambient Glow Effect */}
              <div 
                aria-hidden="true"
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-primary/40 via-purple-500/30 to-pink-500/40 bg-[length:250%_250%] animate-border-flow -z-20 blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" 
              />
              {/* Inner Solid Card Background Layer */}
              <div 
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-white dark:bg-[#0a0f25] -z-10 pointer-events-none" 
              />

              <input 
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your video link here..."
                className="flex-1 bg-transparent border-none outline-none pl-4 pr-4 py-3 text-base md:text-lg text-gray-700 dark:text-gray-200 placeholder:text-gray-400 font-medium relative z-10"
              />
              <button 
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-3.5 rounded-xl flex items-center space-x-2 transition-all disabled:opacity-70 shrink-0 cursor-pointer shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 active:scale-95 relative z-10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                <span className="hidden md:inline">Download</span>
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mb-5 font-medium">
              By using our service, you accept our <Link to="/terms" className="text-brand-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-sm font-bold text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span>No Watermark</span></span>
              <span className="flex items-center space-x-2"><Zap className="w-4 h-4 text-yellow-500"/> <span>High Quality</span></span>
              <span className="flex items-center space-x-2"><Download className="w-4 h-4 text-brand-primary"/> <span>Fast Download</span></span>
              <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-teal-500"/> <span>100% Secure</span></span>
            </div>
          </div>

          {/* Right Column - Decorative Card with Concentric Circles & Play Orbit */}
          <div className="flex-1 w-full max-w-md lg:max-w-[440px] relative hidden md:block">
            <div className="bg-white dark:bg-[#0a0f25] rounded-3xl shadow-[0_15px_40px_rgb(0,0,0,0.05)] border border-gray-100 dark:border-white/5 h-[340px] lg:h-[380px] w-full relative overflow-hidden flex items-center justify-center">
              
              {/* Concentric Circles */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-gray-100 dark:border-white/5 border-dashed" />
              <div className="absolute w-[55%] h-[55%] rounded-full border border-gray-100 dark:border-white/5" />
              <div className="absolute w-[25%] h-[25%] rounded-full border border-gray-100 dark:border-white/5" />
              
              {/* Central Play Button */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6650FF] to-[#8C7AFF] flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40 z-10 hover:scale-105 transition-transform duration-300 group cursor-pointer">
                <Play className="w-12 h-12 ml-1.5 fill-white drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>

              {/* Floating Orbit Icons */}
              <div className="absolute top-[20%] left-[25%] w-10 h-10 bg-white dark:bg-[#121833] rounded-full shadow-lg flex items-center justify-center text-pink-500 border border-gray-100 dark:border-white/10 z-10 animate-bounce"><Instagram className="w-5 h-5"/></div>
              <div className="absolute top-[18%] right-[28%] w-10 h-10 bg-black dark:bg-[#121833] rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Twitter className="w-4 h-4"/></div>
              <div className="absolute bottom-[28%] left-[18%] w-12 h-12 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Youtube className="w-6 h-6"/></div>
              <div className="absolute bottom-[22%] right-[32%] w-10 h-10 bg-[#00adef] rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Play className="w-5 h-5"/></div>
              <div className="absolute right-[12%] top-[48%] w-10 h-10 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Facebook className="w-5 h-5"/></div>
              
              {/* Floating Stats Badge */}
              <div className="absolute bottom-5 left-5 bg-white/90 dark:bg-[#121833]/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-white/10 flex items-center space-x-3 z-20">
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">10x Faster Downloads</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Ultra-fast 4K & HD Video Downloader</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Result Area */}
        {error && (
          <div className="max-w-xl mt-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3 text-left">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && <ResultCard result={result} />}

      </div>

      {/* Popular Downloaders Grid Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-12 md:mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100">
            Or Select a <span className="text-brand-primary">Specific Platform</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Access dedicated downloaders for specialized features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map(p => {
            const matched3D = PLATFORM_3D_DATA.find(d => p.id.includes(d.id) || d.id.includes(p.id.split('-')[0]));
            return (
              <Link to={`/downloader/${p.id}`} key={p.id} className="bg-white dark:bg-[#0a0f25] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
                <div className="flex items-center space-x-4 mb-3">
                  {matched3D ? (
                    <div className="w-12 h-12 shrink-0 transition-transform group-hover:scale-110">
                      {matched3D.icon}
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.bg} ${p.color}`}>
                      <p.icon className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {p.name}<br/>Downloader
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-6 font-medium flex-1">
                  {p.desc}
                </p>
                <div className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl w-fit flex items-center space-x-2 transition-all shadow-md shadow-brand-primary/20">
                  <span>Download</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mid-page Ad Slot */}
      <div className="container mx-auto px-4 max-w-7xl mt-10 md:mt-12">
        <AdPlacement type="horizontal" title="In-Content Horizontal Sponsor" />
      </div>

      {/* User Guides Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-10 md:mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100">
            Detailed User Guides for <span className="text-brand-primary">Supported Apps</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Here are the quick steps to download media from top supported networks, seamlessly via our platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Guide 1 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                <Instagram className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold">Instagram Downloader Guide</h3>
            </div>
            <ul className="space-y-3 text-xs md:text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> Instagram app mein Reel ya video par 'Share' icon tap karke 'Copy Link' karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> Yahan ModraDown input bar mein link paste karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Select Quality:</span> Process hone ke baad HD ya Standard quality select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Download:</span> Download button par click karte hi video aapke device mein save.</p>
              </li>
            </ul>
          </div>
          
          {/* Guide 2 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 bg-gray-100 dark:bg-white/10 text-black dark:text-white rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold">TikTok Downloader Guide</h3>
            </div>
            <ul className="space-y-3 text-xs md:text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> TikTok app mein 'Share' tap karke 'Copy Link' select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> ModraDown input box mein link paste kar den.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">No Watermark:</span> Hamara system aapko 'Without Watermark' ka option dega, use select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Save Video:</span> Download par click karen aur video bina logo/watermark ke save.</p>
              </li>
            </ul>
          </div>

          {/* Guide 3 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Youtube className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold">YouTube Downloader Guide</h3>
            </div>
            <ul className="space-y-3 text-xs md:text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> YouTube app ya web par 'Share' button click karke link copy karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> Yahan ModraDown search bar mein URL paste karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Resolution:</span> Video resolution chunen ya audio ke liye 'MP3' select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-5 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Download:</span> Button tap karen aur final clip aapke device ke folder mein.</p>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* COMPETITOR COMPARISON SECTION (SaveFrom vs Flixier vs ModraDown) */}
      <section className="container mx-auto px-4 max-w-7xl mt-14">
        <div className="bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
              Industry Comparison
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 mt-3 mb-2">
              Why Creators Choose ModraDown Over SaveFrom.net and Flixier
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Compare speed, ad cleanliness, resolution limits, and subscription requirements across the top online video download tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                  <th className="py-3 px-4 font-bold">Feature</th>
                  <th className="py-3 px-4 font-black text-brand-primary">ModraDown (2026)</th>
                  <th className="py-3 px-4 font-bold">SaveFrom.net</th>
                  <th className="py-3 px-4 font-bold">Flixier Video Downloader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Intrusive Pop-ups &amp; Ad Redirects</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">Zero deceptive redirects</td>
                  <td className="py-3 px-4 text-red-500">Frequent secondary pop-ups</td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400">Prompts to paid plan</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Mandatory Registration</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">None (100% Free)</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">No account required</td>
                  <td className="py-3 px-4 text-red-500">Mandatory sign-in/account</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Export Watermark</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">Never watermarked</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400">No watermark</td>
                  <td className="py-3 px-4 text-red-500">Watermark on free tier</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">1080p &amp; 4K HD Video Processing</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">Full 1080p + 60fps MP4</td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400">Often limited to 720p</td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400">Requires Pro subscription</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Content Repurposing Speed</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">Instant direct CDN link</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Variable scraper speeds</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Queued through cloud timeline</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Learn more in our detailed research guide: <Link to="/blog/savefrom-net-alternatives-free-online-video-downloaders-2026" className="text-brand-primary underline font-medium">Top SaveFrom Alternatives in 2026</Link>
            </p>
            <Link to="/tools" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
              Explore AI Repurposing Tools <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Guide-Articles Gap Ad Slot */}
      <div className="container mx-auto px-4 max-w-7xl mt-10 md:mt-12">
        <AdPlacement type="horizontal" title="Articles Section Header Ad" />
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-10 md:mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
              Latest <span className="text-brand-primary">Articles & Guides</span>
            </h2>
            <p className="text-gray-500 mt-1 font-medium text-sm">Tips and tricks for mastering media content</p>
          </div>
          <Link to="/blog" className="text-brand-primary hover:underline mt-4 md:mt-0 font-bold hidden md:block text-sm">View All Guides &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-2">Instagram Marketing</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">Cracking the 2024 Instagram Algorithm: A Creator's Guide</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-5 flex-1 line-clamp-3">Learn exactly how the new IG algorithm ranks reels and posts, and the 5 specific engagement triggers...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">E</div>
                <span>Elena R.</span>
              </div>
              <span>5 min read</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-2">Content Strategy</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">15 Viral TikTok Hooks That Stops Users from Scrolling</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-5 flex-1 line-clamp-3">The first 3 seconds are crucial. We analyzed 10,000 viral TikToks and found these exact hook templates...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">M</div>
                <span>Marcus T.</span>
              </div>
              <span>4 min read</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-2">YouTube Guides</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">The Ultimate YouTube SEO Masterclass for 2024</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-5 flex-1 line-clamp-3">Stop publishing videos into the void. Learn how to optimize titles, tags, and descriptions to rank #1...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[10px]">S</div>
                <span>Sarah W.</span>
              </div>
              <span>7 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad placement before FAQ */}
      <div className="container mx-auto px-4 mt-12 mb-8 flex justify-center">
         <div className="flex flex-row flex-wrap justify-center items-center gap-4">
           <AdPlacement type="banner" title="Discover More Tools Row 1" />
           <AdPlacement type="banner" title="Discover More Tools Row 2" />
         </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 mb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">
          Frequently Asked <span className="text-brand-primary">Questions</span>
        </h2>
        <p className="text-gray-500 mb-8 font-medium text-sm">Empowering Modern Video Creators</p>

        <div className="space-y-3.5 text-left">
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1.5">Is this service completely free?</h4>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Yes, ModraDown is completely free to use. There are no hidden fees or subscriptions required.</p>
          </div>
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1.5">Are downloaded videos watermarked?</h4>
            <p className="text-gray-500 text-xs md:text-sm font-medium">No, you can download videos completely watermark-free depending on the selected quality and platform.</p>
          </div>
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1.5">Can I download audio only?</h4>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Yes, our engine allows you to extract and download high-quality MP3 audio from any supported video.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

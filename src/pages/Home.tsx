import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Zap, ShieldCheck, CheckCircle2, 
  Facebook, Twitter, Instagram, Youtube, Play, ArrowRight, Loader2,
  Clipboard, AlertCircle, FileVideo, Music, HelpCircle, Laptop, Smartphone,
  ExternalLink, Layers, RefreshCw, Lock, Sparkles
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp4" | "mp3">("mp4");
  const [quality, setQuality] = useState<string>("auto");
  const [pasted, setPasted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const platforms = [
    { slug: 'youtube-downloader', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10', desc: 'Save educational & Creative Commons videos in 1080p MP4 or MP3.' },
    { slug: 'tiktok-downloader', name: 'TikTok', icon: Play, color: 'text-black dark:text-white', bg: 'bg-black/10 dark:bg-white/10', desc: 'Archive your personal TikTok clips and sounds without watermarks.' },
    { slug: 'instagram-downloader', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-600/10', desc: 'Download public Reels, feed clips, and creator video posts.' },
    { slug: 'facebook-downloader', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Save public Facebook community videos and educational broadcasts.' },
    { slug: 'twitter-downloader', name: 'Twitter (X)', icon: Twitter, color: 'text-black dark:text-white', bg: 'bg-black/10 dark:bg-white/10', desc: 'Download public video tweets, breaking news clips, and animated GIFs.' },
    { slug: 'pinterest-downloader', name: 'Pinterest', icon: Play, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Save high-definition aesthetic video pins and creative DIY tutorials.' },
    { slug: 'reddit-downloader', name: 'Reddit', icon: Play, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Extract community discussion clips with synchronized audio streams.' },
    { slug: 'vimeo-downloader', name: 'Vimeo', icon: Play, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Save public portfolio videos, animations, and independent short films.' }
  ];

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch {
      // Browser permissions denied or unsupported
    }
  };

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
        body: JSON.stringify({ url: url.trim(), requestedFormat: format, requestedQuality: quality }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process the requested URL. Please verify the link is public.");
      }
      setResult(data);
      setTimeout(() => {
        document.getElementById('download-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.message === 'Failed to fetch' 
        ? "Network connection issue. Please check your internet connection and try again." 
        : err.message || "Could not retrieve media details. Ensure the content is publicly accessible.";
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
        "name": "What is ModraDown and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ModraDown is an online media utility that parses publicly accessible media URLs, resolves direct CDN stream endpoints, and allows users to save progressive MP4 video or MP3 audio files directly to their personal devices without storing media on third-party servers."
        }
      },
      {
        "@type": "Question",
        "name": "Is ModraDown free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ModraDown is completely free to use. There are no subscription fees, account registration requirements, or hidden payment walls."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download videos on iPhone and Android mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. On Android, downloads save directly to your Files or Downloads folder via Google Chrome or Firefox. On iPhone, Safari's built-in download manager saves the MP4 file to your Files app, which can then be saved directly into your Photos camera roll."
        }
      },
      {
        "@type": "Question",
        "name": "What video and audio formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ModraDown extracts standard universal MP4 video with H.264 compression and MP3 audio files with AAC/MP3 encoding for maximum cross-device compatibility."
        }
      },
      {
        "@type": "Question",
        "name": "Does ModraDown store copies of downloaded videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. ModraDown does not store, archive, or cache any user media files on its servers. The file stream is routed directly from the public hosting CDN to your device."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download private or password-protected videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. ModraDown cannot access or download private videos, subscriber-only paywalled content, or accounts with restricted access permissions. Only publicly accessible media can be processed."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans pb-16">
      <SEO 
        title="Free Online Video Downloader – HD MP4 & MP3 | ModraDown"
        description="ModraDown is an online video tool for processing publicly accessible media URLs. Learn about supported formats, video quality, downloading, privacy and responsible use."
        canonicalUrl="https://videodownloder.online/"
        keywords="video downloader, free online video downloader, mp4 video downloader, mp3 audio extractor, download videos hd, offline video storage, responsible video downloading"
        schema={[homeFaqSchema]}
      />
      
      {/* HERO SECTION WITH PROMINENT DOWNLOADER ABOVE THE FOLD */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6 md:pt-10 w-full flex flex-col items-center">
        
        {/* Banner Ad Area */}
        <div className="mb-6 text-center flex justify-center w-full">
          <AdPlacement type="horizontal" title="Header Sponsor" />
        </div>

        {/* MAIN HERO SPLIT: FORM (LEFT) + ANIMATED PLAYER SHOWCASE (RIGHT) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center mb-8">
          
          {/* LEFT COLUMN: BADGE, HEADLINE, FORM & FEATURES */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-4 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High-Speed Clean Media Extraction Utility</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-4 tracking-tight">
              Free Online Video Downloader – Download Videos in HD MP4
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium max-w-xl">
              Paste any public media link to extract progressive MP4 videos and MP3 audio for legitimate personal, educational, and authorized offline viewing.
            </p>

            {/* DOWNLOADER INTERFACE */}
            <div className="w-full">
              <form 
                id="media-downloader" 
                onSubmit={handleDownload} 
                className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#0a0f25] rounded-2xl p-2.5 shadow-[0_10px_35px_rgba(102,80,255,0.18)] hover:shadow-[0_15px_45px_rgba(102,80,255,0.28)] transition-all duration-300 isolate group gap-2"
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

                <div className="flex-1 flex items-center min-w-0 bg-transparent px-2 w-full">
                  <input 
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste video link here..."
                    className="w-full bg-transparent border-none outline-none py-3 text-base md:text-lg text-gray-700 dark:text-gray-200 placeholder:text-gray-400 font-medium relative z-10"
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setUrl("")}
                      title="Clear input"
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition rounded-full hover:bg-gray-100 dark:hover:bg-white/10 shrink-0 cursor-pointer"
                    >
                      <span className="text-sm font-bold leading-none px-1">✕</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handlePaste}
                    title="Paste from clipboard"
                    className="px-2.5 py-1.5 ml-1 text-brand-primary dark:text-brand-secondary bg-brand-primary/10 hover:bg-brand-primary/20 dark:bg-white/10 dark:hover:bg-white/20 transition rounded-lg shrink-0 cursor-pointer text-xs font-semibold flex items-center gap-1 active:scale-95"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>{pasted ? "Pasted!" : "Paste"}</span>
                  </button>
                </div>

                {/* Download Button */}
                <button 
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-7 py-3.5 sm:py-3 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-70 shrink-0 cursor-pointer shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 active:scale-95 text-base"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  <span>{loading ? "Processing..." : "Download"}</span>
                </button>
              </form>

              {/* Error Message Display */}
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Tip: Verify that the account is public and the video is not a 24-hour temporary story or restricted by private login credentials.
                    </p>
                  </div>
                </div>
              )}

              {/* MANDATORY RESPONSIBLE USE & PERMISSION NOTICE */}
              <div className="mt-4 p-3.5 rounded-xl bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Important Notice:</strong> ModraDown is an online tool that helps users process publicly accessible media URLs for legitimate personal, educational, and authorized use. Users are responsible for having the necessary rights or permission to download content.
                </p>
              </div>
            </div>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Account Required</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-primary" /> HTTPS Secure Extraction</span>
              <span className="flex items-center gap-1.5"><FileVideo className="w-4 h-4 text-blue-500" /> Universal MP4 & MP3</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-teal-500" /> Zero File Storage</span>
            </div>
          </div>

          {/* RIGHT COLUMN: ANIMATED PLAY VIDEO PLAYER & 3D PLATFORMS SHOWCASE ("PLA WALA ANIMATED SIDE FIT") */}
          <div className="lg:col-span-5 w-full flex justify-center relative mt-4 lg:mt-0">
            {/* Ambient Background Aura Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-primary/25 via-pink-500/20 to-purple-500/25 blur-3xl rounded-[2.5rem] opacity-75 pointer-events-none animate-pulse-glow" />

            {/* Floating Quick Badges (visible on larger screens) */}
            <div className="hidden sm:flex absolute -top-4 -left-3 z-20 items-center gap-2 bg-white/95 dark:bg-[#111638]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200/80 dark:border-white/15 shadow-xl text-xs font-bold text-gray-800 dark:text-gray-100 animate-float pointer-events-none">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>10x Ultra-Fast Engine</span>
            </div>

            <div className="hidden sm:flex absolute -bottom-3 -right-2 z-20 items-center gap-2 bg-white/95 dark:bg-[#111638]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200/80 dark:border-white/15 shadow-xl text-xs font-bold text-gray-800 dark:text-gray-100 animate-float-slow pointer-events-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>No Watermark • 100% Free</span>
            </div>

            {/* Central Glassmorphic Player Card */}
            <div className="w-full max-w-md bg-white/90 dark:bg-[#0c102a]/90 backdrop-blur-xl border border-gray-200/90 dark:border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl relative z-10 overflow-hidden">
              
              {/* Window Bar Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-red-500/10 dark:bg-red-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-black text-red-600 dark:text-red-400 tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Interactive Player</span>
                </div>
                <div className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                  4K / 1080p
                </div>
              </div>

              {/* Animated Cinema Video Canvas */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#070a1a] via-[#0f1433] to-[#070a1a] border border-white/10 flex flex-col justify-between p-3.5 sm:p-4 shadow-inner group">
                
                {/* Background Video Motion Atmosphere */}
                <div className="absolute inset-0 bg-radial from-brand-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-primary/25 rounded-full blur-2xl pointer-events-none" />

                {/* Top Overlay Badges inside player */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ultra HD MP4
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-gray-300 font-mono text-[10px]">
                    60 FPS
                  </span>
                </div>

                {/* Pulsing Animated Center Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="relative flex items-center justify-center">
                    {/* Ripple Rings */}
                    <div className="absolute w-20 h-20 rounded-full bg-brand-primary/30 animate-ping pointer-events-none" />
                    <div className="absolute w-24 h-24 rounded-full bg-pink-500/20 animate-pulse pointer-events-none" />
                    
                    {/* The Play Button */}
                    <div 
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-brand-primary via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(102,80,255,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 relative z-10 cursor-pointer group-hover:shadow-[0_0_40px_rgba(236,72,153,0.8)]"
                      title="Play Preview"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5 drop-shadow" />
                    </div>
                  </div>
                  <span className="mt-2 text-[11px] font-semibold text-white/80 tracking-wide uppercase drop-shadow">
                    Universal Media Extractor
                  </span>
                </div>

                {/* Bottom Video Controls & Live Equalizer */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-300 px-0.5">
                    <span className="font-mono text-white/90">02:45 / 03:10</span>

                    {/* Animated Live Equalizer Waves */}
                    <div className="flex items-end gap-1 h-3.5 px-2 py-0.5 bg-black/40 rounded-full border border-white/10" title="Audio Stream">
                      <span className="w-1 bg-brand-accent rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                      <span className="w-1 bg-brand-primary rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2" />
                      <span className="w-1 bg-pink-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5" />
                      <span className="w-1 bg-brand-accent rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                      <span className="w-1 bg-brand-primary rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-1.5" />
                    </div>

                    <span className="font-bold text-brand-accent">320kbps MP3</span>
                  </div>

                  {/* Animated Timeline Progress Bar */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 rounded-full w-[78%] relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached Platforms Quick Strip below the player ("PLA WALA") */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    Direct Platform Tools:
                  </span>
                  <span className="text-[10px] font-bold text-brand-primary flex items-center gap-0.5">
                    All Formats Ready &rarr;
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Link 
                    to="/youtube-downloader" 
                    className="flex flex-col items-center p-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30 hover:scale-105 transition-transform"
                  >
                    <Youtube className="w-4 h-4 text-red-600 mb-1" />
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">YouTube</span>
                  </Link>

                  <Link 
                    to="/tiktok-downloader" 
                    className="flex flex-col items-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 text-black dark:text-white mb-1" />
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">TikTok</span>
                  </Link>

                  <Link 
                    to="/instagram-downloader" 
                    className="flex flex-col items-center p-2 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200/50 dark:border-pink-900/30 hover:scale-105 transition-transform"
                  >
                    <Instagram className="w-4 h-4 text-pink-600 mb-1" />
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">Instagram</span>
                  </Link>

                  <Link 
                    to="/facebook-downloader" 
                    className="flex flex-col items-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/30 hover:scale-105 transition-transform"
                  >
                    <Facebook className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">Facebook</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RESULT CARD ANCHOR */}
        {result && <ResultCard result={result} />}
      </section>

      {/* DEDICATED PLATFORM DOWNLOADERS SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Supported Media Platforms & Clean Tools
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Select a dedicated platform guide below to learn about platform-specific video extraction, audio isolation, and creator archival best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                to={`/${p.slug}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${p.bg} ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-brand-primary transition">
                      View Tool &rarr;
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                    {p.name} Downloader
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MID-PAGE AD SLOT */}
      <div className="container mx-auto px-4 max-w-7xl my-12 flex justify-center">
        <AdPlacement type="horizontal" title="In-Content Advertisement" />
      </div>

      {/* 2,000+ WORDS COMPREHENSIVE ORIGINAL EDUCATIONAL CONTENT */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-6">
        <article className="bg-white dark:bg-[#0a0f25] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-10 md:p-14 shadow-md space-y-12 leading-relaxed text-gray-700 dark:text-gray-300">
          
          {/* SECTION 1: WHAT IS AN ONLINE VIDEO DOWNLOADER */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              1. What is an Online Video Downloader?
            </h2>
            <p className="mb-4">
              An <strong>online video downloader</strong> is a web-based utility designed to parse public multimedia URLs, locate the underlying video stream files on a Content Delivery Network (CDN), and allow users to save a local copy directly to their device. Rather than requiring users to install third-party executable software or browser extensions that might compromise digital security, web-based downloaders operate entirely through your browser.
            </p>
            <p className="mb-4">
              Modern digital media is frequently served using dynamic web technologies such as HTML5 video players, JavaScript application bundles, and adaptive streaming manifests. When you view a video on a social feed, the platform does not provide an obvious "Save As" button. ModraDown bridges this gap by reading the publicly available metadata of the provided URL and presenting clean, downloadable progressive MP4 video files and MP3 audio streams.
            </p>
            <p>
              Web downloaders serve legitimate functions for content creators seeking backups of their own media, students archiving educational lectures for offline study, journalists recording public statements, and travelers preparing entertainment for flights with limited internet connectivity.
            </p>
          </section>

          {/* SECTION 2: HOW MODRADOWN WORKS */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              2. How ModraDown Works: Architecture & Extraction Protocol
            </h2>
            <p className="mb-4">
              ModraDown operates on an ethical, zero-storage processing architecture. Unlike file-sharing repositories or cloud lockers that duplicate and host media files, our utility acts strictly as an analytical gateway between your web browser and the platform's public CDN:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <span className="text-xs font-black text-brand-primary uppercase tracking-wider block mb-1">Step 1</span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">URL Resolution</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You submit a public video URL. ModraDown validates the domain, confirms protocol compliance, and requests the public manifest file.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <span className="text-xs font-black text-brand-primary uppercase tracking-wider block mb-1">Step 2</span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Stream Parsing</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Our system inspects available progressive video streams, matching video and audio tracks to extract the highest available fidelity.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <span className="text-xs font-black text-brand-primary uppercase tracking-wider block mb-1">Step 3</span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Direct Local Save</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your device receives the progressive stream directly from the source CDN. The file is saved directly into your device storage.
                </p>
              </div>
            </div>
            <p>
              Because the media transfer flows directly into your browser, ModraDown never caches, archives, or logs the content of your downloads on our servers.
            </p>
          </section>

          {/* SECTION 3: SUPPORTED FORMATS */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              3. Supported Video & Audio Formats
            </h2>
            <p className="mb-4">
              To guarantee that your downloaded media plays smoothly across all operating systems without requiring third-party video players, ModraDown prioritizes universally compatible container formats:
            </p>
            <div className="space-y-4 my-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-brand-primary" /> MP4 (MPEG-4 Part 14) – Universal Video Standard
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Encoded using standard H.264 (AVC) video compression and AAC audio. Plays natively on 100% of modern devices including Windows, macOS, Android, iOS, smart TVs, and video editing suites (Premiere Pro, DaVinci Resolve, Final Cut Pro).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-500" /> MP3 (MPEG-1 Audio Layer III) – Universal Audio Standard
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ideal for isolating speech, podcasts, interviews, and music from video streams. Provides universal compatibility across audio players, car stereos, and portable devices while reducing file size by up to 90%.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: VIDEO QUALITY EXPLAINED */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              4. Video Quality Explained: Resolutions, Bitrates & Pixels
            </h2>
            <p className="mb-4">
              When downloading a video, selecting the correct resolution allows you to strike the optimal balance between visual sharpness and device storage consumption:
            </p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white uppercase font-bold">
                  <tr>
                    <th className="p-3">Resolution</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Pixel Count</th>
                    <th className="p-3">Best Recommended Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  <tr>
                    <td className="p-3 font-bold text-brand-primary">1080p (Full HD)</td>
                    <td className="p-3">1920 × 1080</td>
                    <td className="p-3">~2.07 Megapixels</td>
                    <td className="p-3">Desktop monitors, laptops, presentations, and master archives.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-blue-500">720p (HD)</td>
                    <td className="p-3">1280 × 720</td>
                    <td className="p-3">~0.92 Megapixels</td>
                    <td className="p-3">Mobile phones, tablets, conserving bandwidth and cellular data.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-600 dark:text-gray-400">480p (SD)</td>
                    <td className="p-3">854 × 480</td>
                    <td className="p-3">~0.41 Megapixels</td>
                    <td className="p-3">Compact storage devices and low-speed internet connections.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Note: A video downloader cannot artificially upscale a video beyond the original resolution uploaded by the creator. If a source video was recorded in 720p, extracting in 1080p will not increase visual detail.
            </p>
          </section>

          {/* SECTION 5: MP4 VS MP3 */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              5. MP4 vs. MP3: When to Choose Video vs. Audio Extraction
            </h2>
            <p className="mb-4">
              Understanding the functional trade-offs between video and audio extraction helps you manage device storage effectively:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
              <li>
                <strong>Choose MP4 Video:</strong> When visual context is essential—such as software coding tutorials, cooking demonstrations, scientific diagrams, sports mechanics, and creative video editing.
              </li>
              <li>
                <strong>Choose MP3 Audio:</strong> When you only require speech or sound—such as panel interviews, lecture audio, podcast discussions, and language practice. MP3 files use roughly 1 MB per minute of playback, allowing you to store hundreds of hours on a smartphone.
              </li>
            </ul>
          </section>

          {/* SECTION 6: RESPONSIBLE DOWNLOADING & COPYRIGHT */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400 mb-3 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> 6. How to Download Videos Responsibly & Copyright Guidelines
            </h2>
            <p className="text-sm mb-3">
              ModraDown strongly advocates for the ethical and lawful use of web media extraction tools. Digital videos, musical compositions, and creative recordings are protected under international copyright treaties (including the Berne Convention and DMCA).
            </p>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Lawful & Permissible Use Cases:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Personal Archiving:</strong> Backing up your own published videos and creator portfolio content.</li>
              <li><strong>Explicit Permission:</strong> Downloading videos where the copyright owner has granted you clear authorization or licensing.</li>
              <li><strong>Creative Commons & Public Domain:</strong> Content explicitly released under open licenses (such as CC-BY) or government public domain archives.</li>
              <li><strong>Fair Use Evaluation:</strong> Short excerpt clips utilized for bona fide educational critique, news commentary, scholarship, or parody under applicable statutory fair use doctrines.</li>
            </ul>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
              We strictly forbid the use of ModraDown to bypass digital rights management (DRM), access paywalled commercial media, or download content without necessary authorization. Users are solely responsible for verifying the legal status of media in their jurisdiction.
            </p>
          </section>

          {/* SECTION 7: SAFE VIDEO DOWNLOADING PRACTICES */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              7. Safe Video Downloading Practices
            </h2>
            <p className="mb-4">
              Protecting your device security while browsing media tools is critical. Follow these essential safety standards:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Verify File Extensions</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Safe media downloads will always end with <code>.mp4</code>, <code>.mp3</code>, or <code>.webm</code>. Never open downloaded files ending in <code>.exe</code>, <code>.bat</code>, or <code>.apk</code>.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Avoid Rogue Extensions</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Legitimate web tools do not require you to install third-party browser extensions that track your web activity or hijack search results.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Check HTTPS Security</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Always ensure the website uses active SSL/TLS encryption (https://) to prevent data interception during transmission.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Zero Forced Popups</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ModraDown never redirects your browser to unverified third-party popups or deceptive system alerts.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 8: MOBILE DOWNLOADING GUIDE */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              8. Mobile Downloading Guide: Android & iPhone
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-500" /> Android Devices (Chrome, Firefox, Samsung)
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <li>Copy the public video link from your social media app.</li>
                  <li>Open <strong>Google Chrome</strong> and visit <code>videodownloder.online</code>.</li>
                  <li>Paste the link into the downloader and tap <strong>Download</strong>.</li>
                  <li>Choose your preferred resolution (e.g. 1080p).</li>
                  <li>The file will download to your Android <strong>Files / Downloads</strong> folder and show in your Gallery automatically.</li>
                </ol>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-500" /> Apple iPhone & iPad (Safari iOS 16+)
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <li>Copy the public video link.</li>
                  <li>Open <strong>Safari</strong> and visit <code>videodownloder.online</code>.</li>
                  <li>Paste the link and tap <strong>Download</strong>.</li>
                  <li>When prompted <em>"Do you want to download?"</em>, tap <strong>Download</strong>.</li>
                  <li>Open your <strong>Files app &rarr; Downloads</strong>, tap <strong>Share &rarr; Save Video</strong> to add it to your Photos camera roll.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* SECTION 9: DESKTOP DOWNLOADING GUIDE */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              9. Desktop Downloading Guide: Windows, Mac & Linux
            </h2>
            <p className="mb-4">
              On desktop computers, downloading is instantaneous and requires zero installed software:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <strong>Windows 10 / 11:</strong> Open Microsoft Edge or Google Chrome, paste your public link into ModraDown, and click Download. Files land in your user <code>Downloads</code> folder (press <code>Ctrl + J</code> to view active downloads).
              </li>
              <li>
                <strong>macOS (Apple Silicon & Intel):</strong> Open Safari or Chrome, process the URL, and your video downloads directly to your Mac Downloads stack for playback in QuickTime Player or editing in Final Cut Pro.
              </li>
              <li>
                <strong>Linux:</strong> Works out-of-the-box in Firefox and Chromium distributions, downloading standard progressive MP4 files compatible with VLC and MPV.
              </li>
            </ul>
          </section>

          {/* SECTION 10: TROUBLESHOOTING & QUALITY VARIATIONS */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              10. Troubleshooting Common Download Issues
            </h2>
            <div className="space-y-3 my-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Why did my download fail?</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  The most common cause is a private account link. Downloader tools can only access content that is publicly visible without login credentials. Ensure the account is public and the video is not a disappearing temporary story.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Why is 1080p or 4K unavailable for a specific link?</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Platforms encode videos based on the creator's original upload file. If a video was recorded and uploaded at 720p, higher resolutions do not exist on the platform's CDN. Additionally, some platforms separate high-resolution video streams from audio tracks using adaptive DASH protocols.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Why does the video play in my browser instead of downloading?</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Some browser configurations default to playing MP4 streams directly. In that scenario, right-click the video player and choose <em>"Save Video As..."</em> to save the file to your disk.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 11: PRIVACY & SECURITY EXPLANATION */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              11. Privacy & Security: Our Commitment
            </h2>
            <p className="mb-4">
              At ModraDown, user privacy is an architectural priority, not an afterthought:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><strong>Zero User Accounts:</strong> We do not require usernames, passwords, or email addresses to use our service.</li>
              <li><strong>Zero Download Logs:</strong> We do not associate URLs submitted with individual user profiles or commercial marketing profiles.</li>
              <li><strong>No Server File Caching:</strong> All media downloads flow directly from the public CDN endpoints to your device.</li>
              <li><strong>Encrypted Transport:</strong> All transactions are conducted over secure TLS/HTTPS encryption channels.</li>
            </ul>
          </section>

          {/* SECTION 12: HOMEPAGE FAQ */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              12. Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {homeFaqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>{faq.name}</span>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </article>
      </section>
    </div>
  );
}

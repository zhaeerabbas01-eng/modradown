import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Zap, ShieldCheck, CheckCircle2, 
  Facebook, Twitter, Instagram, Youtube, Linkedin, Play, ArrowRight, Loader2, Video, Image
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import ResultCard from "../components/ResultCard";

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

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans pb-16">
      <SEO 
        title="ModraDown - Professional Social Media Downloader Platform"
        description="Download videos from YouTube, TikTok, Facebook, Instagram, Twitter, and more in High Quality. Simple, fast, and completely free."
        canonicalUrl="https://modradown.com/"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 lg:pt-16 w-full flex flex-col items-center">
        
        {/* Banner Ad Area */}
        <div className="mb-12 text-center flex justify-center">
          <AdPlacement type="horizontal" title="Premium Sponsor" />
        </div>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
          {/* Left Column */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-6 text-brand-primary">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">All-in-One Video Downloader</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black text-gray-900 dark:text-gray-100 leading-[1.1] mb-6 tracking-tight">
              Download Videos <br/>
              From <span className="text-brand-primary">Any Platform</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-xl font-medium mx-auto lg:mx-0">
              Fast, free, and secure video downloader. Download videos, reels, shorts and more from all popular platforms in high quality.
            </p>

            {/* Input Form */}
            <form onSubmit={handleDownload} className="relative flex items-center bg-white dark:bg-[#0a0f25] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-white/10 p-2 max-w-xl mx-auto lg:mx-0 mb-4">
              <input 
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your video link here..."
                className="flex-1 bg-transparent border-none outline-none pl-4 pr-4 py-3 md:py-4 text-base md:text-lg text-gray-700 dark:text-gray-300 placeholder:text-gray-400 font-medium"
              />
              <button 
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-4 rounded-xl flex items-center space-x-2 transition-all disabled:opacity-70 shrink-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                <span className="hidden md:inline">Download</span>
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mb-8 font-medium">
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

          {/* Right Column - Decorative Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative hidden md:block">
            <div className="bg-white dark:bg-[#0a0f25] rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-100 dark:border-white/5 aspect-square relative overflow-hidden flex items-center justify-center">
              
              {/* Concentric Circles */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-gray-100 dark:border-white/5 border-dashed" />
              <div className="absolute w-[55%] h-[55%] rounded-full border border-gray-100 dark:border-white/5" />
              <div className="absolute w-[25%] h-[25%] rounded-full border border-gray-100 dark:border-white/5" />
              
              {/* Central Logo */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6650FF] to-[#8C7AFF] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-brand-primary/40 z-10">
                M
              </div>

              {/* Floating Orbit Icons */}
              <div className="absolute top-[20%] left-[25%] w-12 h-12 bg-white dark:bg-[#121833] rounded-full shadow-lg flex items-center justify-center text-pink-500 border border-gray-100 dark:border-white/10 z-10"><Instagram className="w-6 h-6"/></div>
              <div className="absolute top-[18%] right-[28%] w-12 h-12 bg-black dark:bg-[#121833] rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Twitter className="w-5 h-5"/></div>
              <div className="absolute bottom-[28%] left-[18%] w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Youtube className="w-7 h-7"/></div>
              <div className="absolute bottom-[22%] right-[32%] w-12 h-12 bg-[#00adef] rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Play className="w-6 h-6"/></div>
              <div className="absolute right-[12%] top-[48%] w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white border border-gray-100 dark:border-white/10 z-10"><Facebook className="w-6 h-6"/></div>
              <div className="absolute left-[35%] bottom-[15%] w-10 h-10 bg-black dark:bg-white rounded-full shadow-lg flex items-center justify-center text-white dark:text-black border border-gray-100 dark:border-white/10 z-10"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.31-1.9 1.53-4.44 2.12-6.84 1.83-2.67-.32-5.11-1.93-6.42-4.24-1.29-2.28-1.55-5.06-.72-7.53.84-2.52 2.82-4.52 5.3-5.32 1.48-.47 3.09-.55 4.61-.26v4.06c-.84-.13-1.72-.08-2.51.27-1.15.51-2 1.58-2.3 2.83-.34 1.45.06 3.03 1.13 4.02 1.05.97 2.65 1.25 4.01.76 1.14-.42 1.95-1.46 2.15-2.67.14-.85.1-1.73.1-2.6V.02z"/></svg></div>
              
              {/* Stats Card Floating */}
              <div className="absolute bottom-8 left-8 bg-white dark:bg-[#121833] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/5 flex items-center space-x-4 z-20">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">10x Faster Downloads</h4>
                  <p className="text-xs text-gray-500 font-medium">Experience ultra-fast video downloads</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Result Area */}
        {error && (
          <div className="max-w-xl mt-8 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3 text-left">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && <ResultCard result={result} />}

      </div>

      {/* Popular Downloaders Grid Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
            Or Select a <span className="text-brand-primary">Specific Platform</span>
          </h2>
          <p className="text-gray-500 mt-3 font-medium">Access dedicated downloaders for specialized features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map(p => (
            <Link to={`/downloader/${p.id}`} key={p.id} className="bg-white dark:bg-[#0a0f25] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.bg} ${p.color}`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {p.name}<br/>Downloader
                </h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium flex-1">
                {p.desc}
              </p>
              <div className="bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold px-6 py-3 rounded-xl w-fit flex items-center space-x-2 transition-all shadow-md shadow-brand-primary/20">
                <span>Download</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* User Guides Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
            Detailed User Guides for <span className="text-brand-primary">Supported Apps</span>
          </h2>
          <p className="text-gray-500 mt-3 font-medium">Here are the quick steps to download media from top supported networks, seamlessly via our platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guide 1 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                <Instagram className="w-5 h-5"/>
              </div>
              <h3 className="text-lg font-bold">Instagram Downloader Guide</h3>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> Instagram app mein Reel ya video par 'Share' icon tap karke 'Copy Link' karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> Yahan ModraDown input bar mein link paste karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Select Quality:</span> Process hone ke baad HD ya Standard quality select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Download:</span> Download button par click karte hi video aapke device mein save.</p>
              </li>
            </ul>
          </div>
          
          {/* Guide 2 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 text-black dark:text-white rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5"/>
              </div>
              <h3 className="text-lg font-bold">TikTok Downloader Guide</h3>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> TikTok app mein 'Share' tap karke 'Copy Link' select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> ModraDown input box mein link paste kar den.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">No Watermark:</span> Hamara system aapko 'Without Watermark' ka option dega, use select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Save Video:</span> Download par click karen aur video bina logo/watermark ke save.</p>
              </li>
            </ul>
          </div>

          {/* Guide 3 */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Youtube className="w-5 h-5"/>
              </div>
              <h3 className="text-lg font-bold">YouTube Downloader Guide</h3>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">1.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Copy Link:</span> YouTube app ya web par 'Share' button click karke link copy karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">2.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Paste URL:</span> Yahan ModraDown search bar mein URL paste karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">3.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Resolution:</span> Video resolution chunen ya audio ke liye 'MP3' select karen.</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-brand-primary w-6 shrink-0">4.</span>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">Download:</span> Button tap karen aur final clip aapke device ke folder mein.</p>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">
              Latest <span className="text-brand-primary">Articles & Guides</span>
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Tips and tricks for mastering media content</p>
          </div>
          <Link to="/blog" className="text-brand-primary hover:underline mt-4 md:mt-0 font-bold hidden md:block">View All Guides &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article Cards - Mock Data matching screenshot somewhat */}
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col">
            <div className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-3">Instagram Marketing</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">Cracking the 2024 Instagram Algorithm: A Creator's Guide</h3>
            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">Learn exactly how the new IG algorithm ranks reels and posts, and the 5 specific engagement triggers...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">E</div>
                <span>Elena R.</span>
              </div>
              <span>5 min read</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col">
            <div className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-3">Content Strategy</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">15 Viral TikTok Hooks That Stops Users from Scrolling</h3>
            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">The first 3 seconds are crucial. We analyzed 10,000 viral TikToks and found these exact hook templates...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">M</div>
                <span>Marcus T.</span>
              </div>
              <span>4 min read</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col">
            <div className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-3">YouTube Guides</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">The Ultimate YouTube SEO Masterclass for 2024</h3>
            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">Stop publishing videos into the void. Learn how to optimize titles, tags, and descriptions to rank #1...</p>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">S</div>
                <span>Sarah W.</span>
              </div>
              <span>7 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad placement before FAQ */}
      <div className="container mx-auto px-4 mt-20 mb-10 flex justify-center">
         <div className="flex flex-col items-center">
           <AdPlacement type="in-content" title="Discover More Tools" />
         </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 max-w-4xl mt-16 mb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 mb-3">
          Frequently Asked <span className="text-brand-primary">Questions</span>
        </h2>
        <p className="text-gray-500 mb-12 font-medium">Empowering Modern Video Creators</p>

        <div className="space-y-4 text-left">
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Is this service completely free?</h4>
            <p className="text-gray-500 text-sm font-medium">Yes, ModraDown is completely free to use. There are no hidden fees or subscriptions required.</p>
          </div>
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Are downloaded videos watermarked?</h4>
            <p className="text-gray-500 text-sm font-medium">No, you can download videos completely watermark-free depending on the selected quality and platform.</p>
          </div>
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Can I download audio only?</h4>
            <p className="text-gray-500 text-sm font-medium">Yes, our engine allows you to extract and download high-quality MP3 audio from any supported video.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

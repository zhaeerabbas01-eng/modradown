import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Loader2, Play, CheckCircle2, ShieldCheck, Zap,
  Facebook, Twitter, Instagram, Youtube, Linkedin
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import ResultCard from "../components/ResultCard";
import { fetchWithValidation } from "../utils/api";

export default function PlatformDownloader() {
  const { platformSlug } = useParams<{ platformSlug: string }>();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  
  // Platform configs
  const platforms: Record<string, any> = {
    'youtube-downloader': { name: 'YouTube', icon: Youtube, color: 'bg-red-600', description: 'Download YouTube videos in MP4, MP3.' },
    'instagram-downloader': { name: 'Instagram', icon: Instagram, color: 'bg-pink-600', description: 'Save IG Reels, Photos & Videos.' },
    'tiktok-downloader': { name: 'TikTok', icon: Play, color: 'bg-black', description: 'Download TikTok videos without watermark.' },
    'facebook-video-downloader': { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', description: 'Download FB videos in HD.' },
    'twitter-video-downloader': { name: 'Twitter (X)', icon: Twitter, color: 'bg-black', description: 'Save videos & GIFs from X.' },
    'pinterest-downloader': { name: 'Pinterest', icon: Play, color: 'bg-red-500', description: 'Download Pinterest videos & images.' },
    'reddit-video-downloader': { name: 'Reddit', icon: Play, color: 'bg-orange-500', description: 'Download Reddit videos with audio.' },
    'vimeo-downloader': { name: 'Vimeo', icon: Play, color: 'bg-blue-400', description: 'Download Vimeo videos.' },
    'threads-downloader': { name: 'Threads', icon: Play, color: 'bg-black', description: 'Download Threads videos.' },
    'snapchat-downloader': { name: 'Snapchat', icon: Play, color: 'bg-yellow-400', description: 'Save Snapchat Spotlight.' },
    'linkedin-downloader': { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', description: 'Download LinkedIn videos.' },
    'dailymotion-downloader': { name: 'Dailymotion', icon: Play, color: 'bg-blue-500', description: 'Save Dailymotion videos.' }
  };


  const config = platforms[platformSlug || 'youtube-downloader'] || platforms['youtube-downloader'];
  const Icon = config.icon;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await fetchWithValidation('/api/download', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform: platformSlug }),
      });

      setResult(data);
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title={`${config.name} Video Downloader - Fast & Free | ModraDown`}
        description={`Download ${config.name} videos fast and free. ${config.description}`}
        canonicalUrl={`https://modradown.com/${platformSlug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${config.name} Downloader`,
          "operatingSystem": "Any",
          "applicationCategory": "MultimediaApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <AdPlacement type="horizontal" title="Header Ad" />
        
        {/* Downloader Tool */}
        <div className="bg-white dark:bg-[#0a0f25] rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-white/10 mt-8">
          <div className="text-center mb-8">
             <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg ${config.color}`}>
               <Icon className="w-8 h-8" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold mb-4">{config.name} Downloader</h1>
             <p className="text-gray-500 dark:text-gray-400">{config.description}</p>
          </div>
          
          <form onSubmit={handleDownload} className="relative flex flex-col md:flex-row shadow-inner rounded-2xl bg-gray-50 dark:bg-black/50 p-2 border border-gray-200 dark:border-white/5">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`Paste your ${config.name} link here...`}
              className="w-full bg-transparent text-sm font-medium pl-6 pr-4 py-4 md:py-2 outline-none placeholder:text-gray-400"
            />
            {url && (
              <button 
                type="button" 
                onClick={() => setUrl("")} 
                className="absolute right-[140px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm px-8 rounded-xl flex items-center justify-center space-x-2 transition shrink-0 mt-2 md:mt-0"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /><span>Processing</span></>
              ) : (
                <><Download className="h-4 w-4" /><span>Download</span></>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-8 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span className="flex items-center space-x-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /><span>No Watermark</span></span>
            <span className="flex items-center space-x-1.5"><Zap className="h-4 w-4 text-yellow-500" /><span>Fast Speed</span></span>
            <span className="flex items-center space-x-1.5"><ShieldCheck className="h-4 w-4 text-teal-500" /><span>100% Secure</span></span>
          </div>

          {/* Results Area */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          {result && <ResultCard result={result} />}
        </div>

        
        {/* SEO Article Area */}
        <div className="mt-16 bg-white dark:bg-[#0a0f25] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-white/5 prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">Complete Guide: How to Download Videos from {config.name}</h2>
          
          <h3 className="text-2xl font-semibold mt-8 mb-4">Introduction</h3>
          <p>
            Welcome to the ultimate {config.name} video downloader. In today's fast-paced digital world, saving media for offline viewing, creative inspiration, or archival purposes has become essential. ModraDown's {config.name} downloader provides a seamless, high-speed, and secure way to extract and save your favorite videos, reels, photos, and media directly to your device. Unlike other services, we prioritize quality and user experience, ensuring that every download retains its original high-definition resolution without any watermarks.
          </p>
          <p>
            Whether you are a content creator looking to back up your own media, a researcher compiling digital resources, or simply an enthusiast wanting to save a memorable clip, our tool is engineered to meet your needs. We utilize advanced server-side processing to fetch media files directly from public content delivery networks (CDNs), which guarantees speed and reliability.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Core Features</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>High-Definition Downloads:</strong> Download media in its highest available quality, including 1080p, 4K, and ultra-HD formats where supported by {config.name}.</li>
            <li><strong>No Watermarks:</strong> Our extraction algorithm ensures that downloaded videos are completely free from intrusive watermarks, making them perfect for clean viewing.</li>
            <li><strong>Lightning-Fast Processing:</strong> Built on a globally distributed cloud infrastructure, our downloader processes requests in milliseconds.</li>
            <li><strong>Cross-Device Compatibility:</strong> Whether you are using an iPhone, Android smartphone, iPad, Windows PC, or Mac, our web-based tool works perfectly without requiring any app installations.</li>
            <li><strong>100% Secure & Private:</strong> We do not log your download history, and we do not store the downloaded files on our servers. Your privacy is fully respected.</li>
            <li><strong>No Registration Required:</strong> Start downloading immediately without having to create an account, share personal information, or pay subscription fees.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Supported Formats</h3>
          <p>
            Our {config.name} downloader supports a wide variety of formats to ensure maximum compatibility with your devices and media players:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>MP4 (Video):</strong> The industry standard for high-quality, universally compatible video files.</li>
            <li><strong>MP3 (Audio):</strong> Extract just the audio track from {config.name} videos when you only need the sound.</li>
            <li><strong>JPEG / PNG (Images):</strong> Save high-resolution thumbnails, photos, and cover art.</li>
            <li><strong>WebM:</strong> Optimized format for web viewing, offering great compression without sacrificing quality.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">How to Download (Step-by-Step)</h3>
          <p>Downloading from {config.name} is easier than ever. Just follow these simple steps:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Find the Media:</strong> Open the {config.name} app or website and locate the video or media file you wish to save.</li>
            <li><strong>Copy the Link:</strong> Look for the "Share" button (often represented by an arrow or paper airplane icon). Tap or click it, then select "Copy Link".</li>
            <li><strong>Visit ModraDown:</strong> Open your web browser and navigate to this exact {config.name} downloader page on ModraDown.</li>
            <li><strong>Paste the URL:</strong> Tap on the text input box at the top of this page and paste the copied link.</li>
            <li><strong>Initiate Download:</strong> Click the prominent "Download" button. Our system will analyze the link and extract the available media streams.</li>
            <li><strong>Select Quality:</strong> Once processed, you will see options for different resolutions and formats. Choose your preferred quality.</li>
            <li><strong>Save to Device:</strong> Click the final download button next to your desired format. The file will be saved directly to your device's downloads folder or camera roll.</li>
          </ol>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Advantages of Using ModraDown</h3>
          <p>
            With dozens of tools available online, why choose ModraDown for your {config.name} downloads? The answer lies in our commitment to reliability and user experience. Many competing sites are plagued with intrusive pop-up ads, malware risks, and unreliable servers that fail during peak hours. ModraDown is built by professional engineers using a modern React and Node.js architecture. We prioritize clean UI, rapid loading times, and transparent operations. Our platform is continuously updated to adapt to changes in {config.name}'s platform, ensuring consistent functionality year-round.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Safety & Privacy Information</h3>
          <p>
            Your safety is our top priority. Our service is served over a secure SSL encrypted connection (HTTPS), meaning your connection to our servers is entirely safe from interception. Furthermore, as an online utility, we do not require any permissions to access your device's file system, contacts, or personal data. All processing is done strictly on the server side. 
          </p>
          <p>
            Please note that we act purely as a conduit between your browser and the public content delivery networks. We do not host, cache, or distribute copyrighted materials. We urge all users to respect intellectual property rights and only download content for which they have permission or which falls under fair use guidelines.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
          <div className="space-y-4">
            <div>
              <strong>Is this tool really free?</strong>
              <p className="text-sm mt-1">Yes, our {config.name} downloader is 100% free to use. We support the platform through minimal, non-intrusive advertisements.</p>
            </div>
            <div>
              <strong>Can I download videos on my iPhone?</strong>
              <p className="text-sm mt-1">Absolutely. If you are using iOS 13 or later, you can download files directly via the Safari browser. The files will be saved to your Files app, from where you can export them to your Photos app.</p>
            </div>
            <div>
              <strong>Where are the files saved?</strong>
              <p className="text-sm mt-1">On Windows and Mac, files typically go to your "Downloads" folder. On Android devices, they are saved in the "Downloads" directory or Gallery. On iOS, check the "Files" app.</p>
            </div>
            <div>
              <strong>Is there a limit to how many videos I can download?</strong>
              <p className="text-sm mt-1">No, there are no strict limits. You can download as many videos from {config.name} as you like, whenever you like.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Common Errors & Troubleshooting</h3>
          <p>If you encounter issues, try these troubleshooting steps:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>"Invalid URL" Error:</strong> Ensure you copied the full, direct link to the media post. Private account links cannot be processed.</li>
            <li><strong>Slow Download Speeds:</strong> This may be caused by your local internet connection. Try switching from cellular data to Wi-Fi.</li>
            <li><strong>No Audio:</strong> Sometimes, ultra-high-definition video streams are separated from the audio stream by the platform. Choose a slightly lower resolution (like 1080p) which usually contains the merged audio track.</li>
            <li><strong>Browser Freezing:</strong> Clear your browser cache or try accessing the site in Incognito/Private mode.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Pro Tips</h3>
          <p>
            To get the most out of our {config.name} downloader, bookmark this page (Ctrl+D or Cmd+D) for quick access. If you frequently download media on your mobile device, you can use the "Add to Home Screen" feature in Chrome or Safari to create a convenient app-like icon right on your phone.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h3>
          <p>
            Downloading from {config.name} shouldn't be a hassle. With ModraDown, you have a professional, rapid, and totally free utility at your fingertips. We are dedicated to providing the best downloading experience on the web. Thank you for choosing ModraDown. Happy downloading!
          </p>
        </div>

        {/* Related Downloaders */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6">Other Popular Downloaders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {Object.keys(platforms).slice(0, 8).map(slug => (
               <Link key={slug} to={`/${slug}`} className="bg-white dark:bg-[#0a0f25] p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center hover:border-brand-primary transition group">
                 <span className="text-sm font-semibold group-hover:text-brand-primary">{platforms[slug].name}</span>
               </Link>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}

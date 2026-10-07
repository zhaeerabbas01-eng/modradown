import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  Download, Loader2, Play, CheckCircle2, ShieldCheck, Zap,
  Facebook, Twitter, Instagram, Youtube, Clipboard, AlertCircle,
  FileVideo, Music, HelpCircle, ArrowRight, ExternalLink, Sparkles
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import ResultCard from "../components/ResultCard";
import { PLATFORM_GUIDES, PlatformGuide } from "../data/platformGuides";

export default function PlatformDownloader() {
  const { platformSlug } = useParams<{ platformSlug: string }>();
  const location = useLocation();
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp4" | "mp3">("mp4");
  const [quality, setQuality] = useState<string>("auto");
  const [pasted, setPasted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // Normalize slug to handle both /youtube-downloader, /downloader/youtube-downloader, and aliases
  let rawSlug = platformSlug;
  if (!rawSlug) {
    const segments = location.pathname.split('/').filter(Boolean);
    rawSlug = segments[segments.length - 1] || 'youtube-downloader';
  }
  let cleanSlug = rawSlug.toLowerCase();
  if (cleanSlug === 'facebook-video-downloader') cleanSlug = 'facebook-downloader';
  if (cleanSlug === 'twitter-video-downloader') cleanSlug = 'twitter-downloader';
  if (cleanSlug === 'reddit-video-downloader') cleanSlug = 'reddit-downloader';
  
  const guide: PlatformGuide = PLATFORM_GUIDES[cleanSlug] || PLATFORM_GUIDES['youtube-downloader'];

  const getPlatformIcon = (slug: string) => {
    if (slug.includes('youtube')) return Youtube;
    if (slug.includes('instagram')) return Instagram;
    if (slug.includes('facebook')) return Facebook;
    if (slug.includes('twitter')) return Twitter;
    return Play;
  };

  const Icon = getPlatformIcon(guide.slug);

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
      // Browser permissions denied
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
        body: JSON.stringify({ url: url.trim(), platform: guide.slug, requestedFormat: format, requestedQuality: quality }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to process ${guide.name} link. Ensure the video is public.`);
      }
      setResult(data);
      setTimeout(() => {
        document.getElementById('download-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.message === 'Failed to fetch' 
        ? "Network connection issue. Please check your internet connection." 
        : err.message || `Could not retrieve ${guide.name} media details. Verify the link is publicly accessible.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const platformFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": guide.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://videodownloder.online/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${guide.name} Downloader`,
        "item": `https://videodownloder.online/${guide.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-8 md:py-14 relative overflow-hidden">
      <SEO 
        title={guide.title}
        description={guide.metaDescription}
        canonicalUrl={`https://videodownloder.online/${guide.slug}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": `${guide.name} Video Downloader – ModraDown`,
            "operatingSystem": "All",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          },
          breadcrumbsSchema,
          platformFaqSchema
        ]}
      />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Banner Ad Area */}
        <div className="mb-6 flex justify-center">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        {/* TOOL HERO CARD */}
        <div className="bg-white dark:bg-[#0a0f25] rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200 dark:border-white/10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-4 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated {guide.name} Media Extraction Tool</span>
          </div>

          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg ${guide.brandColor}`}>
            <Icon className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-gray-900 dark:text-white tracking-tight">
            {guide.h1}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8 font-medium">
            {guide.tagline}
          </p>
          
          {/* Form */}
          <form 
            id="media-downloader"
            onSubmit={handleDownload} 
            className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#0a0f25] rounded-2xl p-2.5 shadow-[0_10px_35px_rgba(102,80,255,0.18)] hover:shadow-[0_15px_45px_rgba(102,80,255,0.28)] transition-all duration-300 isolate group gap-2 max-w-2xl mx-auto"
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
                placeholder={`Paste your public ${guide.name} link here...`}
                className="w-full bg-transparent text-sm md:text-base font-medium py-3 outline-none placeholder:text-gray-400 text-gray-800 dark:text-gray-200"
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
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm md:text-base px-7 py-3.5 sm:py-3 rounded-xl flex items-center justify-center space-x-2 transition shrink-0 cursor-pointer shadow-md shadow-brand-primary/25 disabled:opacity-70 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{loading ? "Processing..." : "Download"}</span>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 text-left max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Ensure the account is public and the video is not restricted by login credentials or private permissions.
                </p>
              </div>
            </div>
          )}

          {/* Responsible Use Disclaimer */}
          <div className="mt-5 p-3.5 rounded-xl bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400 text-left max-w-2xl mx-auto flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <p>
              <strong>Responsible Use Notice:</strong> ModraDown processes publicly accessible {guide.name} URLs for legitimate personal, educational, and authorized creator archival use. Users are responsible for having necessary permissions or rights.
            </p>
          </div>

          {/* Result Card */}
          {result && <ResultCard result={result} />}
        </div>

        {/* MID CONTENT AD */}
        <div className="my-10 flex justify-center">
          <AdPlacement type="horizontal" title="In-Content Ad" />
        </div>

        {/* 800–1,200+ WORDS IN-DEPTH UNIQUE PLATFORM GUIDE */}
        <article className="mt-8 bg-white dark:bg-[#0a0f25] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-200 dark:border-white/10 space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          
          {/* ABOUT THIS PLATFORM */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              About Downloading Videos from {guide.name}
            </h2>
            <div className="text-sm sm:text-base leading-relaxed space-y-4">
              <p>{guide.aboutContent}</p>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              How the {guide.name} Downloader Works (Step-by-Step)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.howItWorks.map((hw, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <span className="text-xs font-black text-brand-primary uppercase tracking-wider block mb-1">
                    Step {idx + 1}: {hw.step}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {hw.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SUPPORTED FORMATS & QUALITIES */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Supported Formats & Quality Tiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <FileVideo className="w-4 h-4 text-brand-primary" /> Supported Formats
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {guide.supportedFormats.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">&bull; {f}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Resolution Options
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {guide.supportedQualities.map((q, i) => (
                    <li key={i} className="flex items-center gap-1.5">&bull; {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* LEGITIMATE USE CASES */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Legitimate Use Cases for {guide.name} Media
            </h3>
            <div className="space-y-3">
              {guide.legitimateUseCases.map((uc, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                    {uc.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {uc.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* STRICT COPYRIGHT & PERMISSIONS NOTICE */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Copyright & Legal Permission Policy
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {guide.copyrightNotice}
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
              ModraDown does not host media or bypass DRM restrictions. We urge all users to respect creator ownership and only download content with explicit authorization or valid fair use justification.
            </p>
          </section>

          {/* TROUBLESHOOTING */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Troubleshooting {guide.name} Download Issues
            </h3>
            <div className="space-y-3">
              {guide.troubleshooting.map((tb, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                    {tb.issue}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {tb.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PLATFORM FAQ */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Frequently Asked Questions About {guide.name} Downloads
            </h3>
            <div className="space-y-3">
              {guide.faqs.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>{f.question}</span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* INTERNAL LINKS TO RELEVANT GUIDES */}
          <section className="pt-6 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Related Knowledge & Technical Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.relatedGuides.map((rg, i) => (
                <Link
                  key={i}
                  to={`/blog/${rg.slug}`}
                  className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-brand-primary/10 border border-gray-200 dark:border-white/10 hover:border-brand-primary/30 transition text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between group"
                >
                  <span className="group-hover:text-brand-primary transition">{rg.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* OTHER POPULAR DOWNLOADERS */}
        <div className="mt-14">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white text-center sm:text-left">
            Other Clean Downloader Tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.keys(PLATFORM_GUIDES)
              .filter(slug => slug !== guide.slug)
              .map(slug => (
                <Link
                  key={slug}
                  to={`/${slug}`}
                  className="bg-white dark:bg-[#0a0f25] p-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-center hover:border-brand-primary/50 transition group"
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-primary">
                    {PLATFORM_GUIDES[slug].name} Downloader
                  </span>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

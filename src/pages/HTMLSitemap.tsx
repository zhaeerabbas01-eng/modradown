import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { 
  FileText, Globe, Layers, Download, Sparkles, 
  ShieldCheck, HelpCircle, BookOpen, ExternalLink, ArrowRight 
} from "lucide-react";
import { BLOG_POSTS } from "../data/blogData";

export default function HTMLSitemap() {
  const downloaders = [
    { name: "YouTube Video Downloader", path: "/youtube-downloader", desc: "Download YouTube videos in 1080p MP4 or MP3" },
    { name: "TikTok Video Downloader", path: "/tiktok-downloader", desc: "Save TikTok clips and sounds without watermark" },
    { name: "Instagram Video Downloader", path: "/instagram-downloader", desc: "Extract public Reels, feed clips, and creator videos" },
    { name: "Facebook Video Downloader", path: "/facebook-downloader", desc: "Download public Facebook community and broadcast videos" },
    { name: "Facebook Video Alternative", path: "/facebook-video-downloader", desc: "Alternative progressive MP4 extraction for Facebook" },
    { name: "Twitter (X) Video Downloader", path: "/twitter-downloader", desc: "Download Twitter/X video clips and animated GIFs" },
    { name: "Twitter Video Alternative", path: "/twitter-video-downloader", desc: "Alternative stream resolution for Twitter (X)" },
    { name: "Pinterest Video Downloader", path: "/pinterest-downloader", desc: "Save aesthetic pins, tutorials, and DIY videos" },
    { name: "Reddit Video Downloader", path: "/reddit-downloader", desc: "Download Reddit discussion videos with audio tracks" },
    { name: "Reddit Video Alternative", path: "/reddit-video-downloader", desc: "Direct MP4 downloader for Reddit threads" },
    { name: "Vimeo Video Downloader", path: "/vimeo-downloader", desc: "Extract public portfolio videos and independent films" },
  ];

  const mainPages = [
    { name: "Home - Video Downloader", path: "/", desc: "Universal media extraction tool for all platforms" },
    { name: "AI Creative Tools Suite", path: "/tools", desc: "Hashtag, caption, title, bio, and content generators" },
    { name: "Academy & Blog Articles", path: "/blog", desc: "20+ comprehensive guides on video formats, codecs, and archiving" },
    { name: "Frequently Asked Questions", path: "/faq", desc: "Common questions regarding formats, speed, and safety" },
    { name: "About Us & Leadership", path: "/about", desc: "Our founding mission, leadership, and infrastructure" },
    { name: "Contact Desk & Support", path: "/contact", desc: "Get in touch with our engineering and support team" },
    { name: "Privacy Policy", path: "/privacy", desc: "Zero-storage data privacy and telemetry commitments" },
    { name: "Terms of Service", path: "/terms", desc: "Acceptable use policies and service guidelines" },
    { name: "Disclaimer Notice", path: "/disclaimer", desc: "Third-party platform and copyright disclosures" },
    { name: "DMCA Copyright Notice", path: "/dmca", desc: "Digital Millennium Copyright Act compliance" },
    { name: "Cookie Policy", path: "/cookies", desc: "Details on essential cookies and analytics tags" },
  ];

  const xmlSitemaps = [
    { name: "Sitemap Index (Master)", path: "/sitemap-index.xml", desc: "XML index listing all sub-sitemaps for search engines" },
    { name: "Pages Sitemap", path: "/sitemap-pages.xml", desc: "All core pages, policies, and company information" },
    { name: "Tools Sitemap", path: "/sitemap-tools.xml", desc: "Dedicated platform downloader tool pages" },
    { name: "Articles Sitemap", path: "/sitemap-posts.xml", desc: "Full list of 20+ educational guides and technical articles" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO
        title="HTML Sitemap & Complete Directory | ModraDown"
        description="Comprehensive index and HTML sitemap of all pages, platform downloaders, AI tools, and educational blog guides on ModraDown."
        canonicalUrl="https://videodownloder.online/sitemap"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Site Navigation Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            HTML Sitemap &amp; Resource Directory
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Easily discover every page, platform-specific downloader, creator utility, and educational blog post available on ModraDown.
          </p>
        </div>

        {/* Section 1: Core Pages */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
            <Layers className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Main Pages &amp; Legal Policies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="p-4 rounded-xl bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 hover:border-brand-primary/50 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors flex items-center justify-between">
                    <span>{page.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{page.desc}</p>
                </div>
                <span className="text-[11px] font-mono text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-white/5">{page.path}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Dedicated Platform Downloaders */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
            <Download className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform-Specific Downloaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloaders.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-4 rounded-xl bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 hover:border-brand-secondary/50 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-secondary transition-colors flex items-center justify-between">
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.desc}</p>
                </div>
                <span className="text-[11px] font-mono text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-white/5">{tool.path}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Educational Blog & Academy Articles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Educational Guides &amp; Articles ({BLOG_POSTS.length})
              </h2>
            </div>
            <Link to="/blog" className="text-xs font-bold text-brand-primary hover:underline">
              View All in Academy &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="p-3.5 rounded-xl bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 hover:border-purple-500/50 transition-all shadow-sm hover:shadow-md group flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {post.category} • {post.readTime}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: XML Sitemaps for Search Crawlers */}
        <section className="mb-8 p-6 rounded-2xl bg-gray-100/70 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2.5 mb-4">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">XML Sitemaps for Search Crawlers</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            These XML files are formatted according to the standard sitemaps.org protocol for Googlebot, Bingbot, and other search engine indexers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {xmlSitemaps.map((sitemap) => (
              <a
                key={sitemap.path}
                href={sitemap.path}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition text-xs flex flex-col justify-between"
              >
                <div className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>{sitemap.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-[10px] font-mono text-emerald-500 mt-1">{sitemap.path}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

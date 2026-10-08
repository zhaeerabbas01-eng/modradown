import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, Image as ImageIcon, Search, Code2, 
  ExternalLink, Sparkles, CheckCircle2, ArrowRight, BookOpen, 
  Layers, ShieldCheck, Zap, ChevronRight
} from "lucide-react";

export default function PixelDocSpotlight({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'images' | 'text' | 'seo' | 'devs'>('all');

  const toolCategories = [
    {
      id: 'pdf',
      name: 'PDF Tools',
      icon: FileText,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      items: ['PDF Compressor', 'PDF Merger & Split', 'PDF to Image (JPG/PNG)', 'PDF Watermarking', 'PDF to Word/Text']
    },
    {
      id: 'images',
      name: 'Image Converters',
      icon: ImageIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      items: ['WebP / PNG / JPG Converter', 'Lossless Image Compression', 'Thumbnail Resizer & Crop', 'Background Removal', 'Palette Extractor']
    },
    {
      id: 'text',
      name: 'Text & Content',
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      items: ['Word & Character Counter', 'Case Converter (camel, snake, slug)', 'Text Diff & Comparison', 'Markdown to HTML', 'Clean Slug Maker']
    },
    {
      id: 'seo',
      name: 'SEO Utilities',
      icon: Search,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      items: ['Meta Tag & OpenGraph Builder', 'Robots.txt & Sitemap Validator', 'Keyword Density Analyzer', 'JSON-LD Schema Builder', 'SERP Simulator']
    },
    {
      id: 'devs',
      name: 'Developer Tools',
      icon: Code2,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      items: ['JSON Formatter & Validator', 'Base64 Encoder / Decoder', 'CSS & JS Minifier', 'Regex Live Tester', 'MD5 & SHA Hash Generator']
    }
  ];

  const displayedCategories = activeTab === 'all' 
    ? toolCategories 
    : toolCategories.filter(c => c.id === activeTab);

  if (compact) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary/10 via-purple-500/5 to-pink-500/10 border border-brand-primary/20 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Recommended Tool Suite</span>
            </div>
            <h4 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
              PixelDoc — 100+ Free Online Tools
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              Free web utilities for PDF manipulation, image conversion, text formatting, SEO optimization, and developer workflows.
            </p>
          </div>
          <a
            href="https://pixeldoc.site"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <span>Open PixelDoc</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200/60 dark:border-white/10 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          <span className="text-brand-primary font-bold">Categories:</span>
          <span>PDF Tools</span> • <span>Images</span> • <span>Text</span> • <span>SEO</span> • <span>Devs</span>
          <Link 
            to="/blog/pixeldoc-free-online-tools-pdf-images-text-seo-devs"
            className="ml-auto text-brand-primary hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Read Article</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 p-6 sm:p-8 lg:p-10 shadow-xl my-12">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badges & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-primary/15 to-purple-500/15 text-brand-primary dark:text-purple-300 border border-brand-primary/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partner Ecosystem Spotlight</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              PixelDoc: 100+ Free Online Tools for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PDF, Images, Text, SEO & Devs
              </span>
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Supercharge your daily digital workflow with <strong>PixelDoc (pixeldoc.site)</strong>. Access an all-in-one suite of 100+ fast, browser-based utilities with zero software installation, zero account sign-up, and 100% free unlimited use.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <a
              href="https://pixeldoc.site"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary/90 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-brand-primary/25 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Visit PixelDoc.site</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <Link
              to="/blog/pixeldoc-free-online-tools-pdf-images-text-seo-devs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-bold text-sm transition-all border border-gray-200 dark:border-white/10"
            >
              <BookOpen className="w-4 h-4 text-brand-primary" />
              <span>Read Short Article</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 my-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filter Suite:</span>
          {[
            { id: 'all', label: 'All 100+ Tools' },
            { id: 'pdf', label: 'PDF Suite' },
            { id: 'images', label: 'Image Suite' },
            { id: 'text', label: 'Text Utilities' },
            { id: 'seo', label: 'SEO Audit' },
            { id: 'devs', label: 'Developer Tools' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`p-5 rounded-2xl bg-gray-50/70 dark:bg-[#070b1e]/80 border ${cat.border} hover:border-brand-primary/40 transition-all flex flex-col justify-between group shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">
                      Free Web Tool
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {cat.name}
                  </h3>

                  <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">
                    No Sign-Up Needed
                  </span>
                  <a
                    href="https://pixeldoc.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Use on PixelDoc</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Short Article Highlight Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-gray-50 via-purple-50/50 to-pink-50/30 dark:from-white/5 dark:via-purple-950/20 dark:to-pink-950/20 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Looking for the complete PixelDoc overview & technical tutorial?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Read our in-depth article exploring all 100+ utilities, performance comparisons, and creator tips.
              </p>
            </div>
          </div>
          <Link
            to="/blog/pixeldoc-free-online-tools-pdf-images-text-seo-devs"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-primary hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            <span>Read Short Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

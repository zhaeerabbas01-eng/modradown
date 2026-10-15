import React from "react";
import { ExternalLink, ShieldCheck, Globe, BookOpen, Cpu } from "lucide-react";

export default function OutboundAuthorityLinks() {
  return (
    <section 
      aria-label="Authoritative Technical References & Standards" 
      className="my-8 p-6 rounded-3xl bg-gradient-to-r from-slate-900/5 via-brand-primary/5 to-purple-600/5 dark:from-white/5 dark:via-white/5 dark:to-white/5 border border-gray-200 dark:border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-brand-primary" />
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
          Technical Standards & Fair Use Guidelines
        </h3>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        ModraDown adheres strictly to global web protocols, copyright policies, and search engine publisher quality standards. Review official references from leading web standards bodies and guidelines:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <a 
          href="https://www.w3.org/TR/html52/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary/50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-bold text-gray-900 dark:text-white">W3C HTML5 Standard</span>
              <span className="block text-[10px] text-gray-500">World Wide Web Standards</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
        </a>

        <a 
          href="https://creativecommons.org/licenses/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary/50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-green-500 shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-bold text-gray-900 dark:text-white">Creative Commons</span>
              <span className="block text-[10px] text-gray-500">Fair Use & Licensing</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
        </a>

        <a 
          href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary/50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-bold text-gray-900 dark:text-white">Google Search Guidelines</span>
              <span className="block text-[10px] text-gray-500">Helpful Content System</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
        </a>

        <a 
          href="https://ffmpeg.org/documentation.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary/50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-purple-500 shrink-0" />
            <div className="text-left">
              <span className="block text-xs font-bold text-gray-900 dark:text-white">FFmpeg Media Protocol</span>
              <span className="block text-[10px] text-gray-500">Media Extraction Tech</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
        </a>
      </div>
    </section>
  );
}

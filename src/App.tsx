import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Sparkles, Video, BookOpen, Heart, HelpCircle, Mail, ShieldAlert, ArrowRight, Moon, Sun, ChevronDown, Menu as MenuIcon, X as CloseIcon, User, ShieldCheck, HeartHandshake, Download, Home as HomeIcon, Info, Globe } from "lucide-react";
import Home from "./pages/Home";
import PlatformDownloader from "./pages/PlatformDownloader";
import AITools from "./pages/AITools";
import BlogList from "./pages/BlogList";
import BlogPostDetail from "./pages/BlogPostDetail";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import DMCA from "./pages/DMCA";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import HTMLSitemap from "./pages/HTMLSitemap";
import GeminiWatermarkRemover from "./pages/GeminiWatermarkRemover";
import CookieConsent from "./components/CookieConsent";
import RouteHelmet from "./components/RouteHelmet";
import JsonLdSchema from "./components/JsonLdSchema";
import GlobalSearch from "./components/GlobalSearch";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "./translations";
import { Platform3DLogosSection } from "./components/Platform3DLogos";

function Header({ language, setLanguage }: { language: 'en' | 'es' | 'fr', setLanguage: (lang: 'en' | 'es' | 'fr') => void }) {
  const location = useLocation();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [glowEnabled, setGlowEnabled] = useState(false);
  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (glowEnabled) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#050816';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [glowEnabled]);

  const platformLinks = [
    { name: "Gemini Watermark Remover", slug: "/gemini-watermark-remover", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10 dark:bg-purple-500/20" },
    { name: "YouTube Downloader", slug: "/youtube-downloader", color: "text-red-600", bg: "bg-red-500/10 dark:bg-red-500/20" },
    { name: "TikTok Downloader", slug: "/tiktok-downloader", color: "text-slate-900 dark:text-white", bg: "bg-slate-900/10 dark:bg-white/10" },
    { name: "Instagram Downloader", slug: "/instagram-downloader", color: "text-pink-600", bg: "bg-pink-500/10 dark:bg-pink-500/20" },
    { name: "Facebook Downloader", slug: "/facebook-downloader", color: "text-blue-600", bg: "bg-blue-500/10 dark:bg-blue-500/20" },
    { name: "Twitter (X) Downloader", slug: "/twitter-downloader", color: "text-slate-900 dark:text-white", bg: "bg-slate-900/10 dark:bg-white/10" },
    { name: "Pinterest Downloader", slug: "/pinterest-downloader", color: "text-red-500", bg: "bg-red-500/10 dark:bg-red-500/20" },
    { name: "Reddit Downloader", slug: "/reddit-downloader", color: "text-orange-500", bg: "bg-orange-500/10 dark:bg-orange-500/20" },
    { name: "Vimeo Downloader", slug: "/vimeo-downloader", color: "text-blue-400", bg: "bg-blue-400/10 dark:bg-blue-400/20" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#050816]/95 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-3 md:gap-6">
        
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group relative z-50 py-1">
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-tr from-brand-primary via-purple-600 to-pink-500 p-0.5 shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-[#080d22] rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 transform transition-transform group-hover:scale-110">
                 <defs>
                   <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#6650ff" />
                     <stop offset="100%" stopColor="#d946ef" />
                   </linearGradient>
                 </defs>
                 <path d="M4 21V5l8 6 8-6v16" fill="none" stroke="url(#logo-gradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                Modra<span className="text-brand-primary">Down</span>
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-brand-primary/20 to-pink-500/20 text-brand-primary border border-brand-primary/20 uppercase tracking-widest hidden sm:inline-block">PRO</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 hidden md:block tracking-wider uppercase mt-0.5">HD Media Utility</span>
          </div>
        </Link>

        {/* CENTER NAVIGATION BAR - STREAMLINED & FITTED */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs xl:text-sm font-bold text-slate-600 dark:text-slate-300">
          <Link 
            to="/" 
            className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${path === "/" ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary font-extrabold shadow-sm" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <HomeIcon className="h-4 w-4" />
            <span>{t.home}</span>
          </Link>
          
          {/* DOWNLOADER MEGA DROPDOWN */}
          <div className="relative group py-1.5">
            <button className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-bold ${path.includes("downloader") || path.includes("watermark") ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}>
              <Video className="h-4 w-4 text-purple-500" />
              <span>{t.downloader}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Mega dropdown panel */}
            <div className="absolute top-full left-0 w-80 mt-1 bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl space-y-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-white/10 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Supported Media Tools</span>
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">8 Tools</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {platformLinks.map((p, idx) => (
                  <Link 
                    key={idx} 
                    to={p.slug} 
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary transition-colors group/item"
                  >
                    <span className={`p-1.5 rounded-lg ${p.bg} ${p.color} shrink-0`}>
                      <Video className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate group-hover/item:translate-x-0.5 transition-transform">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link 
            to="/tools" 
            className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${path === "/tools" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>{t.tools}</span>
          </Link>
          
          <Link 
            to="/blog" 
            className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${path.startsWith("/blog") ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary font-extrabold" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{t.articles}</span>
          </Link>
          
          <Link 
            to="/faq" 
            className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${path === "/faq" ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary font-extrabold" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>{t.howToUse}</span>
          </Link>

          {/* MORE DROPDOWN FOR ABOUT & CONTACT */}
          <div className="relative group py-1.5">
            <button className={`px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 cursor-pointer font-bold ${path === "/about" || path === "/contact" ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary" : "hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"}`}>
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full right-0 w-48 mt-1 bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <Link 
                to="/about" 
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary transition-colors"
              >
                <Info className="h-4 w-4 text-brand-primary" />
                <span>{t.aboutUs}</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-purple-500" />
                <span>{t.contact}</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* RIGHT SIDE UTILITIES */}
        <div className="hidden lg:flex items-center space-x-2 shrink-0">
          <GlobalSearch />
          
          <div className="relative flex items-center">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr')} 
              className="h-8 px-2 pr-5 text-[11px] font-extrabold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.1em 1.1em' }}
            >
              <option value="en">🌐 EN</option>
              <option value="es">🌐 ES</option>
              <option value="fr">🌐 FR</option>
            </select>
          </div>

          <button 
            onClick={() => setGlowEnabled(!glowEnabled)}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition cursor-pointer"
            title="Toggle theme"
          >
            {glowEnabled ? (
              <Moon className="h-3.5 w-3.5 text-brand-primary" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            )}
          </button>

          <a
            href="/#media-downloader"
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 hover:brightness-110 text-white shadow-md shadow-brand-primary/25 transition-all cursor-pointer active:scale-95"
          >
            <Download className="h-3.5 w-3.5 animate-bounce" />
            <span>Download</span>
          </a>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center lg:hidden space-x-2 shrink-0">
          <GlobalSearch />
          <button 
            onClick={() => setGlowEnabled(!glowEnabled)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Toggle theme"
          >
            {glowEnabled ? <Moon className="h-4 w-4 text-brand-primary" /> : <Sun className="h-4 w-4 text-amber-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition cursor-pointer"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0f25] overflow-hidden"
          >
            <div className="px-5 py-6 space-y-3 flex flex-col text-sm font-bold">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${path === "/" ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 dark:text-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </div>
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md font-bold">Main</span>
              </Link>

              {/* Supported Downloaders Quick List */}
              <div className="py-2 px-3 rounded-xl bg-gray-50 dark:bg-white/5 space-y-2">
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Supported Downloaders:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {platformLinks.map((p, i) => (
                    <Link
                      key={i}
                      to={p.slug}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-primary flex items-center gap-1.5 py-1"
                    >
                      <span className={`w-2 h-2 rounded-full ${p.color}`} />
                      <span>{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/tools" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${path === "/tools" ? "bg-amber-500/10 text-amber-500" : "text-gray-700 dark:text-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Creative Tools</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-md font-bold">New</span>
              </Link>

              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl ${path.startsWith("/blog") ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 dark:text-gray-200"}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Academy Articles</span>
              </Link>

              <Link 
                to="/faq" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl ${path === "/faq" ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 dark:text-gray-200"}`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>How to Use / FAQ</span>
              </Link>

              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl ${path === "/about" ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 dark:text-gray-200"}`}
              >
                <Info className="w-4 h-4" />
                <span>About Us</span>
              </Link>

              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl ${path === "/contact" ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 dark:text-gray-200"}`}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Ticket</span>
              </Link>

              <a
                href="/#media-downloader"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 text-white font-extrabold text-xs tracking-wider text-center flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>START FREE DOWNLOAD</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#050505] pt-0 pb-16 mt-auto relative z-10 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-primary/10 dark:bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* SCROLLING MARQUEE */}
      <div className="w-full bg-slate-50 border-b border-gray-100 dark:bg-white/5 dark:border-white/5 py-3 mb-16 overflow-hidden relative">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around items-center text-sm font-bold text-gray-400">
            <span className="shrink-0 flex items-center gap-2 text-[#E4405F]">Instagram<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-black dark:text-white">TikTok<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#FF0000]">YouTube<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#1877F2]">Facebook<span className="text-gray-400">Downloader</span></span>
            <Link to="/tools" className="shrink-0 flex items-center gap-2 text-brand-primary hover:opacity-80 transition cursor-pointer">AI Tools<span className="text-gray-400">Suite</span></Link>
            <span className="shrink-0 flex items-center gap-2 text-black dark:text-white">Twitter (X)<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#006add]">DailyMotion<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#1ab7ea]">Vimeo<span className="text-gray-400">Downloader</span></span>
          </div>
          <div className="flex w-1/2 justify-around items-center text-sm font-bold text-gray-400">
            <span className="shrink-0 flex items-center gap-2 text-[#E4405F]">Instagram<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-black dark:text-white">TikTok<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#FF0000]">YouTube<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#1877F2]">Facebook<span className="text-gray-400">Downloader</span></span>
            <Link to="/tools" className="shrink-0 flex items-center gap-2 text-brand-primary hover:opacity-80 transition cursor-pointer">AI Tools<span className="text-gray-400">Suite</span></Link>
            <span className="shrink-0 flex items-center gap-2 text-black dark:text-white">Twitter (X)<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#006add]">DailyMotion<span className="text-gray-400">Downloader</span></span>
            <span className="shrink-0 flex items-center gap-2 text-[#1ab7ea]">Vimeo<span className="text-gray-400">Downloader</span></span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* 3D Original Platform Logos Suite */}
        <Platform3DLogosSection />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16 pt-8 border-t border-gray-100 dark:border-white/10">
          
          <div className="space-y-6 col-span-2 md:col-span-2 pr-4 lg:pr-12">
            <Link to="/" className="flex items-center space-x-3 group relative w-fit">
              <div className="h-10 w-10 relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/20 p-2">
                <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                   <path d="M4 21V5l8 6 8-6v16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">ModraDown</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              The professional suite for digital content creators. Fast, secure, and built for modern digital workflows. Experience the ultimate media extraction tool.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <a href="#" aria-label="Twitter" className="h-10 w-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm tracking-wider font-bold text-gray-900 dark:text-white uppercase">Utilities</h5>
            <ul className="space-y-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Media Downloader</Link></li>
              <li><a href="/#thumbnail-extractor" className="hover:text-brand-primary transition-colors">YouTube Thumbnails</a></li>
              <li><a href="/#metadata-analyst" className="hover:text-brand-primary transition-colors">Metadata Examiner</a></li>
              <li><Link to="/tools" className="hover:text-brand-primary transition-colors">AI Creative Tools</Link></li>
              <li>
                <a 
                  href="https://pixeldoc.site" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-primary transition-colors font-bold text-brand-primary inline-flex items-center gap-1"
                >
                  <span>PixelDoc (100+ Tools)</span>
                  <span className="text-[10px] bg-brand-primary/15 text-brand-primary px-1.5 py-0.5 rounded font-mono uppercase">Free</span>
                </a>
              </li>
              <li><Link to="/blog/pixeldoc-free-online-tools-pdf-images-text-seo-devs" className="hover:text-brand-primary transition-colors">PixelDoc Complete Guide</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm tracking-wider font-bold text-gray-900 dark:text-white uppercase">Downloaders</h5>
            <ul className="space-y-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/youtube-downloader" className="hover:text-brand-primary transition-colors">YouTube Downloader</Link></li>
              <li><Link to="/tiktok-downloader" className="hover:text-brand-primary transition-colors">TikTok Downloader</Link></li>
              <li><Link to="/instagram-downloader" className="hover:text-brand-primary transition-colors">Instagram Downloader</Link></li>
              <li><Link to="/facebook-downloader" className="hover:text-brand-primary transition-colors">Facebook Downloader</Link></li>
              <li><Link to="/twitter-downloader" className="hover:text-brand-primary transition-colors">Twitter (X) Downloader</Link></li>
              <li><Link to="/pinterest-downloader" className="hover:text-brand-primary transition-colors">Pinterest Downloader</Link></li>
              <li><Link to="/reddit-downloader" className="hover:text-brand-primary transition-colors">Reddit Downloader</Link></li>
              <li><Link to="/vimeo-downloader" className="hover:text-brand-primary transition-colors">Vimeo Downloader</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm tracking-wider font-bold text-gray-900 dark:text-white uppercase">Legal</h5>
            <ul className="space-y-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-brand-primary transition-colors">Disclaimer Notice</Link></li>
              <li><Link to="/dmca" className="hover:text-brand-primary transition-colors">DMCA / Copyright</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/sitemap" className="hover:text-brand-primary transition-colors text-brand-primary font-semibold">HTML Sitemap</Link></li>
            </ul>
          </div>

        </div>

        {/* Fine-print copyright and trademark warnings */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-2">
            <p className="font-medium text-gray-900 dark:text-gray-300">&copy; {new Date().getFullYear()} ModraDown. All rights reserved.</p>
            <p className="max-w-3xl text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Legal Disclaimer: ModraDown is an independent service. We do not host any copyrighted files. All media is downloaded directly from public CDNs. We are not affiliated with YouTube, Instagram, Facebook, TikTok, or Meta Inc.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">All Systems Operational</span>
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const page_path = location.pathname + location.search;
      (window as any).gtag('config', 'G-VYFNEJFLT8', {
        page_path,
      });
      (window as any).gtag('config', 'G-Y41WMV0P3N', {
        page_path,
      });
    }
  }, [location]);

  return null;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-primary/30 flex flex-col scroll-smooth text-sm md:text-base">
      <AnalyticsTracker />
      <RouteHelmet />
      <JsonLdSchema />
      <Header language={language} setLanguage={setLanguage} />
      <main id="main-content" className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gemini-watermark-remover" element={<GeminiWatermarkRemover />} />
          <Route path="/gemini-video-image-downloader-without-watermark" element={<GeminiWatermarkRemover />} />
          <Route path="/gemini-downloader" element={<GeminiWatermarkRemover />} />
          <Route path="/downloader/:platformSlug" element={<PlatformDownloader />} />
          <Route path="/youtube-downloader" element={<PlatformDownloader />} />
          <Route path="/tiktok-downloader" element={<PlatformDownloader />} />
          <Route path="/instagram-downloader" element={<PlatformDownloader />} />
          <Route path="/facebook-downloader" element={<PlatformDownloader />} />
          <Route path="/facebook-video-downloader" element={<PlatformDownloader />} />
          <Route path="/twitter-downloader" element={<PlatformDownloader />} />
          <Route path="/twitter-video-downloader" element={<PlatformDownloader />} />
          <Route path="/pinterest-downloader" element={<PlatformDownloader />} />
          <Route path="/reddit-downloader" element={<PlatformDownloader />} />
          <Route path="/reddit-video-downloader" element={<PlatformDownloader />} />
          <Route path="/vimeo-downloader" element={<PlatformDownloader />} />
          <Route path="/tools" element={<AITools />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sitemap" element={<HTMLSitemap />} />
          <Route path="/html-sitemap" element={<HTMLSitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

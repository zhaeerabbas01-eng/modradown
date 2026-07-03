import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Sparkles, Video, BookOpen, Heart, HelpCircle, Mail, ShieldAlert, ArrowRight, Moon, Sun, ChevronDown, Menu as MenuIcon, X as CloseIcon, User, ShieldCheck, HeartHandshake } from "lucide-react";
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
import { motion, AnimatePresence } from "motion/react";
import { translations } from "./translations";

function Header({ language, setLanguage }: { language: 'en' | 'es' | 'fr', setLanguage: (lang: 'en' | 'es' | 'fr') => void }) {
  const location = useLocation();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [glowEnabled, setGlowEnabled] = useState(false); // Default false = light mode
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const t = translations[language];

  useEffect(() => {
    if (glowEnabled) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#050816';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [glowEnabled]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSignInSuccess(true);
      setTimeout(() => {
        setShowSignInModal(false);
        setSignInSuccess(false);
        setEmailInput("");
      }, 1500);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10  bg-white dark:bg-[#0a0f25]/95 dark:bg-[#050816]/95  backdrop-blur-md transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO: M MODRA */}
        
        <Link to="/" className="flex items-center space-x-2 group relative z-50">
          <div className="h-9 w-9">
            <svg viewBox="0 0 24 24" className="w-full h-full">
               <defs>
                 <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#6650ff" />
                   <stop offset="100%" stopColor="#d946ef" />
                 </linearGradient>
               </defs>
               <path d="M4 21V5l8 6 8-6v16" fill="none" stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">
            ModraDown
          </span>
        </Link>

        {/* Navigation Items - PC Responsive to match the image */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-slate-600 dark:text-gray-300">
          <Link 
            to="/" 
            className={`transition-all duration-200 hover:text-gray-900 dark:text-gray-100 flex items-center gap-1.5 ${path === "/" ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            {t.home}
          </Link>
          
          {/* Downloader dropdown preview */}
          <div className="relative group hover:py-1">
            <button className="transition-all duration-200 hover:text-gray-900 dark:text-gray-100 flex items-center gap-1 hover:text-brand-primary cursor-pointer font-sans font-bold  text-xs">
              {t.downloader} <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-2xl space-y-2.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-300 z-50">
              <div className="text-[9px]  tracking-widest text-gray-500 dark:text-gray-400 font-black mb-1 border-b border-gray-200 dark:border-white/10 pb-1">Supported Apps</div>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ Facebook</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ Instagram</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ YouTube</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ TikTok</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ Reddit</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ Vimeo</a>
              <a href="/#media-downloader" className="block text-[10px] text-gray-600 dark:text-gray-300 hover:text-brand-primary  font-bold tracking-wider transition">★ DailyMotion</a>
            </div>
          </div>

          <Link 
            to="/tools" 
            className={`flex items-center gap-1 transition-all duration-200 hover:text-gray-900 dark:text-gray-100 ${path === "/tools" ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-accent animate-pulse" />
            {t.tools}
          </Link>
          
          <Link 
            to="/blog" 
            className={`transition-all duration-200 hover:text-gray-900 dark:text-gray-100 ${path.startsWith("/blog") ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            {t.articles}
          </Link>
          
          <Link 
            to="/faq" 
            className={`transition-all duration-200 hover:text-gray-900 dark:text-gray-100 ${path === "/faq" ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            {t.howToUse}
          </Link>
          
          <Link 
            to="/about" 
            className={`transition-all duration-200 hover:text-gray-900 dark:text-gray-100 ${path === "/about" ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            {t.aboutUs}
          </Link>
          
          <Link 
            to="/contact" 
            className={`transition-all duration-200 hover:text-gray-900 dark:text-gray-100 ${path === "/contact" ? "text-brand-primary font-extrabold border-b-2 border-brand-primary pb-1" : "pb-1"}`}
          >
            {t.contact}
          </Link>
        </nav>

        {/* Right side Actions matching screenshot */}
        <div className="hidden lg:flex items-center space-x-4">
          <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr')} className="bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-1 text-xs text-gray-700 dark:text-gray-300">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
          <button 
            onClick={() => setGlowEnabled(!glowEnabled)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 transition cursor-pointer"
          >
            {glowEnabled ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setShowSignInModal(true)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white transition duration-300 text-sm font-semibold rounded-lg px-6 py-2.5"
          >
            {t.signIn}
          </button>
        </div>

        {/* MOBILE MENU TRIGGER BUTTON */}
        <div className="flex items-center lg:hidden space-x-3">
          <button 
            onClick={() => setGlowEnabled(!glowEnabled)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
          >
            <Moon className={`h-4 w-4 ${glowEnabled ? "text-brand-primary" : ""}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-white/10 transition"
          >
            {mobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE SIDEBAR DRAWER - Smooth Animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0f25] overflow-hidden"
          >
            <div className="px-6 py-8 space-y-5 flex flex-col text-sm font-semibold tracking-wide  font-sans">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 ${path === "/" ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`}
              >
                <span>Home / Downloader</span>
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md font-sans font-bold">Downloader</span>
              </Link>
              <Link 
                to="/tools" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 ${path === "/tools" ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`}
              >
                <span>AI Creative Tools</span>
                <Sparkles className="h-3.5 w-3.5 text-brand-accent animate-spin" />
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-gray-200 dark:border-white/10 ${path.startsWith("/blog") ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`}
              >
                Academy Articles
              </Link>
              <Link 
                to="/faq" 
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-gray-200 dark:border-white/10 ${path === "/faq" ? "text-brand-primary font-bold" : "text-gray-600 dark:text-gray-300"}`}
              >
                How to Use / FAQ
              </Link>
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-gray-200 dark:border-white/10 ${path === "/about" ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-gray-200 dark:border-white/10 ${path === "/contact" ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`}
              >
                Contact Ticket
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSignInModal(true);
                }}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-gray-900 dark:text-gray-100 font-extrabold text-xs tracking-wider text-center"
              >
                SIGN IN TO DASHBOARD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGN IN DESK MODAL DIALOG */}
      <AnimatePresence>
        {showSignInModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full relative overflow-hidden"
            >
              {/* Glow effects */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl" />

              <button 
                onClick={() => setShowSignInModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-gray-900 dark:text-gray-100 font-black mx-auto shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
                    <path d="M4 20V8l8 5 8-5v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Welcome to ModraDown</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Maximize your media downloads up to 10x faster!</p>
              </div>

              {signInSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-brand-accent/25 flex items-center justify-center text-brand-accent mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100  text-xs tracking-widest font-sans">Access Authorized</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Connecting you to premium downlink processors...</p>
                </div>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans  font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Your Email Address</label>
                    <input 
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. download@modrahub.com"
                      className="w-full bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-gray-100 outline-none focus:border-brand-primary placeholder:text-neutral-600 transition"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-600 dark:text-gray-300">
                    <HeartHandshake className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                    <span>Free account - No credit card required.</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-gray-900 dark:text-gray-100 font-extrabold text-xs py-3 rounded-xl hover:brightness-110 active:scale-[0.98] font-medium transition"
                  >
                    Get instant free access
                  </button>
                </form>
              )}
            </motion.div>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
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
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm tracking-wider font-bold text-gray-900 dark:text-white uppercase">Supported</h5>
            <ul className="space-y-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Facebook Downloader</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Instagram Downloader</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">YouTube Downloader</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">TikTok Downloader</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Vimeo Downloader</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">DailyMotion</Link></li>
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

export default function App() {
  const [language, setLanguage] = useState('en');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-primary/30 flex flex-col scroll-smooth text-sm md:text-base">
      <Header language={language} setLanguage={setLanguage} />
      <div className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/downloader/:platformSlug" element={<PlatformDownloader />} />
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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

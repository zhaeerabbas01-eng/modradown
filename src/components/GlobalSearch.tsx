import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, X, ArrowRight, Video, Sparkles, BookOpen, 
  HelpCircle, Command, CornerDownLeft, FileText, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOG_POSTS } from "../data/blogData";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'downloader' | 'tool' | 'article' | 'page';
  url: string;
  keywords: string[];
  iconBg?: string;
  badge?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Downloaders
  {
    id: "yt-downloader",
    title: "YouTube Video & MP3 Downloader",
    description: "Download progressive 1080p Full HD MP4 videos and high-bitrate MP3 audio from public YouTube links.",
    category: "downloader",
    url: "/youtube-downloader",
    keywords: ["youtube", "yt", "shorts", "1080p", "hd", "mp4", "mp3", "google", "video", "youtube mp3", "youtube converter"],
    iconBg: "bg-red-500",
    badge: "1080p HD & MP3"
  },
  {
    id: "tt-downloader",
    title: "TikTok Video Downloader (No Watermark)",
    description: "Extract clean, watermark-free vertical MP4 clips and original sound audio from public TikTok URLs.",
    category: "downloader",
    url: "/tiktok-downloader",
    keywords: ["tiktok", "tt", "no watermark", "reels", "viral", "mp4", "sound", "mp3", "tok", "tik tok"],
    iconBg: "bg-black dark:bg-slate-800",
    badge: "No Watermark"
  },
  {
    id: "ig-downloader",
    title: "Instagram Reels & Video Downloader",
    description: "Save Instagram Reels, posts, stories, IGTV and photo carousels in high definition MP4 format.",
    category: "downloader",
    url: "/instagram-downloader",
    keywords: ["instagram", "ig", "insta", "reels", "story", "stories", "post", "carousel", "photo", "gram"],
    iconBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
    badge: "Reels & Stories"
  },
  {
    id: "fb-downloader",
    title: "Facebook Video Downloader",
    description: "Download public Facebook videos, watch clips, and FB Reels in SD and HD resolutions.",
    category: "downloader",
    url: "/facebook-downloader",
    keywords: ["facebook", "fb", "watch", "video", "fb reel", "public video", "fb video"],
    iconBg: "bg-blue-600",
    badge: "HD Videos"
  },
  {
    id: "tw-downloader",
    title: "Twitter / X Video Downloader",
    description: "Save videos, GIFs, and media clips embedded in Twitter (X) tweets directly to your device.",
    category: "downloader",
    url: "/twitter-downloader",
    keywords: ["twitter", "x", "tweet", "video", "gif", "media", "x.com", "twitter video"],
    iconBg: "bg-slate-900 dark:bg-slate-700",
    badge: "MP4 & GIFs"
  },
  {
    id: "pin-downloader",
    title: "Pinterest Video & Photo Downloader",
    description: "Download high-resolution Pinterest pins, Idea Pins, animated GIFs, and photo carousels.",
    category: "downloader",
    url: "/pinterest-downloader",
    keywords: ["pinterest", "pin", "idea pin", "image", "video", "gif", "pins"],
    iconBg: "bg-red-600",
    badge: "Pins & Ideas"
  },
  {
    id: "rd-downloader",
    title: "Reddit Video Downloader",
    description: "Extract Reddit videos with synchronized audio tracks across all subreddits.",
    category: "downloader",
    url: "/reddit-downloader",
    keywords: ["reddit", "r/", "subreddit", "video", "audio", "clip", "v.redd.it"],
    iconBg: "bg-orange-600",
    badge: "With Audio"
  },
  {
    id: "vm-downloader",
    title: "Vimeo Video Downloader",
    description: "Download full HD progressive video streams from Vimeo's public creator network.",
    category: "downloader",
    url: "/vimeo-downloader",
    keywords: ["vimeo", "high quality", "hd", "pro", "video", "vimeo video"],
    iconBg: "bg-sky-500",
    badge: "Full HD"
  },

  // AI Tools
  {
    id: "tool-hashtag",
    title: "AI Hashtag Generator",
    description: "Generate targeted, high-reach hashtags categorized for Instagram, TikTok, and YouTube Shorts.",
    category: "tool",
    url: "/tools?tool=hashtag",
    keywords: ["hashtag", "tags", "instagram tags", "tiktok tags", "viral tags", "reach"],
    badge: "AI Powered"
  },
  {
    id: "tool-yt-meta",
    title: "YouTube Meta & Tag Extractor",
    description: "Extract video tags, keywords, high-res thumbnail URLs, and title structures from any YouTube video.",
    category: "tool",
    url: "/tools?tool=youtube-meta",
    keywords: ["youtube meta", "tags", "thumbnail", "extractor", "keywords", "seo tags"],
    badge: "SEO Tool"
  },
  {
    id: "tool-caption",
    title: "Social Media Caption Generator",
    description: "Author complete, engaging micro-copy with hooks, emoji spacing, and call-to-actions.",
    category: "tool",
    url: "/tools?tool=caption",
    keywords: ["caption", "copy", "post description", "hooks", "writer", "ai caption"],
    badge: "Copywriting"
  },
  {
    id: "tool-script",
    title: "Video Script Writer",
    description: "Draft structural video scripts with timestamped intros, visual cues, and outro CTAs.",
    category: "tool",
    url: "/tools?tool=script",
    keywords: ["script", "video script", "youtube script", "tiktok script", "outline"],
    badge: "Creator Tool"
  },
  {
    id: "tool-bio",
    title: "Social Profile Bio Creator",
    description: "Craft memorable profile bios tailored for Instagram, Twitter/X, TikTok, and LinkedIn.",
    category: "tool",
    url: "/tools?tool=bio",
    keywords: ["bio", "profile bio", "instagram bio", "twitter bio", "creator profile"],
    badge: "Branding"
  },
  {
    id: "tool-audit",
    title: "Content Virality Auditor",
    description: "Analyze hook strength, visual pacing, and structural retention parameters before publishing.",
    category: "tool",
    url: "/tools?tool=audit",
    keywords: ["audit", "virality", "analyze post", "rate video", "pacing"],
    badge: "Analytics"
  },

  // Core Pages & Support
  {
    id: "page-faq",
    title: "How to Use & Troubleshooting FAQ",
    description: "Comprehensive step-by-step instructions, platform compatibility guides, and troubleshooting tips.",
    category: "page",
    url: "/faq",
    keywords: ["faq", "help", "guide", "how to", "troubleshooting", "error", "ios download"],
    badge: "Guide"
  },
  {
    id: "page-about",
    title: "About ModraDown",
    description: "Learn about our web streaming infrastructure, legal compliance standards, and team.",
    category: "page",
    url: "/about",
    keywords: ["about", "about us", "team", "mission", "technology"],
    badge: "Info"
  },
  {
    id: "page-contact",
    title: "Contact Support",
    description: "Reach out to our technical team regarding link parsing, API inquiries, or copyright inquiries.",
    category: "page",
    url: "/contact",
    keywords: ["contact", "support", "email", "report issue", "helpdesk"],
    badge: "Support"
  }
];

// Add blog posts to search index
Object.values(BLOG_POSTS).forEach(post => {
  SEARCH_ITEMS.push({
    id: `blog-${post.slug}`,
    title: post.title,
    description: post.summary,
    category: "article",
    url: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category, "article", "blog", "guide", "tutorial"],
    badge: post.category
  });
});

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on query and category
  const filteredItems = SEARCH_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = item.description.toLowerCase().includes(q);
    const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(q));

    return titleMatch || descMatch || keywordMatch;
  });

  // Handle keyboard navigation inside search list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    setIsOpen(false);
    if (item.url.startsWith("/tools?tool=")) {
      navigate("/tools");
    } else if (item.url.startsWith("/#")) {
      window.location.href = item.url;
    } else {
      navigate(item.url);
    }
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'downloader':
        return <Video className="h-4 w-4 text-brand-primary" />;
      case 'tool':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'article':
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case 'page':
        return <HelpCircle className="h-4 w-4 text-sky-500" />;
    }
  };

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-medium px-3 py-1.5 rounded-full transition-all border border-slate-200 dark:border-white/10 group focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        title="Search platform downloaders & tools (Ctrl+K)"
        aria-label="Search platform downloaders and AI tools"
      >
        <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-primary transition-colors" />
        <span className="hidden sm:inline-block">Search downloaders...</span>
        <span className="inline-block sm:hidden">Search...</span>
        <kbd className="hidden md:flex items-center gap-0.5 text-[10px] bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-xs font-mono">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </button>

      {/* Global Search Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all">
            {/* Backdrop click */}
            <div 
              className="fixed inset-0" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0a0f25] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-10 flex flex-col max-h-[82vh]"
            >
              {/* Search Input Box */}
              <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                <Search className="h-5 w-5 text-brand-primary shrink-0 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleListKeyDown}
                  placeholder="Type to search (e.g., YouTube MP3, TikTok, Instagram, Reels...)"
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base font-medium focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 px-2 py-1 rounded-md transition cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 text-xs overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "All Results" },
                  { id: "downloader", label: "★ Downloaders" },
                  { id: "tool", label: "⚡ AI Tools" },
                  { id: "article", label: "📚 Guides" },
                  { id: "page", label: "ℹ Help" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-brand-primary text-white shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Tags when input is empty */}
              {!query && (
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">Popular:</span>
                  {[
                    "YouTube MP3",
                    "TikTok No Watermark",
                    "Instagram Reels",
                    "Facebook HD",
                    "Twitter MP4",
                    "Pinterest Pin"
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="bg-white dark:bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-white/5">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-semibold text-sm">No downloaders or tools found for "{query}"</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "YouTube", "TikTok", "MP3", or "Hashtags".</p>
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/30"
                            : "hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {/* Icon / Brand Circle */}
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                            item.iconBg || "bg-slate-700"
                          }`}
                        >
                          {getCategoryIcon(item.category)}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">
                              {item.title}
                            </h4>
                            {item.badge && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        {/* Selection Arrow */}
                        <div className="shrink-0 self-center">
                          <ArrowRight
                            className={`h-4 w-4 transition-transform ${
                              isSelected
                                ? "text-brand-primary translate-x-1"
                                : "text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[9px]">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[9px]">↵</kbd> Select
                  </span>
                </div>
                <div>
                  <span className="font-medium text-brand-primary">{filteredItems.length}</span> items found
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

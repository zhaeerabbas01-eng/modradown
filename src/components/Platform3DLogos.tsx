import React from "react";
import { Link } from "react-router-dom";

export interface Platform3DItem {
  id: string;
  name: string;
  link: string;
  gradient: string;
  glowColor: string;
  icon: React.ReactNode;
  tagline: string;
}

export const PLATFORM_3D_DATA: Platform3DItem[] = [
  {
    id: "youtube",
    name: "YouTube",
    link: "/downloader/youtube-downloader",
    gradient: "from-[#FF0000] via-[#E60000] to-[#990000]",
    glowColor: "rgba(255,0,0,0.4)",
    tagline: "4K & 1080p MP4 / MP3",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="yt3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="50%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#990000" />
          </linearGradient>
          <linearGradient id="ytPlay3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>
          <filter id="ytGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>
        {/* Base 3D pill */}
        <rect x="10" y="24" width="80" height="52" rx="18" fill="url(#yt3d)" filter="url(#ytGlow)" />
        {/* Top glossy highlight */}
        <path d="M15 28 C25 25, 75 25, 85 28 C80 34, 20 34, 15 28 Z" fill="#FFFFFF" opacity="0.35" />
        {/* 3D Play Button Triangle */}
        <path d="M42 36 L66 50 L42 64 Z" fill="url(#ytPlay3d)" filter="url(#ytGlow)" />
      </svg>
    )
  },
  {
    id: "instagram",
    name: "Instagram",
    link: "/downloader/instagram-downloader",
    gradient: "from-[#833AB4] via-[#FD1D1D] to-[#FCB045]",
    glowColor: "rgba(253,29,29,0.4)",
    tagline: "Reels, Stories & Audio",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="ig3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#FCB045" />
          </linearGradient>
          <filter id="igGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>
        {/* Base 3D rounded box */}
        <rect x="12" y="12" width="76" height="76" rx="24" fill="url(#ig3d)" filter="url(#igGlow)" />
        {/* Top specular reflection */}
        <path d="M18 16 C35 14, 65 14, 82 16 C75 26, 25 26, 18 16 Z" fill="#FFFFFF" opacity="0.3" />
        {/* Outer Camera Ring */}
        <rect x="28" y="28" width="44" height="44" rx="14" fill="none" stroke="#FFFFFF" strokeWidth="6" filter="url(#igGlow)" />
        {/* Inner Lens */}
        <circle cx="50" cy="50" r="11" fill="none" stroke="#FFFFFF" strokeWidth="6" />
        {/* Flash Dot */}
        <circle cx="63" cy="37" r="3.5" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: "tiktok",
    name: "TikTok",
    link: "/downloader/tiktok-downloader",
    gradient: "from-[#000000] via-[#111111] to-[#00F2FE]",
    glowColor: "rgba(0,242,254,0.35)",
    tagline: "No Watermark HD MP4",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="ttBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#222222" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
        </defs>
        {/* Base 3D Plate */}
        <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#ttBg)" stroke="#333333" strokeWidth="2" />
        {/* Red Offset Layer */}
        <path
          d="M56 22 H64 C64 30, 71 36, 78 37 V45 C73 45, 68 43, 64 40 V61 C64 71, 56 78, 45 78 C34 78, 27 70, 27 60 C27 49, 36 42, 47 43 V52 C42 51, 37 54, 37 60 C37 65, 41 68, 46 68 C52 68, 56 64, 56 58 Z"
          fill="#FE0979"
          opacity="0.9"
          transform="translate(2, 2)"
        />
        {/* Cyan Offset Layer */}
        <path
          d="M56 22 H64 C64 30, 71 36, 78 37 V45 C73 45, 68 43, 64 40 V61 C64 71, 56 78, 45 78 C34 78, 27 70, 27 60 C27 49, 36 42, 47 43 V52 C42 51, 37 54, 37 60 C37 65, 41 68, 46 68 C52 68, 56 64, 56 58 Z"
          fill="#00F2FE"
          opacity="0.9"
          transform="translate(-2, -2)"
        />
        {/* Front Main Note */}
        <path
          d="M56 22 H64 C64 30, 71 36, 78 37 V45 C73 45, 68 43, 64 40 V61 C64 71, 56 78, 45 78 C34 78, 27 70, 27 60 C27 49, 36 42, 47 43 V52 C42 51, 37 54, 37 60 C37 65, 41 68, 46 68 C52 68, 56 64, 56 58 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "facebook",
    name: "Facebook",
    link: "/downloader/facebook-video-downloader",
    gradient: "from-[#1877F2] via-[#166FE5] to-[#0D47A1]",
    glowColor: "rgba(24,119,242,0.4)",
    tagline: "Public & Private Videos",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="fb3d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2B87FF" />
            <stop offset="100%" stopColor="#0D47A1" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#fb3d)" />
        <path d="M18 16 C35 14, 65 14, 82 16 C75 26, 25 26, 18 16 Z" fill="#FFFFFF" opacity="0.3" />
        <path
          d="M62 88 V54 H73 L75 40 H62 V31 C62 27, 64 24, 70 24 H76 V11 C73 10, 68 10, 62 10 C48 10, 39 18, 39 33 V40 H28 V54 H39 V88 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "twitter",
    name: "Twitter (X)",
    link: "/downloader/twitter-video-downloader",
    gradient: "from-[#15202B] via-[#000000] to-[#1DA1F2]",
    glowColor: "rgba(29,161,242,0.35)",
    tagline: "X Media & GIF Downloader",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="x3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#x3d)" stroke="#1DA1F2" strokeWidth="1.5" />
        <path
          d="M28 26 L45 50 L27 74 H33 L48 54 L61 74 H73 L54 48 L71 26 H65 L51 44 L39 26 H28 Z M33 30 H38 L67 70 H62 L33 30 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "pinterest",
    name: "Pinterest",
    link: "/downloader/pinterest-downloader",
    gradient: "from-[#E60023] via-[#BD081C] to-[#7A0010]",
    glowColor: "rgba(230,0,35,0.4)",
    tagline: "Pins & Idea Videos",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="pin3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1F3D" />
            <stop offset="100%" stopColor="#800010" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#pin3d)" />
        <path d="M20 30 C35 20, 65 20, 80 30 C70 40, 30 40, 20 30 Z" fill="#FFFFFF" opacity="0.35" />
        <path
          d="M50 20 C33 20, 22 31, 22 45 C22 56, 29 63, 35 63 C37 63, 38 61, 38 59 C38 57, 37 54, 36 51 C34 46, 38 40, 44 40 C50 40, 54 45, 54 52 C54 61, 48 69, 41 69 C38 69, 36 67, 37 64 L40 50 C41 46, 38 43, 34 43 C29 43, 26 49, 26 56 C26 60, 28 64, 28 64 L23 82 C21 87, 22 89, 22 90 C25 90, 32 80, 34 76 L38 61 C40 63, 44 65, 48 65 C61 65, 70 52, 70 38 C70 27, 60 20, 50 20 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "reddit",
    name: "Reddit",
    link: "/downloader/reddit-video-downloader",
    gradient: "from-[#FF4500] via-[#E03D00] to-[#992200]",
    glowColor: "rgba(255,69,0,0.4)",
    tagline: "Videos with Audio",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="red3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6622" />
            <stop offset="100%" stopColor="#B32400" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#red3d)" />
        {/* Snoo Head */}
        <circle cx="50" cy="54" r="20" fill="#FFFFFF" />
        {/* Ears */}
        <circle cx="28" cy="48" r="6" fill="#FFFFFF" />
        <circle cx="72" cy="48" r="6" fill="#FFFFFF" />
        {/* Eyes */}
        <circle cx="42" cy="52" r="3" fill="#FF4500" />
        <circle cx="58" cy="52" r="3" fill="#FF4500" />
        {/* Smile */}
        <path d="M42 62 Q50 67 58 62" fill="none" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" />
        {/* Antenna */}
        <path d="M50 34 L56 24 L66 26" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="26" r="4" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: "vimeo",
    name: "Vimeo",
    link: "/downloader/vimeo-downloader",
    gradient: "from-[#1AB7EA] via-[#1181A5] to-[#0A4B61]",
    glowColor: "rgba(26,183,234,0.4)",
    tagline: "Full HD & 4K Vimeo",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="vim3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#40CFFF" />
            <stop offset="100%" stopColor="#085B7A" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#vim3d)" />
        <path
          d="M26 38 C28 32, 33 32, 36 36 C39 41, 42 53, 44 58 C47 50, 55 33, 65 33 C72 33, 76 38, 74 46 C71 58, 56 72, 48 72 C41 72, 38 65, 36 57 L31 43 C29 38, 27 38, 26 38 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "threads",
    name: "Threads",
    link: "/downloader/threads-downloader",
    gradient: "from-[#262626] via-[#101010] to-[#000000]",
    glowColor: "rgba(255,255,255,0.25)",
    tagline: "Meta Threads Clips",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <rect x="12" y="12" width="76" height="76" rx="22" fill="#121212" stroke="#333333" strokeWidth="2" />
        <path
          d="M50 26 C36 26, 28 35, 28 49 C28 63, 37 72, 50 72 C60 72, 68 66, 70 57 H61 C59 61, 55 64, 50 64 C42 64, 37 58, 37 49 C37 40, 42 34, 50 34 C57 34, 61 38, 62 45 C60 43, 56 42, 52 42 C44 42, 40 46, 40 52 C40 57, 44 61, 50 61 C56 61, 60 57, 61 52 V50 C61 39, 56 26, 50 26 Z M50 54 C46 54, 45 51, 45 49 C45 46, 48 45, 51 45 C54 45, 56 46, 57 48 C56 52, 53 54, 50 54 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "snapchat",
    name: "Snapchat",
    link: "/downloader/snapchat-downloader",
    gradient: "from-[#FFFC00] via-[#E6E300] to-[#B3B000]",
    glowColor: "rgba(255,252,0,0.4)",
    tagline: "Spotlight & Stories",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <rect x="12" y="12" width="76" height="76" rx="22" fill="#FFFC00" />
        <path
          d="M50 24 C38 24, 32 32, 32 41 C32 44, 33 47, 35 49 C33 50, 30 51, 28 52 C27 53, 27 54, 28 55 C32 56, 36 55, 38 54 C40 58, 44 62, 50 62 C56 62, 60 58, 62 54 C64 55, 68 56, 72 55 C73 54, 73 53, 72 52 C70 51, 67 50, 65 49 C67 47, 68 44, 68 41 C68 32, 62 24, 50 24 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="3"
        />
      </svg>
    )
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    link: "/downloader/linkedin-downloader",
    gradient: "from-[#0A66C2] via-[#004182] to-[#002244]",
    glowColor: "rgba(10,102,194,0.4)",
    tagline: "Professional Video Media",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id="li3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B7FE8" />
            <stop offset="100%" stopColor="#003166" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="22" fill="url(#li3d)" />
        <path d="M18 16 C35 14, 65 14, 82 16 C75 26, 25 26, 18 16 Z" fill="#FFFFFF" opacity="0.3" />
        <path
          d="M28 38 H38 V74 H28 Z M33 24 C29.5 24, 27 26.5, 27 30 C27 33.5, 29.5 36, 33 36 C36.5 36, 39 33.5, 39 30 C39 26.5, 36.5 24, 33 24 Z M45 38 H55 V43 C57 39.5, 61.5 37, 67 37 C77 37, 80 43.5, 80 54 V74 H70 V56 C70 50, 68.5 46, 63.5 46 C58 46, 55 50, 55 56 V74 H45 Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    link: "/downloader/dailymotion-downloader",
    gradient: "from-[#006ADD] via-[#004899] to-[#00234D]",
    glowColor: "rgba(0,106,221,0.4)",
    tagline: "Stream & Clip Converter",
    icon: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
        <rect x="12" y="12" width="76" height="76" rx="22" fill="#006ADD" />
        <path
          d="M62 26 V74 H50 V64 C46 71, 38 75, 28 75 C14 75, 4 64, 4 50 C4 36, 14 25, 28 25 C38 25, 46 29, 50 36 V26 H62 Z M34 37 C25 37, 18 43, 18 50 C18 57, 25 63, 34 63 C43 63, 50 57, 50 50 C50 43, 43 37, 34 37 Z"
          fill="#FFFFFF"
          transform="scale(0.85) translate(8, 8)"
        />
      </svg>
    )
  }
];

export function Platform3DLogosSection() {
  return (
    <div className="w-full my-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-3 text-brand-primary">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider">3D Original Platform Suite</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
          Supported Original <span className="text-brand-primary">Media Downloader Logos</span>
        </h3>
        <p className="text-gray-500 text-sm mt-2 font-medium max-w-2xl mx-auto">
          Direct 1-click video & audio downloader tools for all popular social video platforms.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
        {PLATFORM_3D_DATA.map((platform) => (
          <Link
            to={platform.link}
            key={platform.id}
            className="group relative bg-white dark:bg-[#0d122b] rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Top Gloss Background Accent */}
            <div
              className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-xl opacity-30 group-hover:opacity-80 transition-opacity duration-300"
              style={{ backgroundColor: platform.glowColor }}
            />

            {/* 3D Icon Wrapper with floating effect */}
            <div className="relative mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {platform.icon}
            </div>

            {/* Title */}
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
              {platform.name}
            </h4>

            {/* Tagline */}
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
              {platform.tagline}
            </span>

            {/* Hover arrow indicator */}
            <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all text-xs font-bold text-brand-primary flex items-center space-x-1">
              <span>Open</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

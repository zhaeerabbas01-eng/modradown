import fs from 'fs';
import path from 'path';

export interface RouteSeoInfo {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  schema?: any;
  preRenderBodyHtml?: string;
}

const DOMAIN = 'https://videodownloder.online';

// Comprehensive blog post metadata registry matching src/data/blogData.ts
const BLOG_META_MAP: Record<string, { title: string; summary: string; category: string }> = {
  "how-online-video-downloaders-work": {
    title: "How Online Video Downloaders Work: Architecture, Streams & Protocols",
    summary: "Learn how online video downloaders extract video streams, parse media manifests (HLS, DASH), and serve clean MP4 files directly to browsers.",
    category: "Technical Insights"
  },
  "mp4-vs-mp3-whats-the-difference": {
    title: "MP4 vs MP3: What's the Difference and Which Format Should You Choose?",
    summary: "A breakdown of MP4 container formats vs MP3 audio files, compression ratios, audio bitrates, and device compatibility.",
    category: "Formats & Codecs"
  },
  "how-to-save-videos-for-offline-personal-use": {
    title: "How to Save Videos for Offline Personal Use Legally and Safely",
    summary: "Learn best practices for archiving public social media videos and audio tracks for personal offline reference without copyright infringement.",
    category: "Guides & Best Practices"
  },
  "how-to-download-videos-on-android": {
    title: "How to Download Social Media Videos on Android Smartphones & Tablets",
    summary: "Step-by-step guide to saving MP4 videos and MP3 audio clips on Android devices using Chrome, Firefox, and native download managers.",
    category: "Device Guides"
  },
  "how-to-download-videos-on-iphone": {
    title: "How to Download Videos on iPhone & iPad (iOS 13+ Safari Method)",
    summary: "How to download online videos and reels directly into iOS Safari Files and export them to your Photos app with zero app installs.",
    category: "Device Guides"
  },
  "how-to-download-videos-on-windows": {
    title: "How to Download Online Videos on Windows 10 & Windows 11 PC",
    summary: "Master downloading HD 1080p videos on Windows computers using Microsoft Edge, Google Chrome, and web utilities.",
    category: "Device Guides"
  },
  "how-to-download-videos-on-mac": {
    title: "How to Download Online Videos on macOS (Safari & Chrome Guide)",
    summary: "Complete guide for Mac users to download online videos, convert audio, and save media into Finder and Apple Photos.",
    category: "Device Guides"
  },
  "what-does-1080p-mean": {
    title: "What Does 1080p Resolution Mean? Bitrate, Pixels & Video Quality",
    summary: "Understand 1080p Full HD resolution, 1920x1080 pixel aspect ratios, frame rates (30fps vs 60fps), and streaming bandwidth.",
    category: "Formats & Codecs"
  },
  "720p-vs-1080p-video-quality": {
    title: "720p vs 1080p Video Quality: Differences, File Sizes & Bitrate Comparison",
    summary: "Compare 720p HD and 1080p Full HD video quality to choose the best balance between file size and visual clarity.",
    category: "Formats & Codecs"
  },
  "why-video-download-quality-can-vary": {
    title: "Why Video Download Quality Can Vary: Codecs, Bitrates & Sources Explained",
    summary: "Discover why extracted video downloads differ in quality based on platform source bitrates, adaptive streaming, and compression algorithms.",
    category: "Technical Insights"
  },
  "how-to-choose-the-best-video-format": {
    title: "How to Choose the Best Video Format: MP4, WebM, MOV & AVI Explained",
    summary: "Find the right video format for your needs. Compare MP4, WebM, MOV, and AVI for playback compatibility, compression, and editing.",
    category: "Formats & Codecs"
  },
  "video-compression-explained": {
    title: "Video Compression Explained: Lossy vs Lossless, Codecs & Containers",
    summary: "Demystifying video compression algorithms like H.264, H.265 (HEVC), and AV1. Learn how files shrink without destroying quality.",
    category: "Technical Insights"
  },
  "how-to-reduce-video-file-size": {
    title: "How to Reduce Video File Size Without Losing Quality (5 Free Methods)",
    summary: "Actionable techniques to shrink video file sizes for email attachments, messaging apps, and faster web publishing.",
    category: "Guides & Best Practices"
  },
  "how-to-convert-video-to-mp4": {
    title: "How to Convert Any Video File to MP4 Online Free",
    summary: "Easily convert WebM, MKV, MOV, and AVI video files into universal H.264 MP4 format for playback on any device.",
    category: "Guides & Best Practices"
  },
  "how-to-extract-audio-from-your-own-videos": {
    title: "How to Extract Crisp MP3 Audio from Your Own Video Files",
    summary: "Learn how to convert background audio tracks and speech from video files into lightweight, high-bitrate MP3 files.",
    category: "Guides & Best Practices"
  },
  "safe-online-video-downloading-practices": {
    title: "Safe Online Video Downloading Practices: Avoiding Malware & Scams",
    summary: "Essential safety guidelines for using online media converters securely without downloading executable malware or PUP adware.",
    category: "Guides & Best Practices"
  },
  "copyright-and-video-downloads-explained": {
    title: "Copyright & Video Downloads Explained: Fair Use, Public Domain & Legal Rules",
    summary: "Understand copyright laws, Creative Commons licenses, fair use doctrines, and personal archiving boundaries.",
    category: "Guides & Best Practices"
  },
  "how-to-download-your-own-social-media-videos": {
    title: "How to Download & Archive Your Own Social Media Videos",
    summary: "Protect your digital archive by downloading original backups of your TikToks, Instagram Reels, YouTube Shorts, and Facebook videos.",
    category: "Guides & Best Practices"
  },
  "troubleshooting-failed-video-downloads": {
    title: "Troubleshooting Failed Video Downloads: 5 Common Causes & Solutions",
    summary: "Fix video extraction errors, private link blocks, network timeouts, and ad-blocker interference with these proven solutions.",
    category: "Technical Insights"
  },
  "frequently-asked-video-downloading-questions": {
    title: "Frequently Asked Video Downloading Questions: Definitive ModraDown FAQ",
    summary: "Answers to your most frequent questions about ModraDown: supported resolutions, legal boundaries, safety guarantees, mobile support, and privacy policies.",
    category: "Guides & Best Practices"
  },
  "pixeldoc-free-online-tools-pdf-images-text-seo-devs": {
    title: "PixelDoc: 100+ Free Online Tools for PDF, Images, Text, SEO & Devs",
    summary: "Discover PixelDoc (https://pixeldoc.site), an all-in-one suite of 100+ free online tools for PDF editing, image conversion, text formatting, SEO optimization, and web developer utilities.",
    category: "Guides & Best Practices"
  }
};

export function getRouteSeoInfo(reqPath: string): RouteSeoInfo {
  // Normalize path
  let clean = reqPath.split('?')[0].toLowerCase();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  const fullUrl = `${DOMAIN}${clean === '' ? '/' : clean}`;

  // 1. Homepage
  if (clean === '' || clean === '/') {
    return {
      title: "ModraDown - All-in-One Free Video Downloader",
      description: "A high-performance interactive video downloader. Download HD videos, reels, shorts, and MP3 audio from any URL free with no watermark.",
      canonical: DOMAIN + "/",
      ogType: "website"
    };
  }

  // 2. Dedicated Platform Downloaders
  if (clean === '/youtube-downloader') {
    return {
      title: "YouTube Downloader - Download YouTube Videos & MP3 Free | ModraDown",
      description: "Download YouTube videos in 1080p, 720p Full HD MP4 and convert to 320kbps MP3 audio free with zero watermark on ModraDown.",
      canonical: `${DOMAIN}/youtube-downloader`,
      preRenderBodyHtml: `
        <article class="max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-black mb-4">Free YouTube Video &amp; MP3 Downloader</h1>
          <p class="text-gray-600 mb-6">Extract high-resolution 1080p Full HD MP4 videos and high-bitrate MP3 audio from any public YouTube URL instantly.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-100 rounded-xl">
              <h2 class="font-bold text-lg">1080p Full HD MP4</h2>
              <p class="text-xs">Download pristine high-definition YouTube video streams for offline playback on any PC, Mac, Android, or iPhone.</p>
            </div>
            <div class="p-4 bg-gray-100 rounded-xl">
              <h2 class="font-bold text-lg">High-Quality MP3 Audio</h2>
              <p class="text-xs">Isolate music, podcasts, lectures, and speech directly into standalone MP3 audio files.</p>
            </div>
          </div>
          <p class="text-xs text-gray-500"><a href="/tools" class="underline">Explore AI Creative Tools</a> | <a href="/blog" class="underline">Read Video Guides</a> | <a href="/sitemap" class="underline">HTML Sitemap</a></p>
        </article>
      `
    };
  }

  if (clean === '/tiktok-downloader') {
    return {
      title: "TikTok Downloader - Save TikTok Videos Without Watermark | ModraDown",
      description: "Download TikTok videos without watermark in HD MP4 or extract original MP3 audio clips free and instantly on ModraDown.",
      canonical: `${DOMAIN}/tiktok-downloader`,
      preRenderBodyHtml: `
        <article class="max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-black mb-4">TikTok Downloader Without Watermark</h1>
          <p class="text-gray-600 mb-6">Save clean TikTok videos without logo watermarks or extract sound tracks directly in high-definition MP4 &amp; MP3.</p>
        </article>
      `
    };
  }

  if (clean === '/instagram-downloader') {
    return {
      title: "Instagram Downloader - Save Reels, Feed Videos & Stories | ModraDown",
      description: "Download Instagram Reels, public post videos, and IGTV clips in original HD resolution free with no watermark on ModraDown.",
      canonical: `${DOMAIN}/instagram-downloader`
    };
  }

  if (clean === '/facebook-downloader' || clean === '/facebook-video-downloader') {
    return {
      title: "Facebook Video Downloader - Save FB Public Videos in HD | ModraDown",
      description: "Download public Facebook community videos, reels, and broadcast clips in high resolution MP4 free with no account required.",
      canonical: `${DOMAIN}/facebook-downloader`
    };
  }

  if (clean === '/twitter-downloader' || clean === '/twitter-video-downloader') {
    return {
      title: "Twitter (X) Video Downloader - Save Twitter Videos & GIFs | ModraDown",
      description: "Download Twitter / X video clips, news snippets, and animated GIFs in HD MP4 format free on ModraDown.",
      canonical: `${DOMAIN}/twitter-downloader`
    };
  }

  if (clean === '/pinterest-downloader') {
    return {
      title: "Pinterest Video Downloader - Save Pins & Videos in HD | ModraDown",
      description: "Download Pinterest video pins, DIY tutorials, aesthetic clips, and photos in high resolution MP4 & JPG on ModraDown.",
      canonical: `${DOMAIN}/pinterest-downloader`
    };
  }

  if (clean === '/reddit-downloader' || clean === '/reddit-video-downloader') {
    return {
      title: "Reddit Video Downloader - Save Reddit Clips with Sound | ModraDown",
      description: "Download Reddit videos with clear synchronized audio tracks in HD MP4 format free on ModraDown.",
      canonical: `${DOMAIN}/reddit-downloader`
    };
  }

  if (clean === '/vimeo-downloader') {
    return {
      title: "Vimeo Video Downloader - Download Public Vimeo Clips in HD | ModraDown",
      description: "Download public Vimeo videos and independent film clips in 1080p Full HD MP4 free on ModraDown.",
      canonical: `${DOMAIN}/vimeo-downloader`
    };
  }

  // 3. AI Creative Tools Suite
  if (clean === '/tools') {
    return {
      title: "AI Creative Tools Suite - Hashtags, Titles, Captions & Bios | ModraDown",
      description: "Free online AI hashtag generator, YouTube meta extractor, viral caption generator, video title generator, and social bio optimizer.",
      canonical: `${DOMAIN}/tools`
    };
  }

  // 4. Blog & Academy Index
  if (clean === '/blog') {
    return {
      title: "ModraDown Blog - Video Extraction Guides, Formats & Digital Tips",
      description: "Read expert articles on video codecs, resolution differences (1080p vs 720p), downloading on Android/iOS/Mac/Windows, and digital productivity tools.",
      canonical: `${DOMAIN}/blog`
    };
  }

  // 5. Individual Blog Articles (/blog/:slug)
  if (clean.startsWith('/blog/')) {
    const slug = clean.replace('/blog/', '');
    const meta = BLOG_META_MAP[slug];
    if (meta) {
      return {
        title: `${meta.title} | ModraDown Blog`,
        description: meta.summary,
        canonical: `${DOMAIN}/blog/${slug}`,
        ogType: "article",
        schema: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": meta.title,
          "description": meta.summary,
          "mainEntityOfPage": `${DOMAIN}/blog/${slug}`,
          "author": {
            "@type": "Person",
            "name": "Muhammad Usman Zhaeer"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ModraDown",
            "logo": {
              "@type": "ImageObject",
              "url": `${DOMAIN}/favicon.png`
            }
          },
          "datePublished": "2026-10-07",
          "dateModified": "2026-10-07"
        },
        preRenderBodyHtml: `
          <article class="max-w-4xl mx-auto px-4 py-8">
            <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">${meta.category}</span>
            <h1 class="text-3xl font-black my-3 text-gray-900">${meta.title}</h1>
            <p class="text-base text-gray-600 leading-relaxed mb-6">${meta.summary}</p>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm">
              <p>Read the full interactive guide on <a href="${DOMAIN}/blog/${slug}" class="text-purple-600 underline font-bold">${meta.title}</a>.</p>
              <p class="mt-2 text-xs text-gray-500">Explore related resources: <a href="${DOMAIN}/tools" class="underline">AI Creative Tools</a> | <a href="${DOMAIN}/sitemap" class="underline">HTML Sitemap</a></p>
            </div>
          </article>
        `
      };
    }
  }

  // 6. Utility & Legal Pages
  if (clean === '/about') {
    return {
      title: "About Us & Leadership - ModraDown High-Performance Video Tooling",
      description: "Learn about ModraDown's founding mission, zero-storage technology architecture, and technical leadership.",
      canonical: `${DOMAIN}/about`
    };
  }

  if (clean === '/contact') {
    return {
      title: "Contact Us & Engineering Support - ModraDown",
      description: "Get in touch with the ModraDown engineering and support team for inquiries, feedback, or media questions.",
      canonical: `${DOMAIN}/contact`
    };
  }

  if (clean === '/privacy') {
    return {
      title: "Privacy Policy - ModraDown Zero-Storage Commitment",
      description: "ModraDown privacy policy details our strict zero-storage data policy, cookie rules, and user anonymity protections.",
      canonical: `${DOMAIN}/privacy`
    };
  }

  if (clean === '/terms') {
    return {
      title: "Terms of Service & Acceptable Use - ModraDown",
      description: "ModraDown terms of service and acceptable use policy for our online media extraction utilities.",
      canonical: `${DOMAIN}/terms`
    };
  }

  if (clean === '/disclaimer') {
    return {
      title: "Disclaimer & Copyright Disclosures - ModraDown",
      description: "ModraDown disclaimer regarding third-party platforms, personal archiving boundaries, and fair-use principles.",
      canonical: `${DOMAIN}/disclaimer`
    };
  }

  if (clean === '/dmca') {
    return {
      title: "DMCA Copyright Policy & Takedown Desk - ModraDown",
      description: "Digital Millennium Copyright Act (DMCA) compliance details and copyright notice submission guidelines for ModraDown.",
      canonical: `${DOMAIN}/dmca`
    };
  }

  if (clean === '/cookies') {
    return {
      title: "Cookie Policy & Analytics Preferences - ModraDown",
      description: "Detailed overview of functional cookies, analytics measurement tags, and privacy preferences on ModraDown.",
      canonical: `${DOMAIN}/cookies`
    };
  }

  if (clean === '/faq') {
    return {
      title: "Frequently Asked Questions (FAQ) - ModraDown",
      description: "Answers to common questions about downloading video formats, iOS/Android compatibility, speed, and zero-storage safety.",
      canonical: `${DOMAIN}/faq`
    };
  }

  if (clean === '/sitemap' || clean === '/html-sitemap') {
    return {
      title: "HTML Sitemap & Directory | ModraDown",
      description: "Complete HTML sitemap directory of all pages, platform downloaders, AI creative tools, and blog articles on ModraDown.",
      canonical: `${DOMAIN}/sitemap`
    };
  }

  // Fallback for any other route
  return {
    title: "ModraDown - Free HD Video Downloader for All Platforms",
    description: "Download HD videos, reels, shorts and MP3 audio from YouTube, TikTok, Instagram, Facebook, and Twitter quickly, free, and without watermark.",
    canonical: fullUrl,
    ogType: "website"
  };
}

export function renderPageHtml(reqPath: string, rawHtml: string): string {
  const seo = getRouteSeoInfo(reqPath);

  let html = rawHtml;

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);

  // 2. Replace <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${seo.description}" />`
  );

  // 3. Replace <link rel="canonical">
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${seo.canonical}" />`
  );

  // 4. Replace OpenGraph og:title, og:description, og:url
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${seo.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${seo.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${seo.canonical}" />`
  );

  // 5. Replace Twitter twitter:title, twitter:description
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${seo.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${seo.description}" />`
  );

  // 6. Inject Schema.org JSON-LD if present
  if (seo.schema) {
    const jsonLdStr = `<script type="application/ld+json">${JSON.stringify(seo.schema)}</script>`;
    html = html.replace('</head>', `${jsonLdStr}\n</head>`);
  }

  // 7. Inject pre-rendered body snippet into <main id="main-content"> if provided
  if (seo.preRenderBodyHtml) {
    if (html.includes('<main id="main-content"')) {
      html = html.replace(
        /<main id="main-content"[\s\S]*?<\/main>/i,
        `<main id="main-content" class="max-w-7xl mx-auto px-4 py-12">${seo.preRenderBodyHtml}</main>`
      );
    }
  }

  return html;
}

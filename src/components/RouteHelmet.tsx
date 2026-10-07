import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BLOG_POSTS, AUTHORS } from '../data/blogData';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface RouteHelmetProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  schema?: any | any[];
  breadcrumbs?: BreadcrumbItem[];
}

interface RouteMetaConfig {
  title: string;
  description: string;
  keywords: string;
  ogType?: string;
  breadcrumbs?: BreadcrumbItem[];
  customSchema?: any;
}

const CANONICAL_DOMAIN = 'https://modradown.com';
const DEFAULT_OG_IMAGE = `${CANONICAL_DOMAIN}/favicon.png`;

// High-value competitive metadata definitions matching Google AdSense high-CPC keywords
// and competitor targets (SaveFrom.net, Flixier, Sceneform, etc.)
const STATIC_ROUTE_META: Record<string, RouteMetaConfig> = {
  '/': {
    title: 'Online Video Downloader - Download Any URL Free in HD MP4 & MP3 | ModraDown',
    description: 'Paste any video link to save and convert streaming videos in HD MP4 or MP3 audio. Free, fast, watermark-free alternative to SaveFrom and Flixier for all devices.',
    keywords: 'online video downloader, download any url free, mp4 video downloader, free video downloader online, youtube video downloader, instagram video downloader, tiktok video downloader, savefrom net alternative, flixier video downloader, mp4 downloader, video downloader for pc, video downloader free download, yt video downloader',
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', item: '/' }
    ],
    customSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I download videos from any website using ModraDown?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply copy the URL of the video you wish to download from YouTube, TikTok, Instagram, Facebook, or Twitter, paste it into the ModraDown search bar, and select your preferred MP4 resolution or MP3 format."
          }
        },
        {
          "@type": "Question",
          "name": "Is ModraDown free to use with no watermarks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, ModraDown is 100% free with unlimited downloads, no watermarks, and no software installation required."
          }
        },
        {
          "@type": "Question",
          "name": "How does ModraDown compare to SaveFrom.net and Flixier?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike SaveFrom.net which displays invasive pop-up ads and Flixier which requires paid cloud plans for high resolution, ModraDown delivers fast, clean, high-bitrate MP4 and MP3 extractions with zero malware risk."
          }
        }
      ]
    }
  },
  '/tools': {
    title: 'Free AI Video & Creator Tools - Blur, TTS, Overlays & Scripts | ModraDown',
    description: 'Boost your video editing workflow. Free creator tools for blur and pixelate videos, text to speech, green screen overlays, video captions, and rapid content repurposing.',
    keywords: 'blur or pixelate videos, text to speech videos, how to use overlays, green screen videos, team collaboration, chromebook screen recorder, mp4 video downloader for rapid content repurposing, ai video tools, video editor helper',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'AI Creative Tools', item: '/tools' }
    ]
  },
  '/blog': {
    title: 'Video Downloader Guides, Tips & Tutorials (2026) | ModraDown Academy',
    description: 'In-depth tutorials and insights on downloading online videos, legal fair use, repurposing content for TikTok and Reels, and alternatives to SaveFrom.net and Flixier.',
    keywords: 'video downloader guide, savefrom net alternative, flixier video downloader review, download streaming video free, how to download any video from any website, online video downloader tutorial',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Academy & Guides', item: '/blog' }
    ]
  },
  '/faq': {
    title: 'Frequently Asked Questions - Video Downloader & AdSense Safety | ModraDown',
    description: 'Answers to common questions: How to download online videos, MP4 vs MP3 conversion, legal guidelines, watermark removal, and device compatibility.',
    keywords: 'how to download online videos, free video downloader faq, is video downloader safe, download video to iphone android pc, video downloader mp4 questions',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'FAQ', item: '/faq' }
    ]
  },
  '/about': {
    title: 'About ModraDown - MuTechBaar High-Performance Video Tooling',
    description: 'Learn about the mission behind ModraDown, founded by Muhammad Usman Zhaeer under MuTechBaar to provide fast, privacy-respecting video extraction.',
    keywords: 'about modradown, mutechbaar, muhammad usman zhaeer, video downloader company, online media extraction platform',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'About Us', item: '/about' }
    ]
  },
  '/contact': {
    title: 'Contact Support & Feedback | ModraDown',
    description: 'Get in touch with the ModraDown support team for technical help, bug reports, feature requests, or DMCA inquiries.',
    keywords: 'contact modradown, video downloader support, report video downloader bug, feedback',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Contact', item: '/contact' }
    ]
  },
  '/privacy': {
    title: 'Privacy Policy - ModraDown Official Privacy Guidelines',
    description: 'Read the official Privacy Policy for ModraDown. Learn how we handle cookies, Google AdSense advertising, analytics, and your GDPR/CCPA privacy rights.',
    keywords: 'privacy policy modradown, adsense privacy, cookie compliance, gdpr compliance, ccpa',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Privacy Policy', item: '/privacy' }
    ]
  },
  '/terms': {
    title: 'Terms of Service - ModraDown Acceptable Use Policy',
    description: 'Official Terms of Service for ModraDown. Read our acceptable use policy, fair use guidelines, and platform standards for downloading public web videos.',
    keywords: 'terms of service, acceptable use policy, modradown terms, online video downloader rules',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Terms of Service', item: '/terms' }
    ]
  },
  '/disclaimer': {
    title: 'Disclaimer Notice - Fair Use & Third-Party Platforms | ModraDown',
    description: 'Legal disclaimer and intellectual property notice regarding third-party platforms, CDNs, and fair-use personal archiving.',
    keywords: 'video downloader disclaimer, fair use copyright, third party platforms notice',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Disclaimer', item: '/disclaimer' }
    ]
  },
  '/dmca': {
    title: 'DMCA & Copyright Compliance Policy | ModraDown',
    description: 'Information on submitting DMCA notices and our commitment to respecting intellectual property rights.',
    keywords: 'dmca policy, copyright compliance, content takedown notice modradown',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'DMCA Policy', item: '/dmca' }
    ]
  },
  '/cookies': {
    title: 'Cookie Policy - ModraDown Advertising & Analytics Cookies',
    description: 'Learn about how ModraDown uses cookies for Google Analytics and Google AdSense advertising.',
    keywords: 'cookie policy, adsense cookies, dart cookie, doubleclick, analytics cookies',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Cookie Policy', item: '/cookies' }
    ]
  }
};

const PLATFORM_META: Record<string, { title: string; description: string; keywords: string; name: string }> = {
  'youtube-downloader': {
    name: 'YouTube',
    title: 'YouTube Video Downloader - Download YouTube MP4, MP3 Free in 4K & 1080p | ModraDown',
    description: 'Free YouTube video downloader online. Save YouTube videos, Shorts, and playlists in HD MP4 (1080p, 4K) or extract high-bitrate MP3 audio without software or ads.',
    keywords: 'youtube video downloader, youtube downloader, youtube downloader free download, yt video downloader, download youtube mp4, youtube mp3 downloader, youtube video downloader for pc, video downloader mp4, free video downloader online'
  },
  'tiktok-downloader': {
    name: 'TikTok',
    title: 'TikTok Video Downloader Without Watermark - Fast HD MP4 & MP3 | ModraDown',
    description: 'Download TikTok videos and slides without watermark in crisp Full HD MP4 or convert to MP3 audio. Fast, free, and unlimited online TikTok saver.',
    keywords: 'tiktok video downloader, download tiktok without watermark, tiktok downloader, save tiktok video, tiktok mp4 download, tiktok to mp3, no watermark tiktok, tiktok saver online'
  },
  'instagram-downloader': {
    name: 'Instagram',
    title: 'Instagram Video Downloader - Download Reels, Stories & IGTV in HD | ModraDown',
    description: 'Best Instagram downloader to save Instagram Reels, videos, IGTV, and high-resolution photos directly to your device with no login required.',
    keywords: 'instagram video downloader, download instagram reels, instagram story downloader, ig video downloader, save instagram video free, instagram mp4 downloader, instagram reel saver'
  },
  'facebook-video-downloader': {
    name: 'Facebook',
    title: 'Facebook Video Downloader - Download FB Videos & Reels in HD 1080p | ModraDown',
    description: 'Download public Facebook videos, Reels, and live streams in high definition 1080p MP4. Free FB video saver for mobile and desktop.',
    keywords: 'facebook video downloader, fb video download, download facebook reels, facebook video downloader online free, fb mp4 download, save facebook clip'
  },
  'twitter-video-downloader': {
    name: 'Twitter (X)',
    title: 'Twitter (X) Video Downloader - Download X Videos & GIFs in High Quality | ModraDown',
    description: 'Save Twitter (X) videos and animated GIFs in HD MP4 with audio. Simple, fast, and secure online Twitter video extraction tool.',
    keywords: 'twitter video downloader, x video downloader, download twitter video, twitter mp4 converter, save x video free, download x clip'
  },
  'pinterest-downloader': {
    name: 'Pinterest',
    title: 'Pinterest Video Downloader - Save Pinterest Videos, GIFs & Pins in HD | ModraDown',
    description: 'Download Pinterest video pins, ideas, stories, and images in pristine HD quality. Fast online Pinterest pin downloader.',
    keywords: 'pinterest video downloader, download pinterest video, pinterest downloader mp4, save pinterest pin video, pinterest video save'
  },
  'reddit-video-downloader': {
    name: 'Reddit',
    title: 'Reddit Video Downloader with Audio - Save Reddit MP4 Clips Free | ModraDown',
    description: 'Download Reddit videos with merged audio in HD MP4. Fast, free, and works with all subreddits and Reddit video links.',
    keywords: 'reddit video downloader, reddit video downloader with audio, save reddit video, reddit mp4 downloader, download reddit clip'
  },
  'vimeo-downloader': {
    name: 'Vimeo',
    title: 'Vimeo Video Downloader - Download Vimeo 1080p & 4K Streams Free | ModraDown',
    description: 'Save Vimeo videos in 1080p and 4K resolutions. Extract clean MP4 video streams without buffering or playback limits.',
    keywords: 'vimeo video downloader, download vimeo videos online, vimeo to mp4, free vimeo downloader, vimeo hd video'
  },
  'linkedin-downloader': {
    name: 'LinkedIn',
    title: 'LinkedIn Video Downloader - Save Professional Videos & Presentations | ModraDown',
    description: 'Download professional video presentations, feeds, and keynote clips from LinkedIn in HD MP4 with crystal clear sound.',
    keywords: 'linkedin video downloader, download linkedin video, save linkedin video mp4, linkedin video saver'
  },
  'dailymotion-downloader': {
    name: 'DailyMotion',
    title: 'DailyMotion Video Downloader - Free 1080p HD MP4 Downloader | ModraDown',
    description: 'Download DailyMotion videos in 1080p Full HD and convert to MP4 or MP3. Fast and hassle-free online downloader.',
    keywords: 'dailymotion video downloader, download dailymotion videos, dailymotion to mp4, dailymotion free download'
  },
  'threads-downloader': {
    name: 'Threads',
    title: 'Threads Video Downloader - Download Threads Videos & Clips | ModraDown',
    description: 'Save videos and media from Instagram Threads quickly in HD MP4 format. No account required.',
    keywords: 'threads video downloader, download threads videos, threads mp4 download, save threads clip'
  },
  'snapchat-downloader': {
    name: 'Snapchat',
    title: 'Snapchat Spotlight Downloader - Save Snapchat Stories & Videos | ModraDown',
    description: 'Extract and download public Snapchat Spotlight videos and stories in HD MP4 quality.',
    keywords: 'snapchat video downloader, download snapchat spotlight, save snapchat story, snapchat video save'
  }
};

export default function RouteHelmet({
  title: propTitle,
  description: propDescription,
  canonicalUrl: propCanonical,
  keywords: propKeywords,
  ogImage: propOgImage,
  ogType: propOgType,
  noIndex = false,
  schema: propSchema,
  breadcrumbs: propBreadcrumbs
}: RouteHelmetProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const resolved = useMemo(() => {
    // 1. Direct Static Route Match
    if (STATIC_ROUTE_META[pathname]) {
      const cfg = STATIC_ROUTE_META[pathname];
      return {
        title: propTitle || cfg.title,
        description: propDescription || cfg.description,
        keywords: propKeywords || cfg.keywords,
        ogType: propOgType || cfg.ogType || 'website',
        breadcrumbs: propBreadcrumbs || cfg.breadcrumbs,
        customSchema: cfg.customSchema
      };
    }

    // 2. Downloader Platform Match (/downloader/:platformSlug)
    if (pathname.startsWith('/downloader/')) {
      const slug = pathname.replace('/downloader/', '').split('/')[0];
      const p = PLATFORM_META[slug];
      if (p) {
        return {
          title: propTitle || p.title,
          description: propDescription || p.description,
          keywords: propKeywords || p.keywords,
          ogType: propOgType || 'website',
          breadcrumbs: propBreadcrumbs || [
            { name: 'Home', item: '/' },
            { name: `${p.name} Downloader`, item: `/downloader/${slug}` }
          ],
          customSchema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": `${p.name} Video Downloader`,
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        };
      }
    }

    // 3. Blog Post Detail Match (/blog/:slug)
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '').split('/')[0];
      const post = BLOG_POSTS.find(b => b.slug === slug);
      if (post) {
        const author = AUTHORS[post.authorId];
        return {
          title: propTitle || `${post.title} | ModraDown`,
          description: propDescription || post.summary,
          keywords: propKeywords || post.tags.join(', ') + ', video downloader, modradown',
          ogType: propOgType || 'article',
          breadcrumbs: propBreadcrumbs || [
            { name: 'Home', item: '/' },
            { name: 'Academy', item: '/blog' },
            { name: post.title, item: `/blog/${post.slug}` }
          ],
          customSchema: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.summary,
            "author": {
              "@type": "Person",
              "name": author?.name || "Muhammad Usman Zhaeer"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ModraDown",
              "logo": {
                "@type": "ImageObject",
                "url": `${CANONICAL_DOMAIN}/favicon.png`
              }
            },
            "datePublished": post.publishedAt,
            "mainEntityOfPage": `${CANONICAL_DOMAIN}/blog/${post.slug}`
          }
        };
      }
    }

    // 4. Default / 404 Fallback
    return {
      title: propTitle || 'ModraDown - All-in-One Online Video Downloader',
      description: propDescription || 'Free online video downloader for YouTube, TikTok, Instagram, Facebook, and Twitter. Save HD MP4 and MP3 files quickly.',
      keywords: propKeywords || 'video downloader, free video downloader, download video online, mp4 downloader',
      ogType: propOgType || 'website',
      breadcrumbs: propBreadcrumbs,
      customSchema: undefined
    };
  }, [pathname, propTitle, propDescription, propKeywords, propOgType, propBreadcrumbs]);

  // Always compute canonical URL
  const resolvedCanonical = useMemo(() => {
    if (propCanonical) {
      if (propCanonical.startsWith('http')) {
        return propCanonical.replace('https://social-video-downloader.ai.studio', CANONICAL_DOMAIN);
      }
      const clean = propCanonical.startsWith('/') ? propCanonical : `/${propCanonical}`;
      return `${CANONICAL_DOMAIN}${clean}`;
    }
    return `${CANONICAL_DOMAIN}${pathname === '/' ? '/' : pathname}`;
  }, [propCanonical, pathname]);

  const resolvedOgImage = propOgImage || DEFAULT_OG_IMAGE;

  // Global schemas
  const schemas = useMemo(() => {
    const list: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ModraDown",
        "url": CANONICAL_DOMAIN,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${CANONICAL_DOMAIN}/downloader/youtube-downloader?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ModraDown",
        "url": CANONICAL_DOMAIN,
        "logo": DEFAULT_OG_IMAGE,
        "founder": {
          "@type": "Person",
          "name": "Muhammad Usman Zhaeer"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ModraDown Online Video Downloader",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ];

    if (resolved.breadcrumbs && resolved.breadcrumbs.length > 0) {
      list.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": resolved.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.item.startsWith('http') ? b.item : `${CANONICAL_DOMAIN}${b.item.startsWith('/') ? b.item : '/' + b.item}`
        }))
      });
    }

    if (resolved.customSchema) {
      list.push(resolved.customSchema);
    }

    if (propSchema) {
      if (Array.isArray(propSchema)) {
        list.push(...propSchema);
      } else {
        list.push(propSchema);
      }
    }

    return list;
  }, [resolved.breadcrumbs, resolved.customSchema, propSchema]);

  return (
    <Helmet prioritizeSeoTags>
      {/* Title */}
      <title>{resolved.title}</title>

      {/* Meta Tags */}
      <meta name="description" content={resolved.description} />
      <meta name="keywords" content={resolved.keywords} />
      <link rel="canonical" href={resolvedCanonical} />

      {/* Robots Directives */}
      <meta 
        name="robots" 
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
      />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="ModraDown" />
      <meta property="og:title" content={resolved.title} />
      <meta property="og:description" content={resolved.description} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:type" content={resolved.ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolved.title} />
      <meta name="twitter:description" content={resolved.description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* Structured Data JSON-LD */}
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BLOG_POSTS, AUTHORS } from '../data/blogData';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

const DOMAIN = 'https://videodownloder.online';

// Platform specific FAQs for high-intent search queries & rich search snippets
const PLATFORM_FAQS: Record<string, { question: string; answer: string }[]> = {
  'youtube-downloader': [
    {
      question: "How do I download YouTube videos in HD MP4 or MP3?",
      answer: "Copy the YouTube video URL, paste it into ModraDown, select your preferred video resolution (1080p, 720p, 4K) or 320kbps MP3 audio format, and click Download."
    },
    {
      question: "Can I download YouTube Shorts using ModraDown?",
      answer: "Yes, ModraDown supports all YouTube Shorts links. Simply copy the link from YouTube Shorts and paste it into our downloader."
    },
    {
      question: "Is there any limit on how many YouTube videos I can download?",
      answer: "No, ModraDown offers 100% free, unlimited YouTube video and audio downloads with no watermarks and no registration required."
    }
  ],
  'tiktok-downloader': [
    {
      question: "How to download TikTok videos without watermark?",
      answer: "Paste any TikTok video link into ModraDown. Our tool automatically strips the watermark and provides a clean Full HD MP4 download."
    },
    {
      question: "Can I extract MP3 audio from a TikTok video?",
      answer: "Yes, you can extract high-quality MP3 audio tracks directly from any TikTok video using our TikTok downloader."
    },
    {
      question: "Does ModraDown work on iPhone and Android for TikTok downloads?",
      answer: "Yes, ModraDown works seamlessly on modern mobile browsers including Safari on iOS, Chrome on Android, and desktop browsers."
    }
  ],
  'instagram-downloader': [
    {
      question: "How do I download Instagram Reels and Stories?",
      answer: "Copy the link to the Instagram Reel or public post, paste it into ModraDown, and click Download to save the HD MP4 file."
    },
    {
      question: "Is it safe to download Instagram videos with ModraDown?",
      answer: "Yes, ModraDown requires no login, no password, and does not track your personal download history."
    }
  ],
  'facebook-downloader': [
    {
      question: "How to download Facebook videos in 1080p Full HD?",
      answer: "Copy the Facebook video link, paste it into ModraDown, and select 1080p HD or SD quality to save the video directly to your device."
    },
    {
      question: "Can I download public Facebook Reels?",
      answer: "Yes, ModraDown supports public Facebook Reels, posts, and videos."
    }
  ],
  'twitter-downloader': [
    {
      question: "How do I save videos and GIFs from Twitter (X)?",
      answer: "Copy the URL of the tweet containing the video or GIF, paste it into ModraDown, and click Download to convert it into MP4."
    }
  ],
  'pinterest-downloader': [
    {
      question: "How to download Pinterest video pins?",
      answer: "Paste the Pinterest pin link into ModraDown to download video pins and images in original resolution."
    }
  ],
  'reddit-downloader': [
    {
      question: "How to download Reddit videos with audio?",
      answer: "Paste the Reddit post URL into ModraDown. Our system automatically merges the audio and video streams into a single playable MP4 file."
    }
  ],
  'vimeo-downloader': [
    {
      question: "How to save Vimeo videos in HD 1080p?",
      answer: "Paste the Vimeo link into ModraDown, choose your preferred bitrate and resolution, and download your video instantly."
    }
  ]
};

// Global default FAQs for non-platform pages
const DEFAULT_FAQS = [
  {
    question: "Is ModraDown 100% free with no watermarks?",
    answer: "Yes! ModraDown is completely free to use with no hidden fees, no software downloads, no registration, and no watermarks."
  },
  {
    question: "What platforms are supported by ModraDown?",
    answer: "ModraDown supports YouTube, TikTok, Instagram, Facebook, Twitter (X), Pinterest, Reddit, Vimeo, and 100+ free creator tools via PixelDoc."
  },
  {
    question: "Do you store or host downloaded videos on your servers?",
    answer: "No. ModraDown does not host or store any copyright media. All media is fetched on-the-fly directly from public CDNs."
  }
];

export default function JsonLdSchema() {
  const location = useLocation();
  const path = location.pathname;

  // 1. Build dynamic Breadcrumbs list
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", item: "/" }];

  if (path === "/tools") {
    breadcrumbs.push({ name: "AI Creative Tools", item: "/tools" });
  } else if (path === "/blog") {
    breadcrumbs.push({ name: "Academy Articles", item: "/blog" });
  } else if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "").split("/")[0];
    const post = BLOG_POSTS.find((b) => b.slug === slug);
    breadcrumbs.push({ name: "Academy Articles", item: "/blog" });
    breadcrumbs.push({ name: post ? post.title : "Article", item: path });
  } else if (path.startsWith("/downloader/")) {
    const slug = path.replace("/downloader/", "").split("/")[0];
    const platformName = slug.split("-")[0];
    const formattedName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
    breadcrumbs.push({ name: "Downloader", item: "/" });
    breadcrumbs.push({ name: `${formattedName} Downloader`, item: path });
  } else if (path.endsWith("-downloader")) {
    const platformName = path.replace("/", "").replace("-downloader", "").replace("-video", "");
    const formattedName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
    breadcrumbs.push({ name: `${formattedName} Downloader`, item: path });
  } else if (path === "/about") {
    breadcrumbs.push({ name: "About Us", item: "/about" });
  } else if (path === "/contact") {
    breadcrumbs.push({ name: "Contact Us", item: "/contact" });
  } else if (path === "/faq") {
    breadcrumbs.push({ name: "FAQ", item: "/faq" });
  } else if (path === "/privacy") {
    breadcrumbs.push({ name: "Privacy Policy", item: "/privacy" });
  } else if (path === "/terms") {
    breadcrumbs.push({ name: "Terms of Service", item: "/terms" });
  } else if (path === "/disclaimer") {
    breadcrumbs.push({ name: "Disclaimer", item: "/disclaimer" });
  } else if (path === "/dmca") {
    breadcrumbs.push({ name: "DMCA Policy", item: "/dmca" });
  } else if (path === "/cookies") {
    breadcrumbs.push({ name: "Cookie Policy", item: "/cookies" });
  } else if (path === "/sitemap" || path === "/html-sitemap") {
    breadcrumbs.push({ name: "HTML Sitemap", item: path });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.name,
      "item": b.item.startsWith("http") ? b.item : `${DOMAIN}${b.item.startsWith("/") ? b.item : "/" + b.item}`
    }))
  };

  // 2. Build dynamic FAQ schema
  let currentFaqs = DEFAULT_FAQS;
  const platformKey = Object.keys(PLATFORM_FAQS).find((key) => path.includes(key.replace("-downloader", "")));
  if (platformKey && PLATFORM_FAQS[platformKey]) {
    currentFaqs = PLATFORM_FAQS[platformKey];
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": currentFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // 3. Organization & Website Schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ModraDown",
    "url": DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${DOMAIN}/youtube-downloader?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ModraDown",
    "url": DOMAIN,
    "logo": `${DOMAIN}/favicon.png`,
    "founder": {
      "@type": "Person",
      "name": "Muhammad Usman Zhaeer"
    },
    "sameAs": [
      "https://twitter.com/modradown",
      "https://facebook.com/modradown"
    ]
  };

  // 4. Page-specific schema
  let pageSpecificSchema: any = null;

  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "").split("/")[0];
    const post = BLOG_POSTS.find((b) => b.slug === slug);
    if (post) {
      const author = AUTHORS[post.authorId];
      pageSpecificSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.summary,
        "author": {
          "@type": "Person",
          "name": author ? author.name : "Muhammad Usman Zhaeer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ModraDown",
          "logo": {
            "@type": "ImageObject",
            "url": `${DOMAIN}/favicon.png`
          }
        },
        "datePublished": post.publishedAt,
        "mainEntityOfPage": `${DOMAIN}/blog/${post.slug}`
      };
    }
  } else if (path === "/about") {
    pageSpecificSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About ModraDown",
      "description": "Learn about MuTechBaar Developing Company and founder Muhammad Usman Zhaeer.",
      "url": `${DOMAIN}/about`
    };
  } else if (path === "/contact") {
    pageSpecificSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact ModraDown Support",
      "description": "Get in touch with ModraDown support team.",
      "url": `${DOMAIN}/contact`
    };
  } else {
    pageSpecificSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ModraDown Online Video Downloader",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  }

  const allSchemas = [
    websiteSchema,
    organizationSchema,
    breadcrumbSchema,
    faqSchema,
    ...(pageSpecificSchema ? [pageSpecificSchema] : [])
  ];

  return (
    <Helmet>
      {allSchemas.map((schemaObj, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      ))}
    </Helmet>
  );
}

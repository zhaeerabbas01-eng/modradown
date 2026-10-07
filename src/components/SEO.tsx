import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
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

export default function SEO({ 
  title = "ModraDown - Free HD Video Downloader for All Platforms", 
  description = "Download HD videos, reels, shorts and MP3 audio from YouTube, TikTok, Instagram, Facebook, and Twitter quickly, free, and without watermark.", 
  canonicalUrl = "https://modradown.com/",
  keywords = "video downloader, free video downloader, download tiktok without watermark, instagram reels downloader, youtube mp4 mp3, flixier video downloader, savefrom net alternative",
  ogImage = "https://modradown.com/favicon.png",
  ogType = "website",
  noIndex = false,
  schema,
  breadcrumbs
}: SEOProps) {
  // Ensure canonical URL is complete and always points to modradown.com
  let formattedCanonical = canonicalUrl;
  if (!formattedCanonical.startsWith('http')) {
    const cleanPath = formattedCanonical.startsWith('/') ? formattedCanonical : `/${formattedCanonical}`;
    formattedCanonical = `https://modradown.com${cleanPath}`;
  } else if (formattedCanonical.includes('social-video-downloader.ai.studio')) {
    formattedCanonical = formattedCanonical.replace('https://social-video-downloader.ai.studio', 'https://modradown.com');
  }

  // Global Website & Organization schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ModraDown",
    "url": "https://modradown.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://modradown.com/downloader/youtube-downloader?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ModraDown",
    "url": "https://modradown.com/",
    "logo": "https://modradown.com/favicon.png",
    "founder": {
      "@type": "Person",
      "name": "Muhammad Usman Zhaeer"
    },
    "sameAs": [
      "https://twitter.com/modradown",
      "https://facebook.com/modradown"
    ]
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ModraDown Online Video Downloader",
    "operatingSystem": "All",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.name,
      "item": b.item.startsWith('http') ? b.item : `https://modradown.com${b.item.startsWith('/') ? b.item : '/' + b.item}`
    }))
  } : null;

  const extraSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const allSchemas = [
    websiteSchema, 
    organizationSchema, 
    softwareAppSchema, 
    ...(breadcrumbSchema ? [breadcrumbSchema] : []), 
    ...extraSchemas
  ];

  return (
    <Helmet>
      {/* Title & Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={formattedCanonical} />
      
      {/* Robots Directives */}
      <meta 
        name="robots" 
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
      />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="ModraDown" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={formattedCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data / JSON-LD */}
      {allSchemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

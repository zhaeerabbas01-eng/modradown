import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  schema?: any | any[];
}

export default function SEO({ 
  title = "ModraDown - Free HD Video Downloader for All Platforms", 
  description = "Download HD videos, reels, shorts and MP3 audio from YouTube, TikTok, Instagram, Facebook, and Twitter quickly, free, and without watermark.", 
  canonicalUrl = "https://social-video-downloader.ai.studio/",
  keywords = "video downloader, free video downloader, download tiktok without watermark, instagram reels downloader, youtube mp4 mp3",
  ogImage = "https://scontent.flyp14-1.fna.fbcdn.net/v/t39.30808-6/753551126_122139552627128597_9033775503917050569_n.jpg?stp=dst-jpg_tt6&cstp=mx1920x1920&ctp=s1920x1920&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHM-Pn0xy0FbpGoh4lBnmBpoBWUL9OVF7-gFZQv05UXv8VxtKB8kG2tTOFEv7vvs0pG0ioE6oqiYY_cHsxuVgZV&_nc_ohc=msPQFhmno9wQ7kNvwEr4fSH&_nc_oc=AdomdSBiq3gmeTxmbpr4FOf_ANwNikRFyeQd4ieqtO-IaKYT2cwakRVu2ntU3AG5rrE&_nc_zt=23&_nc_ht=scontent.flyp14-1.fna&_nc_gid=Z6fiOZeicyyolfT2EcgcTQ&_nc_ss=7b2a8&oh=00_AQAdAe_tivzAjFIvcOPRRKaUJnlwwoy7wrJsWaGZxe-y5A&oe=6A690D6B",
  ogType = "website",
  noIndex = false,
  schema
}: SEOProps) {
  // Ensure canonical URL is complete
  const formattedCanonical = canonicalUrl.startsWith('http') ? canonicalUrl : `https://social-video-downloader.ai.studio${canonicalUrl}`;

  // Global Website & Organization schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ModraDown",
    "url": "https://social-video-downloader.ai.studio/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://social-video-downloader.ai.studio/downloader/youtube-downloader?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ModraDown",
    "url": "https://social-video-downloader.ai.studio/",
    "logo": "https://social-video-downloader.ai.studio/favicon.png",
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

  const extraSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const allSchemas = [websiteSchema, organizationSchema, softwareAppSchema, ...extraSchemas];

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

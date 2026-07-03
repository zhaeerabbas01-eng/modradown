import React, { useState } from "react";
import SEO from "../components/SEO";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import AdPlacement from "../components/AdPlacement";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Legal & Copyright",
      question: "Is using ModraDown legal?",
      answer: "Yes, our web utility products are 100% legal to use for link previewing, examining metadata, extracting static YouTube/short thumbnails, and converting media tracks. We strongly enforce that users must only download content that they own, have explicit commercial authorization to, or is labeled under a public domain Creative Commons license. We strictly respect copyright laws and host zero files."
    },
    {
      category: "Legal & Copyright",
      question: "Do you host or share any of the processed files?",
      answer: "No. ModraDown does not host, cache, clone, or store any file systems on our databases. All content is pulled from the public hosting origin directly (Instagram, TikTok, Twitter, Facebook, etc.) at the time of your search trigger. We serve purely as a format wrapper tool."
    },
    {
      category: "Technical Issues",
      question: "Why do some Instagram links return an authentication boundary error?",
      answer: "Instagram continuously strengthens their anti-scraping firewalls, login-walls, and temporary rate-limiting blocks. If our backend requests trigger rate-limiting, the server falls back gracefully rather than crashing. Under such cases, you can test other valid URLs, or explore our dynamic social AI tools."
    },
    {
      category: "AI Tools",
      question: "How do the AdSense-friendly AI Tools work?",
      answer: "Our smart instruments (Hashtag Generator, Caption Copywriter, Video Title Generator, Social Bio builder, YouTube Tags builder, Content Idea outline) are powered by the robust Google Gemini 3.5 Flash Model. They process your thematic requests server-side and output highly SEO-optimized formats. When no api key is specified, it returns a designed preview matching professional structures."
    },
    {
      category: "Technical Issues",
      question: "What video resolutions are supported?",
      answer: "Our parser is designed to extract all available format options supplied by the public link provider, spanning 1080p Full HD, 720p, 480p, down to individual low-bandwidth options or audio-only streams where available. You can choose your target track in the formats drop-down grid."
    },
    {
      category: "AdSense & Monetization",
      question: "Why does the site contain simulated ad placements?",
      answer: "To ensure that other developers and compliance auditors see how ModraDown integrates Google AdSense banners seamlessly without degrading the mobile-first UX. Once approved, the placeholder blocks are replaced directly with active DoubleClick tag codes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title="FAQ - ModraDown Support"
        description="Find answers to common questions about using ModraDown, legal guidelines, and technical support."
        canonicalUrl="https://modradown.com/faq"
      />
      {/* Glow */}
      <div className="absolute top-[30%] left-[-15%] w-[450px] h-[450px] rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-15%] w-[450px] h-[450px] rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-secondary/20 bg-brand-secondary/5 text-brand-secondary text-xs font-mono mb-4">
            <HelpCircle className="h-4.5 w-4.5 text-brand-primary" />
            Common Inquiries
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Got queries regarding video formatting, legal compliance, or the AI Content Creator kit? Browse through our interactive answers.
          </p>
        </div>

        {/* FAQ Accordion container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition group focus-within:border-brand-primary/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] transition relative cursor-pointer"
                >
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-brand-primary uppercase">
                      {faq.category}
                    </span>
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-primary transition">
                      {faq.question}
                    </span>
                  </div>
                  <div className="ml-4 h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:text-gray-100 transition">
                    {isOpen ? <ChevronUp className="h-4 w-4 text-brand-primary" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white/[0.005]">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ad Space In-Content */}
        <div className="my-12">
          <AdPlacement type="in-content" title="In Content Ad Slot" />
        </div>
      </div>
    </div>
  );
}

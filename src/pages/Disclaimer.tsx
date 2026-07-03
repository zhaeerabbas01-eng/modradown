import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO 
        title="Disclaimer - ModraDown"
        description="Legal disclaimer regarding the use of ModraDown's video downloading services."
        canonicalUrl="https://modradown.com/disclaimer"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="bg-gray-50 dark:bg-[#050816]/60 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Disclaimer Info
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest mb-8">
            Last Updated: June 22, 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-brand-primary pl-6 bg-brand-primary/5 py-4 rounded-r-xl">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              IMPORTANT COPYRIGHT NOTICE: 
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              "Users must only download content they own or have permission to download. The website does not host any media files and respects copyright laws."
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Media Hosting</h2>
            <p>
              ModraDown does not host, upload, clone, index, or store any audio, video, or image media files on its servers. All metadata retrieval requests are performed directly as client-side fetches or processed via server-side link routing directly to public API networks. We act purely as a pipeline wrapper converter tool.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Guarantees</h2>
            <p>
              The information and tools provided on this website are on an "as is" basings without warrantied operations of any kind. Social applications like Instagram, TikTok, and YouTube continuously update their server delivery API formats. Consequently, we cannot guarantee that previewing or conversion will remain 100% stable or reach constant speeds with zero failure rates.
            </p>

            {/* In context ad */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Affiliate & Third-Party Outbound Links</h2>
            <p>
              Our blog system lists tutorials, recommendations, or references to third-party digital video editing software packages. We do not receive commissions or endorse these brands unless explicitly styled on the pages as sponsored material. We are not liable or responsible for the policies, scripts, cookies, or services of linked platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

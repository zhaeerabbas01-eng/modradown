import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO 
        title="Terms & Conditions - ModraDown"
        description="Read the Terms and Conditions for using ModraDown's video downloading services and AI tools."
        canonicalUrl="https://modradown.com/terms"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="bg-gray-50 dark:bg-[#050816]/60 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest mb-8">
            Last Updated: June 22, 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Welcome to ModraDown! These terms and conditions outline the rules and regulations for the use of ModraDown's Website, located at <strong>modradown.com</strong>.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use ModraDown if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Intellectual Property Restrictions</h2>
            <p>
              Unless otherwise stated, ModraDown and/or its licensors own the intellectual property rights for all material on ModraDown. All intellectual property rights are reserved. You may access this from ModraDown for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republish material from ModraDown</li>
              <li>Sell, rent, or sub-license material from ModraDown</li>
              <li>Reproduce, duplicate or copy material from ModraDown</li>
              <li>Redistribute content from ModraDown</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Acceptable Use License</h2>
            <p>
              Our converter, preview, thumbnail picker, and generator tools are designed exclusively for personal and study-related media formatting. Users are strictly prohibited from utilizing this platform to download copyrighted media files of third-party property owners without explicit documented licensing. 
            </p>
            <p>
              You must agree strictly to check and abide by the copyrights of original creators of all digital links pasted. Super Ultra Downloader Hub does not host any media files locally on our servers.
            </p>

            {/* In-content advertisement */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Hyperlinking to our Content</h2>
            <p>
              The following organizations may link to our Website without prior written approval: government agencies, search engines, news organizations, and online directory distributors.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Disclaimer of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. We will not be liable for any loss or damage of any nature arising from usage of our public metadata APIs or tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

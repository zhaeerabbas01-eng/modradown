import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";

export default function DMCA() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO 
        title="DMCA Copyright Policy - ModraDown"
        description="Review our DMCA and Copyright Policy regarding content downloading and compliance."
        canonicalUrl="https://modradown.com/dmca"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="bg-gray-50 dark:bg-[#050816]/60 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            DMCA & Copyright Policy
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest mb-8">
            Last Updated: June 22, 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              ModraDown ("the Site") respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act ("DMCA"), we have designated an agent to receive notifications of claimed copyright infringement.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">No Media Stored locally</h2>
            <p>
              Please note that ModraDown does not host any media files (videos, audios, streams, or clips) on its servers. All search requests, format conversions, and metadata viewing are compiled from direct public links provided by our users, which are routed to external servers (like Instagram, TikTok, YouTube, etc.) where the content is originally hosted.
            </p>
            <p>
              Because of this, we cannot "delete" or "takedown" the original content. To completely remove the file from the internet, you must file a takedown request with the hosting platform that stores the media.
            </p>

            {/* In context ad */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Filing a DMCA Infringement Notification</h2>
            <p>
              If your copyrighted work is linked to, indexed, or referenced on this Site and you wish to file a claim, you must submit a written notification containing the following details to our support desk (support@modradown.com):
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material (e.g. precise page URLs).</li>
              <li>Information reasonably sufficient to permit the service provider to contact you, such as an address, telephone number, and, if available, an electronic mail address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ol>

            <p className="mt-6">
              Please email your completed DMCA report to: <strong>dmca@modradown.com</strong> or submit it via our standard <a href="/contact" className="text-brand-primary hover:underline">Contact Form</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

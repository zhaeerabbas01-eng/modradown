import React from 'react';
import SEO from "../components/SEO";

export default function Policies() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <SEO 
        title="Privacy Policy & Terms - ModraDown"
        description="Review our terms of service and privacy policy for using ModraDown."
        canonicalUrl="https://modradown.com/policies"
      />
      <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-8">Privacy Policy & Terms</h1>
      
      <div className="space-y-8">
        <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Terms of Service</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            By using VidSaver, you agree to our terms of service. You must only download content for which you have the legal right to do so. We do not host any of the downloaded media on our servers.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            All rights to the downloaded media belong to their respective creators and owners. Our service merely acts as an extraction tool for publicly available URLs.
          </p>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Privacy Policy</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            We value your privacy. We do not store, log, or track the URLs you download or the media you save. No personally identifiable information is permanently stored unless explicitly provided for support.
          </p>
          <ul className="list-disc list-inside text-neutral-300 space-y-2 mt-4">
            <li>No tracking of downloaded media</li>
            <li>No selling of user data</li>
            <li>Local-only processing where applicable</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

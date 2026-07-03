import React from 'react';
import SEO from "../components/SEO";

export default function Ads() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <SEO 
        title="Advertise with Us - ModraDown"
        description="Reach thousands of content creators daily by advertising on ModraDown."
        canonicalUrl="https://modradown.com/ads"
      />
      <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-8">Advertisement Info</h1>
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Advertising with Us</h2>
        <p className="text-neutral-400 mb-6 leading-relaxed">
          VidSaver reaches thousands of users daily who are looking to save and manage social media content. If you're interested in advertising on our highly trafficked platform, please contact our ad partnerships team.
        </p>
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-indigo-400 mb-2">Why advertise here?</h3>
          <ul className="list-disc list-inside text-neutral-300 space-y-2">
            <li>High volume of daily active users</li>
            <li>Global audience reach</li>
            <li>Highly engaged user base</li>
            <li>Top rankings for video download keywords</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

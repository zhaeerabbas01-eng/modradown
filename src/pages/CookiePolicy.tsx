import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO 
        title="Cookie Policy - ModraDown"
        description="Learn about how ModraDown uses cookies to improve your user experience."
        canonicalUrl="https://modradown.com/cookie-policy"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="bg-gray-50 dark:bg-[#050816]/60 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Cookie Policy
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest mb-8">
            Last Updated: June 22, 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              This is the Cookie Policy for ModraDown, accessible from <strong>modradown.com</strong>.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">What Are Cookies</h2>
            <p>
              As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use them and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">How We Use Cookies</h2>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
            </p>

            {/* In context ad */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Disabling Cookies</h2>
            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">The Cookies We Set</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Form related cookies:</strong> When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
              </li>
              <li>
                <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Third-Party Cookies</h2>
            <p>
              In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                This site uses Google AdSense to serve advertising. Google uses the DoubleClick DART cookie to serve relevant ads across our site and limit the number of times you see a given ad.
              </li>
              <li>
                For more information on Google AdSense see the official Google AdSense privacy FAQ.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

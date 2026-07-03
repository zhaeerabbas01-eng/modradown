import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16">
      <SEO 
        title="Privacy Policy - ModraDown"
        description="Read the Privacy Policy for ModraDown to understand how we collect, use, and protect your data."
        canonicalUrl="https://modradown.com/privacy-policy"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="bg-gray-50 dark:bg-[#050816]/60 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Privacy Policy - ModraDown
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest mb-8">
            Last Updated: June 22, 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              At ModraDown, accessible from <strong>modradown.com</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ModraDown and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Log Files</h2>
            <p>
              ModraDown follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>

            {/* In context ad placement */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Cookies and Web Beacons</h2>
            <p>
              Like any other website, ModraDown uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Google DoubleClick DART Cookie</h2>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">https://policies.google.com/technologies/ads</a>.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Our Advertising Partners</h2>
            <p>
              Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data, link trackers, and scripts.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Privacy Policies</h2>
            <p>
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ModraDown, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p>
              Note that ModraDown has no access to or control over these cookies that are used by third-party advertisers.
            </p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

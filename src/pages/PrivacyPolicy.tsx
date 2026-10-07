import React from "react";
import SEO from "../components/SEO";
import AdPlacement from "../components/AdPlacement";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileText, CheckCircle2, Mail, ExternalLink } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-8 md:py-12">
      <SEO 
        title="Privacy Policy - ModraDown"
        description="Read the official Privacy Policy for ModraDown. Learn how we handle cookies, Google AdSense advertising, analytics, and your GDPR/CCPA privacy rights."
        canonicalUrl="https://modradown.com/privacy"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Privacy Policy", item: "/privacy" }
        ]}
      />
      <div className="container mx-auto px-4 max-w-4xl pt-2">
        {/* Banner Ad Area */}
        <div className="mb-6">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <article className="bg-white dark:bg-[#0a0f25]/80 rounded-3xl border border-gray-200 dark:border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-md">
          <header className="border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Trust & Regulatory Transparency</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Privacy Policy - ModraDown
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">
              Effective & Last Updated: October 7, 2026 | Operator: MuTechBaar Developing Company
            </p>
          </header>

          <div className="space-y-7 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">1. Overview and Commitment</h2>
              <p>
                Welcome to <strong>ModraDown</strong> (accessible from <Link to="/" className="text-brand-primary underline">https://modradown.com</Link>). We respect your personal privacy and are fully committed to protecting the data of every visitor. This Privacy Policy details the types of information we collect, how it is processed, and your privacy choices under applicable laws including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
              <p className="mt-2">
                ModraDown operates primarily as a client-side video helper tool. <strong>We do not require user account registration, credit cards, or personal profiles to use our online video downloading services.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">2. Information We Collect</h2>
              <p>
                <strong>Log Files:</strong> Like standard web infrastructure, our cloud servers automatically log standard network requests. These logs may contain your IP address, browser user-agent, operating system, referring URL, time stamp, and requested pages. Log data is strictly utilized for network security, DDoS prevention, rate limiting, and technical performance diagnostics. Log files are automatically purged on a rolling schedule.
              </p>
              <p className="mt-2">
                <strong>User Input:</strong> URLs submitted into our download input field are processed in real time to locate publicly accessible CDN video endpoints. We do not store, catalog, or archive user download histories linked to individual personal identities.
              </p>
            </section>

            {/* In context ad placement */}
            <div className="my-8">
              <AdPlacement type="in-content" title="In Content Ad Slot" />
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">3. Google AdSense and DoubleClick DART Cookies</h2>
              <p>
                Google is a third-party advertising partner on our website. Google uses cookies, specifically the DoubleClick DART cookie, to serve advertisements to visitors based upon their visit to ModraDown and other sites across the internet.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                </li>
                <li>
                  Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline inline-flex items-center gap-0.5">
                    Google Ads Settings <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  or through{" "}
                  <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline inline-flex items-center gap-0.5">
                    aboutads.info <ExternalLink className="h-3 w-3" />
                  </a>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">4. Google Analytics Disclosures</h2>
              <p>
                We use Google Analytics (Property ID: <code>G-VYFNEJFLT8</code>) to evaluate anonymous website traffic patterns, page load times, device categories, and popular platform pages. Google Analytics collects pseudonymous client IDs. You can prevent Google Analytics tracking across all websites by installing the official{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline inline-flex items-center gap-0.5">
                  Google Analytics Opt-out Browser Add-on <ExternalLink className="h-3 w-3" />
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">5. GDPR Privacy Rights (For European Union Users)</h2>
              <p>
                If you are a resident of the European Economic Area (EEA), you possess specific data protection rights under Regulation (EU) 2016/679 (GDPR), including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-semibold">Right to Access</strong>
                  <span>You have the right to request copies of any personal data we maintain.</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-semibold">Right to Rectification</strong>
                  <span>You have the right to request that we correct inaccurate or incomplete data.</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-semibold">Right to Erasure</strong>
                  <span>You have the right to request that we erase your personal data under certain conditions.</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <strong className="block text-gray-900 dark:text-white font-semibold">Right to Object & Restrict</strong>
                  <span>You have the right to object to or restrict processing of your personal data.</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">6. CCPA/CPRA Privacy Rights (California Consumers)</h2>
              <p>
                Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Request disclosure of categories and specific pieces of personal information collected.</li>
                <li>Request deletion of personal information collected from the consumer.</li>
                <li>Request to opt-out of the sale or sharing of personal data (We do NOT sell personal data).</li>
                <li>Exercise these rights without discrimination.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">7. Children's Information (COPPA)</h2>
              <p>
                Protecting children online is an absolute priority. ModraDown does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child has submitted personal information on our website, please contact us immediately, and we will promptly purge such records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">8. Contact Information</h2>
              <p>
                If you have questions about this Privacy Policy, your rights, or wish to submit a privacy request, please reach out through our official contact channels:
              </p>
              <div className="mt-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">MuTechBaar Developing Company / ModraDown Support</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email: contact@modradown.com | Support Desk Response: within 24 hours</p>
                </div>
                <Link to="/contact" className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:brightness-110 transition">
                  Contact Support Page
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

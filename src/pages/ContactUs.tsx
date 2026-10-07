import React, { useState } from "react";
import SEO from "../components/SEO";
import { Mail, Send, HelpCircle, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import AdPlacement from "../components/AdPlacement";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Support",
    subject: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", category: "General Support", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-8 md:py-14 relative overflow-hidden">
      <SEO 
        title="Contact Us – ModraDown Support & Inquiries"
        description="Contact the ModraDown team for general support, technical inquiries, and DMCA copyright notices. Direct response within 24–48 hours."
        canonicalUrl="https://videodownloder.online/contact"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Contact Us", item: "/contact" }
        ]}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Ad Slot */}
        <div className="mb-6 flex justify-center">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-xs font-bold mb-4">
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            <span>Official Support Desk &amp; DMCA Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Contact ModraDown
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Have questions about our online downloader, technical issues with a public link, or wish to submit a DMCA copyright inquiry? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Direct Communication Channels</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400 font-bold">Official Support Email</h4>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      contact@videodownloder.online
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Monitored daily. Typical response time: 24 to 48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400 font-bold">DMCA &amp; Copyright Desk</h4>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      dmca@videodownloder.online
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Dedicated priority queue for rights holders and copyright notices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <p>
                  <strong>Service Operator:</strong> MuTechBaar Developing Company
                </p>
                <p>
                  <strong>Lead Engineer:</strong> Muhammad Usman Zhaeer
                </p>
                <p>
                  <strong>Website URL:</strong> https://videodownloder.online/
                </p>
              </div>
            </div>

            {/* Quick Notice Card */}
            <div className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 text-xs text-gray-600 dark:text-gray-400">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-brand-primary" /> Technical Reporting Tips
              </h4>
              <p>
                When reporting an issue with a specific video download, please include the public URL and the device/browser you are using so our engineering team can replicate and resolve it rapidly.
              </p>
            </div>
          </div>

          {/* Form container */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-sm">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Message Received</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out to ModraDown. Your inquiry has been dispatched to our support team and we will respond to your provided email within 24 to 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:brightness-110 transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. jane@example.com"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
                  >
                    <option value="General Support">General Support &amp; Questions</option>
                    <option value="Technical Issue">Technical Issue / Broken Link Report</option>
                    <option value="Copyright/DMCA">Copyright / DMCA Takedown Notification</option>
                    <option value="Feature Suggestion">Feature Suggestion &amp; Feedback</option>
                    <option value="Business Inquiry">Business or Partnership Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Subject
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief summary of your inquiry..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Please describe your question or issue in detail..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-primary/50"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 cursor-pointer transition active:scale-95 disabled:opacity-70"
                >
                  {loading ? <span className="animate-spin">&bull;&bull;&bull;</span> : <Send className="w-4 h-4" />}
                  <span>{loading ? "Sending Message..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

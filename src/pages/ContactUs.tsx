import React, { useState } from "react";
import SEO from "../components/SEO";
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from "lucide-react";
import AdPlacement from "../components/AdPlacement";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title="Contact Us - ModraDown"
        description="Have a question or need support? Contact the ModraDown team for assistance with our video downloading tools and services."
        canonicalUrl="https://modradown.com/contact"
      />
      {/* Background Flare */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Ad Slot */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-xs font-mono mb-4">
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            Support & Business Inquiries
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-4">
            Get in Touch with Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Looking to expand ad partnerships, submit editorial feedback, or report technical bugs? Our support desk responds within twenty-four hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Contacts details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 dark:bg-[#050816]/40 border border-gray-200 dark:border-white/10 p-8 rounded-2xl space-y-8 backdrop-blur-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Contact Information</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                Connect with our partnership executives for custom sponsorship integration or programmatic banner campaigns on Ultra Hub.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase">Email Support</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">support@modradown.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase">Publisher Desk</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">+1 (555) 728-3920</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-[#00FFB3]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase">Headquarters</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Suite 404, Tech District, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Ad Slot */}
            <AdPlacement type="sidebar" title="Sidebar Ad Area" />
          </div>

          {/* Form container */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send an Inquiry Message</h3>

            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Message Sent Successfully!</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm">
                  Thank you for contacting ModraDown. An account manager has queued your ticket and will follow up shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-900 dark:text-gray-100 transition mt-4"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Taylor"
                      className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 outline-none text-sm focus:border-brand-primary placeholder:text-neutral-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. liam@example.com"
                      className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 outline-none text-sm focus:border-brand-primary placeholder:text-neutral-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">Subject Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 outline-none text-sm focus:border-brand-primary transition"
                  >
                    <option value="">General Support Desk</option>
                    <option value="ads">AdSense / Advertising Partnerships</option>
                    <option value="copyright">Copyright / DMCA Notice Takedowns</option>
                    <option value="editorial">Editorial / Guest Posts</option>
                    <option value="tech">Technical Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide precise details..."
                    className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 outline-none text-sm focus:border-brand-primary placeholder:text-neutral-600 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-[0.98] text-gray-900 dark:text-gray-100 rounded-xl font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{loading ? "Sending Ticket..." : "Submit Support Message"}</span>
                  <Send className={`h-4 w-4 ${loading && "animate-spin"}`} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

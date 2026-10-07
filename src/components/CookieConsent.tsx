import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cookie, X, Check } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("modradown_cookie_consent");
      if (!consent) {
        // Delay slightly for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Storage access blocked or restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("modradown_cookie_consent", "accepted");
    } catch (e) {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("modradown_cookie_consent", "declined");
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside 
      aria-label="Cookie Consent Banner" 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white dark:bg-[#0c122c] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-5 md:p-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <span>We value your privacy</span>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              ModraDown uses cookies and web beacons for traffic measurement, Google Analytics, and Google AdSense personalized advertising. You can choose to accept all cookies or decline non-essential cookies. Learn more in our{" "}
              <Link to="/cookies" className="text-brand-primary underline hover:opacity-80">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-brand-primary underline hover:opacity-80">
                Privacy Policy
              </Link>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept All Cookies</span>
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition cursor-pointer"
              >
                Decline Non-Essential
              </button>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleDecline}
            aria-label="Close cookie notice"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

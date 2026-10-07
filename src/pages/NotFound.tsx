import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Home, ArrowLeft, Download, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <SEO 
        title="404 - Page Not Found | ModraDown"
        description="The page you are looking for does not exist on ModraDown. Return home or explore our video downloaders."
        canonicalUrl="https://modradown.com/404"
        noIndex={true}
      />

      <div className="max-w-2xl w-full text-center relative z-10 bg-white dark:bg-[#0a0f25] border border-gray-100 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-brand-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
          <Link 
            to="/" 
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary transition-colors"
          >
            <Home className="w-5 h-5 text-brand-primary" />
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">Home Page</div>
              <div className="text-xs text-gray-500">All-in-One Video Downloader</div>
            </div>
          </Link>

          <Link 
            to="/downloader/youtube-downloader" 
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-brand-primary transition-colors"
          >
            <Download className="w-5 h-5 text-brand-primary" />
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">YouTube Downloader</div>
              <div className="text-xs text-gray-500">Download YouTube HD MP4/MP3</div>
            </div>
          </Link>
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-primary/30"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

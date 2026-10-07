import React, { useState, useEffect } from 'react';
import { Download, Copy, ExternalLink, Zap, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { REVOLTHEM_DIRECT_ADS } from './AdPlacement';

export default function ResultCard({ result }: { result: any }) {
  const [selectedUrl, setSelectedUrl] = useState(
    result.picker && result.picker.length > 0 ? result.picker[0].url : result.url
  );
  const [copied, setCopied] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showAdModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setAdWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAdModal, countdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAdModal(true);
    setCountdown(3);
    setAdWatched(false);
  };

  const handleOpenAd = (adUrl: string) => {
    window.open(adUrl, '_blank');
    setAdWatched(true);
    setCountdown(0);
  };

  const handleFinalDownload = () => {
    const downloadTarget = selectedUrl || result.url;
    if (downloadTarget) {
      window.open(downloadTarget, '_blank');
    }
    setShowAdModal(false);
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return true; 
  };

  const currentSelectionIsVideo = isVideoUrl(selectedUrl) || isVideoUrl(result.url) || isVideoUrl(result.tunnel);

  return (
    <>
      <div id="download-result" className="max-w-4xl w-full mt-10 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-[2rem] p-4 md:p-6 shadow-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center relative">
        {/* Media Player / Preview */}
        <div className="w-full md:w-[55%] shrink-0">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-inner">
             {currentSelectionIsVideo ? (
               <video 
                 src={selectedUrl || result.url} 
                 controls 
                 poster={result.thumbnail}
                 className="w-full h-full object-contain"
               >
                 Your browser does not support the video tag.
               </video>
             ) : (
               <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
             )}
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 line-clamp-3 leading-snug">
            {result.title || "Extracted Media"}
          </h3>

          {/* Format Selector */}
          {result.picker && result.picker.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select 
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                {result.picker.map((p: any, idx: number) => (
                  <option key={idx} value={p.url} className="bg-white dark:bg-[#0a0f25] text-gray-900 dark:text-gray-100">
                    {p.quality || 'Standard Video'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadClick}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20 cursor-pointer active:scale-95"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>Download Video</span>
              </button>
              
              <button 
                onClick={handleCopy}
                className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-5 h-5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Sponsored Fast Direct Links */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Mirrors:</span>
              </span>
              <a 
                href={REVOLTHEM_DIRECT_ADS[0]} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs bg-gray-100 dark:bg-white/5 hover:bg-brand-primary/20 text-gray-800 dark:text-gray-200 hover:text-brand-primary px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 border border-gray-200 dark:border-white/10"
              >
                <span>Server 1 (High Speed)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href={REVOLTHEM_DIRECT_ADS[1]} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs bg-gray-100 dark:bg-white/5 hover:bg-brand-primary/20 text-gray-800 dark:text-gray-200 hover:text-brand-primary px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 border border-gray-200 dark:border-white/10"
              >
                <span>Server 2 (Backup Mirror)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WATCH AD & DOWNLOAD MODAL */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-center flex flex-col items-center">
            
            <button 
              onClick={() => setShowAdModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
              <Zap className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {adWatched ? "Download Link Ready!" : "Sponsored Download Step"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 max-w-sm">
              {adWatched 
                ? "Your HD video file is prepared. Click below to close the ad and download immediately!"
                : "Support ModraDown by viewing our sponsor offer below. Your download starts in a few seconds."}
            </p>

            {/* AD OFFER BOX */}
            <div className="w-full bg-gray-50 dark:bg-white/5 border border-brand-primary/30 p-4 rounded-2xl mb-6 flex flex-col gap-3 items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Verified High-Speed Sponsor</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={() => handleOpenAd(REVOLTHEM_DIRECT_ADS[0])}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Visit Sponsor Server 1</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenAd(REVOLTHEM_DIRECT_ADS[1])}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Visit Sponsor Server 2</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* COUNTDOWN OR DOWNLOAD BUTTON */}
            {adWatched ? (
              <button
                onClick={handleFinalDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Close Ad & Download Now</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAdWatched(true);
                  setCountdown(0);
                  handleFinalDownload();
                }}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm py-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Skip Ad & Download ({countdown}s)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}


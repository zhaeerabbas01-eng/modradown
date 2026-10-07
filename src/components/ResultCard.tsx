import React, { useState } from 'react';
import { Download, Copy, ExternalLink, Zap, CheckCircle2, ShieldCheck, Film } from 'lucide-react';
import { REVOLTHEM_DIRECT_ADS } from './AdPlacement';

export default function ResultCard({ result }: { result: any }) {
  const [selectedUrl, setSelectedUrl] = useState(
    result.picker && result.picker.length > 0 ? result.picker[0].url : result.url
  );
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedUrl || result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFastDownload = () => {
    const downloadTarget = selectedUrl || result.url || result.tunnel;
    if (!downloadTarget) return;

    setDownloading(true);
    const safeTitle = (result.title || "ModraDown_video")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);

    const isAudio = selectedUrl?.toLowerCase().includes("audio") || selectedUrl?.toLowerCase().includes("mp3");
    const fileExt = isAudio ? ".mp3" : ".mp4";
    const fullFilename = `${safeTitle}${fileExt}`;

    // Use backend streaming tunnel to bypass CORS/hotlinking restrictions
    const tunnelUrl = `/api/tunnel?url=${encodeURIComponent(downloadTarget)}&filename=${encodeURIComponent(fullFilename)}`;

    const link = document.createElement('a');
    link.href = tunnelUrl;
    link.setAttribute('download', fullFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 2500);
  };

  const handleOpenSource = () => {
    const target = selectedUrl || result.url;
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const currentSelectionIsVideo = Boolean(selectedUrl || result.url || result.tunnel);

  return (
    <div id="download-result" className="max-w-4xl w-full mt-10 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-[2rem] p-4 md:p-6 shadow-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center relative animate-in fade-in zoom-in-95 duration-300">
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
        <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Stream Verified &amp; Ready for Fast Download</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2 leading-snug">
          {result.title || "Extracted Video File"}
        </h3>

        {/* Format Selector */}
        {result.picker && result.picker.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Film className="w-3 h-3" />
              <span>Available Qualities:</span>
            </label>
            <select 
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer appearance-none"
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleFastDownload}
              disabled={downloading}
              className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 cursor-pointer active:scale-95 disabled:opacity-80"
            >
              <Download className={`w-5 h-5 ${downloading ? "animate-spin" : "animate-bounce"}`} />
              <span>{downloading ? "Starting Download..." : "⚡ Fast Direct Download"}</span>
            </button>
            
            <button 
              onClick={handleCopy}
              className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-4 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={handleOpenSource}
              title="Open raw CDN stream in new tab"
              className="bg-transparent border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 px-3.5 py-3.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Stream</span>
            </button>
          </div>

          {/* Sponsored Fast Direct Links */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>High Speed Mirrors:</span>
            </span>
            <a 
              href={REVOLTHEM_DIRECT_ADS[0]} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs bg-gray-100 dark:bg-white/5 hover:bg-brand-primary/20 text-gray-800 dark:text-gray-200 hover:text-brand-primary px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 border border-gray-200 dark:border-white/10"
            >
              <span>Mirror 1 (Ultra Speed)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href={REVOLTHEM_DIRECT_ADS[1]} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs bg-gray-100 dark:bg-white/5 hover:bg-brand-primary/20 text-gray-800 dark:text-gray-200 hover:text-brand-primary px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 border border-gray-200 dark:border-white/10"
            >
              <span>Mirror 2 (Backup HD)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

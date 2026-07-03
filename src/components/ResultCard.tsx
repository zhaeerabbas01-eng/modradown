import React, { useState } from 'react';
import { Download, Copy } from 'lucide-react';

export default function ResultCard({ result }: { result: any }) {
  const [selectedUrl, setSelectedUrl] = useState(
    result.picker && result.picker.length > 0 ? result.picker[0].url : result.url
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    // Assume it's a video if it's a known media host or if it's not explicitly an image
    return true; 
  };

  const currentSelectionIsVideo = isVideoUrl(selectedUrl) || isVideoUrl(result.url) || isVideoUrl(result.tunnel);

  return (
    <div id="download-result" className="max-w-4xl w-full mt-10 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-[2rem] p-4 md:p-6 shadow-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center">
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
        <div className="flex items-center gap-3">
          <a
            href={selectedUrl || result.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </a>
          
          <button 
            onClick={handleCopy}
            className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

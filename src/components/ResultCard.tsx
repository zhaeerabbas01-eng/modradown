import React, { useState, useEffect } from 'react';
import { Download, Copy, ExternalLink, Zap, ShieldCheck, Film, AlertCircle, Loader2 } from 'lucide-react';
import { REVOLTHEM_DIRECT_ADS } from './AdPlacement';

export default function ResultCard({ result }: { result: any }) {
  const defaultOption = result?.picker && result.picker.length > 0 ? result.picker[0].url : (result?.tunnel || result?.url || "");
  const [selectedUrl, setSelectedUrl] = useState<string>(defaultOption);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>("");

  useEffect(() => {
    const initial = result?.picker && result.picker.length > 0 ? result.picker[0].url : (result?.tunnel || result?.url || "");
    setSelectedUrl(initial);
    setDownloadError("");
    setDownloading(false);
  }, [result]);

  const handleCopy = () => {
    if (!selectedUrl) return;
    navigator.clipboard.writeText(selectedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFastDownload = async () => {
    const rawTarget = selectedUrl || result?.tunnel || result?.url;
    if (!rawTarget) {
      setDownloadError("No valid download URL selected.");
      return;
    }

    setDownloading(true);
    setDownloadError("");

    try {
      const safeTitle = (result?.title || "video")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 50);

      const isAudio = selectedUrl?.toLowerCase().includes("audio") || selectedUrl?.toLowerCase().includes("mp3");
      const isImg = selectedUrl?.toLowerCase().includes("image") || selectedUrl?.toLowerCase().includes(".jpg") || selectedUrl?.toLowerCase().includes(".png");
      const fileExt = isAudio ? ".mp3" : isImg ? ".jpg" : ".mp4";
      const fullFilename = `${safeTitle}${fileExt}`;

      // Calculate final target tunnel URL if not already tunneled
      const targetTunnelUrl = rawTarget.startsWith('/api/tunnel') 
        ? rawTarget 
        : `/api/tunnel?url=${encodeURIComponent(rawTarget)}&filename=${encodeURIComponent(fullFilename)}`;

      // Step 1: Pre-verify stream using fetch to prevent "Failed - No file" or corrupt HTML downloads
      const response = await fetch(targetTunnelUrl, { method: 'GET' });
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok || contentType.includes("application/json") || contentType.includes("text/html")) {
        let errMsg = "";
        try {
          const errJson = await response.json();
          errMsg = errJson.error;
        } catch (_) {}

        // Fallback: If backend tunnel fails due to IP restrictions or signed CDN tokens, launch direct client browser download
        if (rawTarget && rawTarget.startsWith('http')) {
          const directLink = document.createElement('a');
          directLink.href = rawTarget;
          directLink.target = '_blank';
          directLink.rel = 'noopener noreferrer';
          directLink.setAttribute('download', fullFilename);
          document.body.appendChild(directLink);
          directLink.click();
          document.body.removeChild(directLink);
          return;
        }

        throw new Error(errMsg || "Source media server restricted the direct proxy stream. Use the direct link fallback below.");
      }

      // Step 2: Read response stream as Blob
      const blob = await response.blob();
      if (blob.size === 0) {
        if (rawTarget && rawTarget.startsWith('http')) {
          window.open(rawTarget, '_blank', 'noopener,noreferrer');
          return;
        }
        throw new Error("Received empty file stream from media server.");
      }

      // Step 3: Trigger safe Blob URL download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fullFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL after delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 5000);

    } catch (err: any) {
      console.error("Download Error:", err);
      setDownloadError(err.message || "Failed to download media file. Click 'Open Direct Link' to save from source CDN.");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenSource = () => {
    const target = selectedUrl || result?.url;
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const rawTargetUrl = selectedUrl || result?.url || result?.tunnel;
  const currentSelectionIsVideo = Boolean(rawTargetUrl);
  const isEmbed = rawTargetUrl?.includes("youtube.com/embed/") || rawTargetUrl?.includes("player.vimeo.com/");
  const videoStreamSrc = rawTargetUrl?.startsWith('/api/') ? rawTargetUrl : `/api/tunnel?url=${encodeURIComponent(rawTargetUrl)}&inline=true`;

  return (
    <div id="download-result" className="max-w-4xl w-full mt-10 bg-white dark:bg-[#0a0f25] border border-gray-200 dark:border-white/10 rounded-[2rem] p-4 md:p-6 shadow-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center relative animate-in fade-in zoom-in-95 duration-300">
      {/* Media Player / Preview */}
      <div className="w-full md:w-[55%] shrink-0">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-inner">
          {isEmbed ? (
            <iframe
              src={rawTargetUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={result.title || "Public Video Stream"}
            />
          ) : currentSelectionIsVideo ? (
            <video 
              src={videoStreamSrc} 
              controls 
              poster={result.thumbnail}
              className="w-full h-full object-contain"
              onError={(e) => {
                const videoEl = e.currentTarget;
                if (videoEl.src !== rawTargetUrl) {
                  videoEl.src = rawTargetUrl;
                }
              }}
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
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Stream Verified &amp; Ready for Fast Download</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2 leading-snug">
          {result.title || "Extracted Video File"}
        </h3>

        {/* Format Selector */}
        {result.picker && result.picker.length > 0 ? (
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Film className="w-3.5 h-3.5" />
              <span>Available Qualities ({result.picker.length}):</span>
            </label>
            <select 
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              {result.picker.map((p: any, idx: number) => (
                <option key={idx} value={p.url} className="bg-white dark:bg-[#0a0f25] text-gray-900 dark:text-gray-100">
                  {p.quality || 'Standard Quality'}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
            No additional downloadable formats are available for this video.
          </div>
        )}

        {/* Error message banner */}
        {downloadError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleFastDownload}
            disabled={downloading}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Stream Download...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Media File</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleOpenSource}
              className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Direct Link</span>
            </button>
          </div>
        </div>

        {/* Optional Direct Ad Link */}
        {REVOLTHEM_DIRECT_ADS[0] && (
          <a
            href={REVOLTHEM_DIRECT_ADS[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[11px] text-center text-gray-400 hover:text-brand-primary underline transition-colors"
          >
            Sponsored Download High-Speed Mirror
          </a>
        )}
      </div>
    </div>
  );
}

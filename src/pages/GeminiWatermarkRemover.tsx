import React, { useState, useRef } from "react";
import SEO from "../components/SEO";
import { 
  Sparkles, Upload, Video, Image as ImageIcon, Download, CheckCircle2, 
  AlertCircle, RefreshCw, Eye, Wand2, ShieldCheck, ArrowRight, Zap, 
  Trash2, Play, Sliders, Info, FileVideo, Layers, Link as LinkIcon
} from "lucide-react";
import AdPlacement from "../components/AdPlacement";
import PixelDocSpotlight from "../components/PixelDocSpotlight";
import { motion, AnimatePresence } from "motion/react";

export default function GeminiWatermarkRemover() {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [corner, setCorner] = useState<string>("auto");
  const [durationLimit, setDurationLimit] = useState<string>("10s");
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState("Analyzing watermark position...");
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    setError("");
    setResult(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.some(t => selectedFile.type.includes(t.split('/')[1]) || selectedFile.type.startsWith(t.split('/')[0]))) {
      setError("Supported formats: MP4, WebM, MOV videos or JPG, PNG, WebP images.");
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit. Please upload a smaller clip or image.");
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveWatermark = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setResult(null);

    if (activeTab === "upload" && !file) {
      setError("Please select or drop an image or video file first.");
      return;
    }

    if (activeTab === "url" && !mediaUrl.trim()) {
      setError("Please enter a valid video or image URL.");
      return;
    }

    setLoading(true);
    setStepText("Scanning media with Gemini AI Vision...");

    const steps = [
      "Scanning media with Gemini AI Vision...",
      "Locating watermark coordinates & logo bounds...",
      "Applying Gemini AI Inpainting & Content-Aware Fill...",
      "Synthesizing 10-second HD clean video/image output...",
      "Preparing high-speed download package..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setStepText(steps[currentStep]);
    }, 1200);

    try {
      const formData = new FormData();
      if (activeTab === "upload" && file) {
        formData.append("file", file);
        formData.append("corner", corner);
        formData.append("mimeType", file.type);
        formData.append("fileName", file.name);
      } else {
        formData.append("mediaUrl", mediaUrl.trim());
        formData.append("corner", corner);
      }

      const response = await fetch("/api/watermark/remove", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      clearInterval(interval);

      if (!response.ok) {
        throw new Error(data.error || "Watermark removal failed. Please check the file/URL and try again.");
      }

      setResult(data);
      setTimeout(() => {
        document.getElementById("watermark-result-view")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An error occurred while removing watermark.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl("");
    setMediaUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <SEO
        title="Gemini Video & Image Watermark Remover Without Watermark - AI HD Downloader"
        description="Auto remove watermarks, logos, TikTok/Instagram stamps from videos and images using Gemini AI. Upload files or paste links for instant 10s clean HD video & image downloads."
        keywords="gemini watermark remover, video watermark remover AI, remove logo from video online, tiktok downloader without watermark, image watermark remover, remove watermark free 10s video"
        canonicalUrl="https://videodownloder.online/gemini-watermark-remover"
      />

      {/* HERO TITLE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-brand-primary/10 to-pink-500/10 border border-brand-primary/20 text-xs font-black text-brand-primary uppercase tracking-widest shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
          <span>Gemini AI Next-Gen Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          GEMINI Video & Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-600 to-pink-500">Downloader Without Watermark</span>
        </h1>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Upload watermarked videos (up to 10s clips) or images, or paste media links. Our <strong>Gemini AI Vision & Inpainting Engine</strong> detects and erases watermarks, logos, and channel stamps automatically with zero quality loss.
        </p>
      </div>

      <AdPlacement type="horizontal" title="Header Sponsor" />

      {/* TOOL INPUT PANEL */}
      <div className="bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500"></div>

        {/* MODE SWITCHER TABS */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md mx-auto mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "upload"
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "url"
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Paste Media Link</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD FILE */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  isDragOver 
                    ? "border-brand-primary bg-brand-primary/10 scale-[1.01]" 
                    : "border-slate-300 dark:border-white/20 hover:border-brand-primary dark:hover:border-brand-primary bg-slate-50 dark:bg-white/5"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  className="hidden"
                />
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-pink-500 flex items-center justify-center text-white shadow-xl shadow-brand-primary/20">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                    Click to upload or Drag & Drop watermarked file
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Supports MP4, WebM, MOV videos (up to 10 sec) & JPG, PNG, WebP images (max 50MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/10 relative">
                    {file.type.startsWith("video/") ? (
                      <video src={previewUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-black/80 text-white">
                      {file.type.startsWith("video/") ? "Video" : "Image"}
                    </span>
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate max-w-[220px] md:max-w-xs">
                      {file.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.startsWith("video/") ? "10s Clip Max" : "HD Graphic"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Change File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PASTE URL */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Paste TikTok, Instagram, YouTube, or direct image/video link here..."
                className="w-full h-14 pl-12 pr-28 rounded-2xl border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
              />
              <LinkIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setMediaUrl(text.trim());
                  } catch {}
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition cursor-pointer"
              >
                Paste Link
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              💡 Supports links from TikTok, Instagram Reels, YouTube Shorts, Twitter, Facebook, or direct CDN video files.
            </p>
          </div>
        )}

        {/* WATERMARK SETTINGS OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-primary" />
              <span>Watermark Target Area</span>
            </label>
            <select
              value={corner}
              onChange={(e) => setCorner(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/40 cursor-pointer"
            >
              <option value="auto">✨ Auto AI Detection (Recommended)</option>
              <option value="bottom-right">Bottom-Right Corner (TikTok Stamp)</option>
              <option value="top-right">Top-Right Corner</option>
              <option value="bottom-left">Bottom-Left Corner</option>
              <option value="top-left">Top-Left Corner</option>
              <option value="center">Center Brand Watermark / Channel Logo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-purple-500" />
              <span>Video Duration Limit</span>
            </label>
            <div className="h-11 px-4 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between">
              <span>10 Seconds Max (High Quality AI Render)</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-extrabold">Auto-Trim</span>
            </div>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ACTION SUBMIT BUTTON */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleRemoveWatermark}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-primary via-purple-600 to-pink-500 hover:brightness-110 active:scale-[0.99] text-white font-black text-sm md:text-base tracking-wide shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{stepText}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>REMOVE WATERMARK & GENERATE CLEAN DOWNLOAD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
      <AnimatePresence>
        {result && (
          <motion.div
            id="watermark-result-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 mb-12"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    {result.title}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Watermark Stripped • Duration: {result.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showOriginal ? "Showing Original" : "Compare Before/After"}</span>
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-[480px] flex items-center justify-center border border-slate-200 dark:border-white/10">
              {result.fileType === "video" ? (
                <video
                  src={showOriginal ? previewUrl : result.cleanUrl}
                  controls
                  autoPlay
                  className="max-h-[480px] w-full object-contain"
                />
              ) : (
                <img
                  src={showOriginal ? previewUrl : result.cleanUrl}
                  alt="Clean watermark-free result"
                  className="max-h-[480px] w-full object-contain"
                />
              )}

              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showOriginal ? "Original (Watermarked)" : "Gemini AI Watermark-Free"}</span>
              </div>
            </div>

            {/* AI ANALYSIS STATEMENT */}
            {result.aiAnalysis && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs md:text-sm font-medium flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold text-purple-600 dark:text-purple-300 block mb-0.5">Gemini AI Detection Log:</strong>
                  <span>{result.aiAnalysis}</span>
                </div>
              </div>
            )}

            {/* DOWNLOAD BUTTON OPTIONS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Available Clean Downloads:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.picker && result.picker.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.url}
                    download={item.quality ? `clean_${item.quality.replace(/\s+/g, '_')}.mp4` : "watermark_free_media"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-brand-primary/10 border border-slate-200 dark:border-white/10 hover:border-brand-primary/50 text-slate-900 dark:text-white flex items-center justify-between gap-3 group transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm block">{item.quality || "Clean HD Download"}</span>
                        <span className="text-[11px] font-semibold text-slate-400">No Watermark • 100% Free</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdPlacement type="in-content" title="Sponsored Media Content" />

      {/* FEATURE HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Gemini AI Inpainting</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Uses multi-modal computer vision to detect stamp boundaries and reconstruct background pixels seamlessly without blurring.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary w-fit">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">10s Video Clip Processing</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Specifically optimized for short video clips up to 10 seconds (TikTok, Instagram Reels, Shorts) and high-res static images.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500 w-fit">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Direct HD MP4 Export</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Export directly to 1080p MP4 or original PNG format with instant CDN download tunneling. Zero registration needed.
          </p>
        </div>
      </div>

      <PixelDocSpotlight />

      {/* FAQ SECTION */}
      <div className="mt-12 bg-white dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-brand-primary" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-white/10 text-xs md:text-sm font-medium">
          <div className="pt-4 space-y-1">
            <h4 className="font-extrabold text-slate-900 dark:text-white">How does Gemini AI remove watermarks from videos and images?</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Gemini AI analyzes the exact spatial pixel coordinates of the watermark or logo in the video frames or image. It applies content-aware inpainting to reconstruct the underlying background texture cleanly.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h4 className="font-extrabold text-slate-900 dark:text-white">What is the maximum supported video length?</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              The tool handles short video clips up to 10 seconds in duration to maintain maximum resolution rendering and instant AI output speed.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h4 className="font-extrabold text-slate-900 dark:text-white">Can I upload my own watermarked file or paste a link?</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes! You can both upload local MP4/image files directly or paste video links from platforms like TikTok, Instagram, YouTube, Twitter, and Pinterest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

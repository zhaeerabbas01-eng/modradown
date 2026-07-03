import React, { useState, useRef, useEffect } from "react";
import SEO from "../components/SEO";
import { Sparkles, Hash, AlignLeft, Video, UserCheck, Flame, Tag, Copy, Check, Info, Download, Share2, RefreshCw, MousePointer2, FileText, FileJson, Code } from "lucide-react";
import AdPlacement from "../components/AdPlacement";

export interface AIResultSection {
  title: string;
  items: {
    title?: string;
    content: string;
  }[];
}

export interface AIOutput {
  sections: AIResultSection[];
}

interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  placeholder: string;
  optionsLabel?: string;
  options?: string[];
  paramName?: string;
  secondaryLabel?: string;
  secondaryOptions?: string[];
  secondaryParamName?: string;
}

const tools: ToolConfig[] = [
  {
    id: "hashtag",
    name: "Hashtag Generator",
    description: "Produce highly targeted hashtags categorized by reach parameters to boost Discoverability.",
    icon: Hash,
    placeholder: "e.g. Cooking rapid pasta recipes in college dorms",
    optionsLabel: "Target Network",
    options: ["Instagram", "TikTok", "YouTube Shorts", "Twitter/X"],
    paramName: "platform"
  },
  {
    id: "youtube-meta",
    name: "YouTube Meta Extractor",
    description: "Extract title, tags, thumbnail, and description from YouTube links.",
    icon: Video,
    placeholder: "Paste YouTube video link here...",
  },
  {
    id: "caption",
    name: "Caption Generator",
    description: "Author complete micro-copy writeups containing hooks, spacing separators, and triggers.",
    icon: AlignLeft,
    placeholder: "e.g. Describing a day-in-the-life vlog of an iOS indie app developer",
    optionsLabel: "Tone Preference",
    options: ["Professional", "Funny/Sarcastic", "Aesthetic/Minimalist", "Emotional/Inspirational"],
    paramName: "tone",
    secondaryLabel: "Target Network",
    secondaryOptions: ["TikTok", "Instagram", "YouTube Shorts", "LinkedIn"],
    secondaryParamName: "platform"
  },
  {
    id: "title",
    name: "Video Title Generator",
    description: "Create engaging headlines designed to improve raw scroll-stopping Click-Through Rates.",
    icon: Video,
    placeholder: "e.g. Revealing a coding secret that saved weeks of debug struggle",
    optionsLabel: "Primary Objective",
    options: ["Viral Curiosity", "Educational/Step-by-Step", "Controversial Debate", "Direct Benefit"],
    paramName: "goal"
  },
  {
    id: "bio",
    name: "Social Bio Generator",
    description: "Optimize profile bios featuring line-breaks, key value propositions, and custom layouts.",
    icon: UserCheck,
    placeholder: "e.g. Travel videographer providing customized LUT color packages for creators",
    optionsLabel: "Identity Vibe",
    options: ["Creative & Quirky", "Corporate/Expert", "Bold & Confident", "Sleek & Minimal"],
    paramName: "style"
  },
  {
    id: "idea",
    name: "Content Idea Generator",
    description: "Overcome creative blocks with mapped-out script frameworks tailored to your specific niche.",
    icon: Flame,
    placeholder: "e.g. Personal finance tips for beginners",
    optionsLabel: "Content Focus",
    options: ["General Creator", "Business/Entrepreneur", "Gaming", "Lifestyle/Vlog"],
    paramName: "category"
  },
  {
    id: "tags",
    name: "YouTube Search Tags",
    description: "Generate comma-separated search terms built around algorithm traffic logic.",
    icon: Tag,
    placeholder: "e.g. Reviewing the newest mechanical keyboard switch releases",
    optionsLabel: "Optimization Target",
    options: ["General Discoverability", "Long-Tail Niche", "Trending Topics"],
    paramName: "audience"
  }
];

const CopyButton = ({ text, label = "" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 transition cursor-pointer"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand-accent" /> : <Copy className="h-3.5 w-3.5" />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
};

export default function AITools() {
  const [activeToolId, setActiveToolId] = useState("hashtag");
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secondaryVal, setSecondaryVal] = useState("");
  const [tertiaryVal, setTertiaryVal] = useState("");
  
  const [outputObj, setOutputObj] = useState<AIOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ time: 0, chars: 0, words: 0 });
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const activeTool = tools.find(t => t.id === activeToolId)!;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setOutputObj(null);

    const startTime = Date.now();

    try {
      if (activeToolId === 'youtube-meta') {
        const res = await fetch(`/api/download`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: prompt.trim() })
        });
        const data = await res.json();
        if (res.ok) {
           const sections: AIResultSection[] = [{
             title: "Metadata Extracted",
             items: [
               { title: "Title", content: data.title },
               { title: "Description", content: data.description },
               { title: "Thumbnail", content: data.thumbnail },
               { title: "URL", content: data.url }
             ]
           }];
           setOutputObj({ sections });
           setStats({
                time: ((Date.now() - startTime) / 1000),
                chars: data.title.length,
                words: data.title.split(' ').length
            });
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
          setError(data.error || "Failed fetching metadata");
        }
        setLoading(false);
        return;
      }
      
      const res = await fetch(`/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: activeToolId,
          prompt,
          apiKey,
          options: {
            [activeTool.paramName || "option"]: secondaryVal || activeTool.options?.[0],
            [activeTool.secondaryParamName || "secondaryOption"]: tertiaryVal || activeTool.secondaryOptions?.[0]
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        try {
            let parsed = typeof data.output === "string" ? JSON.parse(data.output) : data.output;
            
            // If the model gave raw text or weird format
            if (!parsed.sections) {
               parsed = { sections: [{ title: "Result", items: [{ content: data.output }] }] };
            }

            let textRep = "";
            parsed.sections.forEach((sec: any) => {
                sec.items?.forEach((item: any) => {
                    textRep += (item.title ? item.title + " " : "") + item.content + " ";
                });
            });
            const words = textRep.trim().split(/\s+/).filter(Boolean).length;
            const chars = textRep.length;
            
            setStats({
                time: ((Date.now() - startTime) / 1000),
                chars,
                words
            });
            
            setOutputObj(parsed);
            
            // Auto scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
        } catch (e) {
            console.error("Failed parsing output", e);
            setOutputObj({ sections: [{ title: "Result", items: [{ content: data.output }] }] });
        }
      } else {
        setError(data.error || "Failed conducting generation");
      }
    } catch (e: any) {
      setError("Failed connecting to server. Please ensure development server is responding.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: 'txt' | 'json' | 'md') => {
      if (!outputObj) return;
      let content = "";
      
      if (format === 'json') {
          content = JSON.stringify(outputObj, null, 2);
      } else if (format === 'md') {
          outputObj.sections.forEach(sec => {
              content += `## ${sec.title}\n\n`;
              sec.items.forEach(item => {
                  if (item.title) content += `### ${item.title}\n`;
                  content += `${item.content}\n\n`;
              });
          });
      } else {
          outputObj.sections.forEach(sec => {
              content += `--- ${sec.title.toUpperCase()} ---\n\n`;
              sec.items.forEach(item => {
                  if (item.title) content += `[${item.title}]\n`;
                  content += `${item.content}\n\n`;
              });
          });
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modradown-ai-result.${format}`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const copyAll = () => {
     if (!outputObj) return;
     let content = "";
     outputObj.sections.forEach(sec => {
          content += `--- ${sec.title} ---\n`;
          sec.items.forEach(item => {
              if (item.title) content += `${item.title}: `;
              content += `${item.content}\n`;
          });
          content += "\n";
      });
      navigator.clipboard.writeText(content);
      alert("All copied to clipboard!");
  };

  const renderItems = (items: any[], tool: string) => {
    // Determine layout based on tool
    if (tool === 'hashtag' || tool === 'tags') {
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div key={i} className="group relative flex items-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 transition-all">
              <span className="text-sm text-brand-primary cursor-pointer select-all mr-2">{item.content}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <CopyButton text={item.content} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, i) => (
          <div key={i} className="group relative bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 p-4 rounded-xl hover:border-brand-primary/30 transition-all shadow-sm hover:shadow-md">
            {item.title && <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h5>}
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap select-all">{item.content}</p>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <CopyButton text={item.content} label="Copy" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title="Free AI Tools for Content Creators - ModraDown"
        description="Boost your social media presence with our free AI tools. Generate hashtags, write captions, brainstorm video ideas, and optimize your bio easily."
        canonicalUrl="https://modradown.com/ai-tools"
      />
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[450px] h-[450px] rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Banner Ad Area */}
        <div className="mb-8">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        {/* Hero Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-brand-primary/20 rounded-full px-4 py-1.5 text-brand-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Social Creator Smart Suite</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            AdSense-Approved <span className="text-brand-primary">AI Helper Tools</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Quickly write engaging captions, generate targeted metadata tags, optimize biographies, and map script hooks to elevate channels organically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 px-2">Select Tool</h3>
              
              {tools.map((theTool) => {
                const Icon = theTool.icon;
                const isSelected = activeToolId === theTool.id;
                return (
                  <button
                    key={theTool.id}
                    onClick={() => {
                      setActiveToolId(theTool.id);
                      setPrompt("");
                      setOutputObj(null);
                      setError("");
                      setSecondaryVal(theTool.options?.[0] || "");
                      setTertiaryVal(theTool.secondaryOptions?.[0] || "");
                    }}
                    className={`w-full text-left p-4 rounded-xl flex items-center space-x-4 transition hover:bg-white/[0.03] relative cursor-pointer ${
                      isSelected 
                        ? "bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/30 text-gray-900 dark:text-gray-100 shadow-sm" 
                        : "border border-transparent text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-brand-primary/20 text-brand-primary shadow-sm" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate leading-none mb-1">{theTool.name}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-snug">{theTool.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <AdPlacement type="sidebar" title="Sidebar Ad Area" />
          </div>

          {/* Interactive Generator Container Panel */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-lg shadow-black/5">
              
              <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md">
                  {React.createElement(activeTool.icon, { className: "h-5 w-5" })}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">{activeTool.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{activeTool.description}</p>
                </div>
              </div>

              {/* Informative advice about prompt */}
              <div className="bg-brand-primary/5 border border-brand-primary/10 p-4 rounded-xl flex items-start gap-3 mb-6 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <Info className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <span>
                  Our generator processes input safely and yields 100% original outlines. We strongly reject copyright circumvent strategies. Keep prompts clear and topic-focused for best performance.
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                    What is your topic or niche?
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTool.placeholder}
                    className="w-full bg-white dark:bg-[#050816] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all outline-none resize-none min-h-[120px] shadow-inner"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTool.options && (
                    <div className="space-y-3">
                      <label htmlFor="secondary" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                        {activeTool.optionsLabel}
                      </label>
                      <select
                        id="secondary"
                        value={secondaryVal}
                        onChange={(e) => setSecondaryVal(e.target.value)}
                        className="w-full bg-white dark:bg-[#050816] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all outline-none shadow-sm cursor-pointer"
                        disabled={loading}
                      >
                        {activeTool.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeTool.secondaryOptions && (
                    <div className="space-y-3">
                      <label htmlFor="tertiary" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                        {activeTool.secondaryLabel}
                      </label>
                      <select
                        id="tertiary"
                        value={tertiaryVal}
                        onChange={(e) => setTertiaryVal(e.target.value)}
                        className="w-full bg-white dark:bg-[#050816] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all outline-none shadow-sm cursor-pointer"
                        disabled={loading}
                      >
                        {activeTool.secondaryOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer shadow-lg shadow-brand-primary/20"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></span>
                    <div className="relative bg-white dark:bg-[#050816] px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all group-hover:bg-opacity-0">
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-brand-primary dark:border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-bold text-gray-900 dark:text-white">Generating Outline...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-brand-primary group-hover:text-white transition-colors" />
                          <span className="font-bold text-gray-900 dark:text-white">Generate {activeTool.name}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2 shadow-sm">
                  <span className="font-bold">Error:</span> {error}
                </div>
              )}
            </div>

            {/* In context banner */}
            <AdPlacement type="in-content" title="In Content Ad Slot" />

            {/* Premium Output Results Panel */}
            {outputObj && (
              <div ref={resultsRef} className="relative rounded-2xl animate-fade-in shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-transparent to-brand-secondary/30 rounded-2xl"></div>
                <div className="absolute inset-[1px] bg-white dark:bg-[#050816]/90 backdrop-blur-3xl rounded-[15px] z-0"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden">
                
                {/* Result Header */}
                <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          {activeTool.name} Output
                          <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] uppercase tracking-wider">Success</span>
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>⏱ {stats.time.toFixed(1)}s</span>
                          <span>📝 {stats.words} words</span>
                          <span>✍️ {stats.chars} chars</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={copyAll} className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2 text-xs font-semibold">
                        <Copy className="h-4 w-4" /> Copy All
                      </button>
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                        <button onClick={() => handleDownload('txt')} className="p-1.5 hover:bg-white dark:hover:bg-white/20 rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Download TXT">
                          <FileText className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDownload('md')} className="p-1.5 hover:bg-white dark:hover:bg-white/20 rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Download Markdown">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDownload('json')} className="p-1.5 hover:bg-white dark:hover:bg-white/20 rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Download JSON">
                          <FileJson className="h-4 w-4" />
                        </button>
                      </div>
                      <button onClick={() => handleGenerate()} className="p-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold">
                        <RefreshCw className="h-4 w-4" /> Regenerate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Structured Output Sections */}
                <div className="p-6 space-y-8">
                  {outputObj.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2">
                        {section.title}
                        <div className="h-px bg-brand-primary/20 flex-1"></div>
                      </h4>
                      
                      {renderItems(section.items, activeToolId)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

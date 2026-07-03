import React, { useState, useMemo } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { Search, Calendar, Clock, ArrowRight, User, BookOpen } from "lucide-react";
import { BLOG_POSTS, CATEGORIES, AUTHORS, GENERATE_SEO_TEMPLATES } from "../data/blogData";
import AdPlacement from "../components/AdPlacement";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load the full list of 50 articles
  const allPosts = useMemo(() => {
    return GENERATE_SEO_TEMPLATES();
  }, []);

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(search.toLowerCase()) || 
        post.summary.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allPosts, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title="Creator Blog & Social Media Tips - ModraDown"
        description="Learn how to grow your social media audience with expert guides on TikTok trends, Instagram Reels, YouTube shorts, and content creation."
        canonicalUrl="https://modradown.com/blog"
      />
      {/* Decorative Flare */}
      <div className="absolute top-[15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-secondary/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Banner Ad Slot */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        {/* Title Block */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-brand-primary/20 rounded-full px-4 py-1.5 text-brand-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Knowledge Base & Marketing Guides</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Digital Growth <span className="text-brand-primary">Academy</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Expert strategies on TikTok hooks, Instagram Reels loop formulas, YouTube metadata configuration, and the latest post-production workflow tutorials.
          </p>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl backdrop-blur-md mb-12 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Bar Input */}
            <div className="lg:col-span-4 relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across 50+ guides, tutorials, tags..."
                className="w-full bg-gray-50 dark:bg-[#050816]/80 border border-gray-200 dark:border-white/10 outline-none rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm text-gray-900 dark:text-gray-100 placeholder:text-neutral-600 focus:border-brand-primary transition"
              />
            </div>

            {/* Horizontal Categories Row */}
            <div className="lg:col-span-8 flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-gray-900 dark:text-gray-100 border-none"
                    : "bg-gray-50 dark:bg-[#050816] hover:bg-white/[0.05] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-gray-900 dark:text-gray-100 border-none"
                      : "bg-gray-50 dark:bg-[#050816] hover:bg-white/[0.05] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main content blogs grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 dark:bg-[#050816]/40 border border-gray-200 dark:border-white/10 rounded-3xl">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No matching guides found for "{search}". Try searching for another keyword.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map((post, index) => {
                  const author = AUTHORS[post.authorId];
                  return (
                    <article 
                      key={post.slug} 
                      className="bg-gray-50 dark:bg-[#050816]/60 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col hover:border-brand-primary/20 transition group h-[380px]"
                    >
                      {/* Badge / Category */}
                      <div className="p-6 pb-0 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider font-bold bg-brand-primary/10 border border-brand-primary/20 text-[#00E5FF] uppercase">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Main title and summary */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <Link to={`/blog/${post.slug}`} className="block">
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-primary transition leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                            {post.summary}
                          </p>
                        </div>

                        {/* Author info & Read action */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10 mt-4">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={author?.avatar} 
                              alt={author?.name} 
                              className="h-6 w-6 rounded-full object-cover border border-gray-200 dark:border-white/10"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium">{author?.name}</span>
                          </div>
                          
                          <Link 
                            to={`/blog/${post.slug}`} 
                            className="text-xs font-semibold text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition"
                          >
                            Read Guide <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* In-content banner space */}
            <AdPlacement type="in-content" title="In Content Ad Slot" />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Ad Space */}
            <AdPlacement type="sidebar" title="Sidebar Ad Area" />

            {/* Authors Directory sidebar block */}
            <div className="bg-gray-50 dark:bg-[#050816]/40 border border-gray-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <h4 className="text-sm font-bold tracking-wider font-mono text-gray-900 dark:text-gray-100 mb-6 uppercase flex items-center gap-2">
                <User className="h-4 w-4 text-brand-primary" />
                Verified Authors
              </h4>
              <div className="space-y-6">
                {Object.values(AUTHORS).map(author => (
                  <div key={author.id} className="flex gap-3 items-start border-b border-gray-200 dark:border-white/10 pb-4 last:border-none last:pb-0">
                    <img 
                      src={author.avatar} 
                      alt={author.name} 
                      className="h-10 w-10 rounded-xl object-cover border border-gray-200 dark:border-white/10 mt-0.5 shrink-0"
                    />
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none">{author.name}</h5>
                      <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block">{author.role}</span>
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-snug mt-1">{author.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Policy Compliance banner */}
            <div className="bg-brand-primary/5 border border-brand-primary/10 p-6 rounded-2xl text-center space-y-2">
              <span className="text-xs font-bold text-brand-accent">Policy Notice</span>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Our templates and resource articles promote policy-compliant creator techniques, strictly rejecting content scraping tips or direct digital media bypass advice.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

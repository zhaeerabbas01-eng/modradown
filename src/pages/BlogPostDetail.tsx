import React, { useMemo } from "react";
import SEO from "../components/SEO";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Tag, Share2, CornerDownRight, ShieldCheck, Mail } from "lucide-react";
import { AUTHORS, GENERATE_SEO_TEMPLATES } from "../data/blogData";
import AdPlacement from "../components/AdPlacement";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();

  const posts = useMemo(() => {
    return GENERATE_SEO_TEMPLATES();
  }, []);

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">404 - Guide Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">The growth tutorial you requested could not be found under our records.</p>
          <Link to="/blog" className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-gray-900 dark:text-gray-100 font-semibold inline-block">
            Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  const author = AUTHORS[post.authorId];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-gray-100 py-16 relative overflow-hidden">
      <SEO 
        title={`${post.title} - ModraDown Academy`}
        description={post.summary}
        canonicalUrl={`https://modradown.com/blog/${post.slug}`}
      />
      {/* Dynamic Metadata SEO Tag Simulated Header */}
      <div className="hidden">
        <span id="meta-title">{post.title} | Academy Guides</span>
        <span id="meta-desc">{post.summary}</span>
        <span id="schema-breadcrumbs">Web &gt; Blog &gt; {post.category} &gt; {post.title}</span>
      </div>

      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-secondary/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Banner Ad Area */}
        <div className="mb-12">
          <AdPlacement type="horizontal" title="Header Ad Area" />
        </div>

        {/* Back navigation & Schema Breadcrumbs bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
          <Link to="/blog" className="flex items-center gap-2 hover:text-brand-primary transition">
            <ArrowLeft className="h-4 w-4" /> Back to Academy
          </Link>
          {/* Breadcrumbs Schema Markup display */}
          <div className="flex items-center gap-1.5">
            <span className="hover:text-gray-900 dark:text-gray-100">Academy</span>
            <CornerDownRight className="h-3 w-3" />
            <span className="hover:text-gray-900 dark:text-gray-100 uppercase">{post.category}</span>
            <CornerDownRight className="h-3 w-3" />
            <span className="text-brand-primary line-clamp-1">{post.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main article body */}
          <article className="lg:col-span-8 bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
            
            {/* Category badge */}
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-brand-primary/10 border border-brand-primary/20 text-[#00E5FF] uppercase inline-block mb-6">
              {post.category}
            </span>

            {/* Master display heading */}
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Post meta summary details */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-brand-primary" />
                {post.publishedAt}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-brand-secondary" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-1 text-[#00FFB3]">
                <ShieldCheck className="h-4 w-4" />
                Author Verified Content
              </div>
            </div>

            {/* Simulated Inline Ad Slot */}
            <div className="mb-8">
              <AdPlacement type="in-content" title="In Content Ad Slot 1" />
            </div>

            {/* Detailed styled markdown parsing body */}
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              {post.content.trim().split("\n\n").map((para, i, arr) => {
                const rendered = [];
                // Render paragraphs
                if (para.startsWith("# ")) {
                  rendered.push(
                    <h1 key={i} className="text-2xl md:text-3xl font-black font-sans text-gray-900 dark:text-gray-100 pt-6 pb-2 border-b border-gray-200 dark:border-white/10">
                      {para.replace("# ", "").trim()}
                    </h1>
                  );
                } else if (para.startsWith("## ")) {
                  rendered.push(
                    <h2 key={i} className="text-xl md:text-2xl font-bold font-sans text-gray-900 dark:text-gray-100 pt-5 pb-2">
                      {para.replace("## ", "").trim()}
                    </h2>
                  );
                } else if (para.startsWith("### ")) {
                  rendered.push(
                    <h3 key={i} className="text-lg md:text-xl font-bold font-sans text-gray-900 dark:text-gray-100 pt-4 pb-2">
                      {para.replace("### ", "").trim()}
                    </h3>
                  );
                } else if (para.startsWith("* **") || para.startsWith("*")) {
                  rendered.push(
                    <ul key={i} className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      {para.split("\n").map((li, liIdx) => (
                        <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace("*", "").trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      ))}
                    </ul>
                  );
                } else if (para.startsWith("1. **") || para.startsWith("1.")) {
                  rendered.push(
                    <ol key={i} className="list-decimal pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      {para.split("\n").map((li, liIdx) => (
                        <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.substring(li.indexOf(".") + 1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      ))}
                    </ol>
                  );
                } else {
                  // Parse bold text in normal paragraphs
                  const parsedPara = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  rendered.push(<p key={i} dangerouslySetInnerHTML={{ __html: parsedPara }} />);
                }

                // Inject ad in the middle
                if (i === Math.floor(arr.length / 2)) {
                  rendered.push(
                    <div key={`ad-${i}`} className="my-8">
                      <AdPlacement type="in-content" title="In Content Center Ad" />
                    </div>
                  );
                }
                
                return rendered;
              })}
            </div>

            {/* Simulated Footer Ad Slot */}
            <div className="my-8">
              <AdPlacement type="horizontal" title="Footer Ad Slot" />
            </div>

            {/* Article Tags Footer */}
            <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-gray-200 dark:border-white/10 mt-8">
              <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              {post.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-mono">
                  #{tag}
                </span>
              ))}
            </div>

          </article>

          {/* Sidebar widget columns */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sidebar ad banner */}
            <AdPlacement type="sidebar" title="Sidebar Ad Area" />

            {/* Author Profile block */}
            <div className="bg-gray-50 dark:bg-[#050816]/40 border border-gray-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <h4 className="text-xs font-bold tracking-wider font-mono text-gray-600 dark:text-gray-300 mb-6 uppercase">
                Author Biography
              </h4>
              <div className="flex gap-4 items-start mb-4">
                <img 
                  src={author?.avatar} 
                  alt={author?.name} 
                  className="h-12 w-12 rounded-xl object-cover border border-white/15"
                />
                <div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">{author?.name}</h5>
                  <span className="text-[10px] font-mono text-brand-primary uppercase">{author?.role}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {author?.bio}
              </p>
              <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 bg-white/[0.02] p-2.5 rounded-lg flex items-center gap-2 border border-gray-200 dark:border-white/10">
                <ShieldCheck className="h-4 w-4 text-brand-accent shrink-0" />
                {author?.experience}
              </div>
            </div>

            {/* Newsletter simulated capture widget block */}
            <div className="bg-white/[0.01] border border-gray-200 dark:border-white/10 p-6 rounded-2xl text-center">
              <Mail className="h-8 w-8 text-brand-secondary mx-auto mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Get Creator Optimization Bulletins</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-4">
                Deliver viral short hooks directly and weekly to your inbox folder.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  disabled
                  placeholder="Enter email (Locked)" 
                  className="bg-gray-50 dark:bg-[#050816]/60 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 outline-none text-xs text-gray-900 dark:text-gray-100 max-w-[150px] flex-1 font-sans"
                />
                <button disabled className="px-3 py-1.5 bg-brand-primary text-[#050816] rounded-lg text-xs font-bold shrink-0 opacity-70">
                  Join
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

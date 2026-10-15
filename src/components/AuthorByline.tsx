import React from "react";
import { Link } from "react-router-dom";
import { UserCheck, ShieldCheck, Clock, Calendar, ExternalLink, Award } from "lucide-react";

interface AuthorBylineProps {
  publishedAt?: string;
  updatedAt?: string;
  readTime?: string;
  authorName?: string;
  authorRole?: string;
  authorBio?: string;
  authorAvatar?: string;
  experience?: string;
}

export default function AuthorByline({
  publishedAt = "October 15, 2026",
  updatedAt = "October 15, 2026",
  readTime = "5 min read",
  authorName = "Muhammad Usman Zhaeer",
  authorRole = "Founder & Lead Systems Engineer",
  authorBio = "Muhammad Usman is a full-stack engineer and the creator of ModraDown. He specializes in web streaming protocols, media container extraction, cloud optimization, and ethical technology practices.",
  authorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
  experience = "7+ Years in Web Infrastructure & Media Pipelines"
}: AuthorBylineProps) {
  return (
    <aside 
      aria-label="Author Byline and E-A-T Verification" 
      className="my-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0a0f25]/90 border border-gray-200 dark:border-white/10 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4 mb-4">
        {/* Author Details */}
        <div className="flex items-center gap-3.5">
          <img 
            src={authorAvatar} 
            alt={authorName} 
            width={48} 
            height={48} 
            className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/30 shadow-sm shrink-0"
            loading="lazy"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                Written by {authorName}
              </span>
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" title="Verified Author Credentials" />
            </div>
            <p className="text-xs text-brand-primary font-semibold">
              {authorRole} • <span className="text-gray-500 dark:text-gray-400 font-normal">{experience}</span>
            </p>
          </div>
        </div>

        {/* Date and Read Time Badges */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <span>Updated: {updatedAt}</span>
          </div>
          {readTime && (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full font-semibold text-gray-700 dark:text-gray-300">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Author Bio & E-A-T Fact Box */}
      <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-3">
        <p className="max-w-2xl">
          <strong className="font-semibold text-gray-900 dark:text-white">Editorial Note:</strong> {authorBio} All download guides and software extraction workflows on ModraDown are audited for technical accuracy, fair use compliance, and malware safety.
        </p>
        <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
          <Link 
            to="/about" 
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Meet Team & Editorial Policy</span>
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <a 
            href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-primary transition-colors"
            title="Verified against Google Quality Guidelines"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>E-A-T Certified</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </aside>
  );
}

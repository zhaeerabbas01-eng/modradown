import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb Navigation" 
      className="mb-6 flex items-center flex-wrap gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200/80 dark:border-white/10 w-fit"
    >
      <Link 
        to="/" 
        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5 shrink-0 text-brand-primary" />
        <span>Home</span>
      </Link>

      {items.map((crumb, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400 opacity-60" />
            {isLast ? (
              <span 
                className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[350px]"
                aria-current="page"
              >
                {crumb.name}
              </span>
            ) : (
              <Link 
                to={crumb.item} 
                className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors truncate max-w-[150px] sm:max-w-[200px]"
              >
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

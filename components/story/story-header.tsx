import type { Story } from "@/lib/stories";
import Link from "next/link";
import { formatDate } from "@/lib/news";

export function StoryHeader({ story }: { story: Story }) {
  return (
    <header className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Live Story
        </span>
        <Link 
          href={`/search?category=${encodeURIComponent(story.category)}`} 
          className="text-xs font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
        >
          {story.category}
        </Link>
      </div>
      
      <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-6xl text-white">
        {story.headline}
      </h1>
      
      <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-white/10 py-4 text-sm text-white/50">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last updated: {formatDate(story.lastUpdated)}
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Compiled from {story.sourceCount} sources
        </div>
      </div>
    </header>
  );
}

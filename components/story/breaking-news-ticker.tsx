"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Story } from "@/lib/stories";

export function BreakingNewsTicker({ stories }: { stories: Story[] }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || stories.length === 0) return null;

  // Take the top 5 most recently updated stories for the ticker
  const recentStories = stories.slice(0, 5);
  // Duplicate for seamless infinite scroll animation if needed
  const displayStories = [...recentStories, ...recentStories];

  return (
    <div className="mb-8 overflow-hidden rounded border border-red-400/20 bg-red-500/10 py-3 relative group">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-red-950/80 to-transparent z-10 flex items-center pl-4">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-black uppercase tracking-widest text-red-500 hidden sm:inline-block">Live</span>
        </span>
      </div>
      
      <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-red-100 group-hover:[animation-play-state:paused]">
        {displayStories.map((story, index) => (
          <Link 
            href={`/story/${story.slug}`} 
            key={`${story.id}-${index}`}
            className="hover:text-white transition-colors flex items-center gap-3"
          >
            <span>{story.headline}</span>
            <span className="text-[10px] text-red-300/50">({story.sourceCount} sources)</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

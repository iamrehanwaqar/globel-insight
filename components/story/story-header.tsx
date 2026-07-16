import type { Story } from "@/lib/stories";
import Link from "next/link";
import { SaveStoryButton } from "@/components/user/save-story-button";
import { FollowButton } from "@/components/user/follow-button";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export function StoryHeader({ story }: { story: Story }) {
  return (
    <header className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
        <FollowButton topic={story.category} />
      </div>

      <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-6xl text-white">
        {story.headline}
      </h1>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-y border-white/10 py-4 text-sm text-white/50">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Based on {story.sourceCount} source{story.sourceCount !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Updated {timeAgo(story.lastUpdated)}
          </div>
        </div>
        <SaveStoryButton storySlug={story.slug} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/30">
        <span>Sources:</span>
        {story.sourceNames.map((name) => (
          <span key={name} className="rounded-full bg-white/5 px-2.5 py-1 text-white/40">
            {name}
          </span>
        ))}
      </div>
    </header>
  );
}

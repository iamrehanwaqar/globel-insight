"use client";

import { usePreferences } from "@/components/user/user-preferences-provider";

export function SaveStoryButton({ storySlug, className = "" }: { storySlug: string, className?: string }) {
  const { isStorySaved, toggleSavedStory } = usePreferences();
  const saved = isStorySaved(storySlug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleSavedStory(storySlug);
      }}
      className={`flex items-center gap-2 rounded border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
        saved
          ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
          : "bg-transparent text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
      } ${className}`}
    >
      <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? "Saved" : "Save Story"}
    </button>
  );
}

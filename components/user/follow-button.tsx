"use client";

import { usePreferences } from "@/components/user/user-preferences-provider";

export function FollowButton({ topic, className = "" }: { topic: string, className?: string }) {
  const { isTopicFollowed, toggleTopic } = usePreferences();
  const followed = isTopicFollowed(topic);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleTopic(topic);
      }}
      className={`flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
        followed
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
          : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
      } ${className}`}
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}

import { getServerPreferences } from "@/lib/preferences";
import Link from "next/link";
import { FollowButton } from "@/components/user/follow-button";

export default async function FollowingPage() {
  const prefs = await getServerPreferences();
  
  // Hardcoded topics for demonstration
  const availableTopics = [
    "Technology", "Economy", "World", "Sports", 
    "Artificial Intelligence", "Climate", "Space",
    "Pakistan", "United States", "China", "Europe", "Middle East"
  ];

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Your Interests</h1>
        <p className="text-white/60 text-lg">Follow topics to personalize your Global Briefing.</p>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 border-b border-white/10 pb-4">
          Currently Following ({prefs.followedTopics.length})
        </h2>
        
        {prefs.followedTopics.length === 0 ? (
          <p className="text-white/40 italic">You aren't following any topics yet. Select some below to personalize your feed.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {prefs.followedTopics.map(topic => (
              <div key={topic} className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full pl-4 pr-1 py-1">
                <span className="text-sm font-medium text-emerald-300">{topic}</span>
                <FollowButton topic={topic} className="!py-1 !px-3 !text-[10px]" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-6 border-b border-white/10 pb-4">
          Discover Topics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableTopics.map(topic => {
            const isFollowed = prefs.followedTopics.includes(topic);
            return (
              <div key={topic} className={`flex items-center justify-between p-4 rounded border transition-colors ${
                isFollowed 
                  ? "border-emerald-500/30 bg-emerald-500/5" 
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}>
                <span className={`font-medium ${isFollowed ? "text-emerald-400" : "text-white"}`}>
                  {topic}
                </span>
                <FollowButton topic={topic} className="!py-1.5 !px-3 !text-[10px]" />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

import { getStories, getPersonalizedBriefing } from "@/lib/stories";
import { getServerPreferences } from "@/lib/preferences";
import Link from "next/link";
import { StoryTimeline } from "@/components/story/story-timeline";

export const dynamic = 'force-dynamic';

export default async function DailyIntelligencePage() {
  const prefs = await getServerPreferences();
  const allStories = await getStories();
  const personalizedStories = await getPersonalizedBriefing(prefs.followedTopics);
  
  // Top 3 Global Developments (excluding those already in personalized if possible, or just the top 3 overall)
  const topGlobalStories = allStories.slice(0, 3);
  
  // Stories related to interests
  const interestStories = personalizedStories.filter(s => prefs.followedTopics.some(t => t.toLowerCase() === s.category.toLowerCase()));
  
  // Emerging / Stories to watch
  const emergingStories = allStories.slice(3, 6);

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-5xl">
      <header className="mb-16 border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
            Daily Intelligence
          </span>
          <span className="text-white/40 text-sm">• {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Your Executive Briefing
        </h1>
        <p className="mt-6 text-xl text-white/60 max-w-3xl">
          A concise morning brief on power, money, technology, and global risk, tailored to your interests.
        </p>
      </header>

      {/* TOP GLOBAL DEVELOPMENTS */}
      <section className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 border-l-4 border-emerald-400 pl-4">
          Top Global Developments
        </h2>
        <div className="space-y-8">
          {topGlobalStories.map((story, idx) => (
            <div key={story.id} className="grid md:grid-cols-[1fr_250px] gap-8 bg-white/5 border border-white/10 rounded p-6">
              <div>
                <Link href={`/story/${story.slug}`} className="group">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400/70">{story.category}</div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                    {idx + 1}. {story.headline}
                  </h3>
                </Link>
                <div className="text-white/70 space-y-4">
                  <p><strong>What happened:</strong> {story.whatHappened}</p>
                  <p><strong>Why it matters:</strong> {story.whyItMatters}</p>
                </div>
              </div>
              <div className="border-l border-white/10 pl-8 hidden md:block">
                <h4 className="text-xs font-bold uppercase text-white/40 mb-4">Sources ({story.sourceCount})</h4>
                <ul className="space-y-3">
                  {story.sources.slice(0, 3).map(src => (
                    <li key={src._id} className="text-sm text-white/60 line-clamp-2">
                      <a href={`/blog/${src.slug?.current || src._id}`} className="hover:text-emerald-400 transition-colors">
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YOUR INTERESTS */}
      {prefs.followedTopics.length > 0 && interestStories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 border-l-4 border-emerald-400 pl-4 flex items-center justify-between">
            <span>Your Interests</span>
            <Link href="/following" className="text-xs text-white/50 hover:text-white normal-case tracking-normal">Manage topics</Link>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {interestStories.map(story => (
              <Link href={`/story/${story.slug}`} key={story.id} className="group rounded border border-white/10 bg-white/[0.045] p-6 hover:border-emerald-500/50 transition-colors">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">{story.category}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 mb-3">{story.headline}</h3>
                <p className="text-sm text-white/60 line-clamp-3">{story.whatHappened}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* STORIES TO WATCH */}
      <section className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-6 border-l-4 border-white/20 pl-4">
          Stories To Watch
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {emergingStories.map(story => (
            <div key={story.id} className="border-t border-white/10 pt-4">
              <Link href={`/story/${story.slug}`} className="group">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2">{story.headline}</h3>
                <p className="text-sm text-white/50 line-clamp-2">{story.whatHappened}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

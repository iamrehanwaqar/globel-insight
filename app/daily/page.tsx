import { getStories, getPersonalizedBriefing } from "@/lib/stories";
import { getServerPreferences } from "@/lib/preferences";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function DailyIntelligencePage() {
  const prefs = await getServerPreferences();
  const allStories = await getStories();
  const personalizedStories = await getPersonalizedBriefing(prefs.followedTopics);

  const topGlobalStories = allStories.slice(0, 3);
  const interestStories = personalizedStories.filter(s =>
    prefs.followedTopics.some(t => t.toLowerCase() === s.category.toLowerCase())
  );
  const emergingStories = allStories.slice(3, 6);

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-6xl">
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

      {/* ── Top Global Developments ── */}
      <section className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 border-l-4 border-emerald-400 pl-4">
          Top Global Developments
        </h2>

        {topGlobalStories.length > 0 && topGlobalStories[0].heroImage && (
          <Link href={`/story/${topGlobalStories[0].slug}`} className="group relative block overflow-hidden rounded-xl border border-white/10 mb-8">
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                src={topGlobalStories[0].heroImage}
                alt={topGlobalStories[0].headline}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="mb-3 inline-block rounded bg-emerald-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {topGlobalStories[0].category}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white group-hover:text-emerald-200 transition-colors">
                {topGlobalStories[0].headline}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/65 line-clamp-2 max-w-3xl">
                {topGlobalStories[0].whatHappened}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                <span>{topGlobalStories[0].sourceCount} sources</span>
                <span>•</span>
                <span>{topGlobalStories[0].sourceNames.slice(0, 3).join(", ")}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="space-y-6">
          {topGlobalStories.map((story, idx) => (
            <div key={story.id} className="grid md:grid-cols-[1fr_250px] gap-8 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {story.heroImage && (
                <div className="relative aspect-[16/9] md:aspect-auto md:h-full overflow-hidden">
                  <Image
                    src={story.heroImage}
                    alt={story.headline}
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <Link href={`/story/${story.slug}`} className="group">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400/70">{story.category}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                    {idx + 1}. {story.headline}
                  </h3>
                </Link>
                <div className="text-white/70 space-y-3 text-sm">
                  <p><strong className="text-white/90">What happened:</strong> {story.whatHappened}</p>
                  <p><strong className="text-white/90">Why it matters:</strong> {story.whyItMatters}</p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-white/35 border-t border-white/10 pt-4">
                  <span>{story.sourceCount} sources</span>
                  <span>{story.sourceNames.slice(0, 3).join(", ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Your Interests ── */}
      {prefs.followedTopics.length > 0 && interestStories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 border-l-4 border-emerald-400 pl-4 flex items-center justify-between">
            <span>Your Interests</span>
            <Link href="/following" className="text-xs text-white/50 hover:text-white normal-case tracking-normal">Manage topics</Link>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {interestStories.map(story => (
              <Link href={`/story/${story.slug}`} key={story.id} className="group relative block overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] hover:border-emerald-500/50 transition-colors">
                {story.heroImage && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={story.heroImage}
                      alt={story.headline}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">{story.category}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 mb-2">{story.headline}</h3>
                  <p className="text-sm text-white/60 line-clamp-2">{story.whatHappened}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Stories To Watch ── */}
      {emergingStories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-8 border-l-4 border-white/20 pl-4">
            Stories To Watch
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergingStories.map(story => (
              <Link key={story.id} href={`/story/${story.slug}`} className="group relative block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] hover:border-emerald-400/40 transition-colors">
                {story.heroImage && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={story.heroImage}
                      alt={story.headline}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/70">{story.category}</span>
                  <h3 className="mt-1 text-lg font-bold text-white group-hover:text-emerald-400 mb-2 line-clamp-2">{story.headline}</h3>
                  <p className="text-sm text-white/50 line-clamp-2">{story.whatHappened}</p>
                  <div className="mt-3 text-xs text-white/30">{story.sourceCount} sources</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {allStories.length === 0 && (
        <div className="py-20 text-center border border-white/10 rounded-xl bg-white/[0.03]">
          <svg className="mx-auto h-16 w-16 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h2 className="mt-6 text-2xl font-black text-white/60">No stories yet</h2>
          <p className="mt-3 text-white/40">Intelligence briefings will appear here as sources are aggregated.</p>
          <Link href="/" className="mt-6 inline-block rounded bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400">
            Back to Home
          </Link>
        </div>
      )}
    </main>
  );
}

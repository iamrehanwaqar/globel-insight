import Link from "next/link";
import { StoryCard } from "@/components/story/story-card";
import { HeroImage } from "@/components/story/hero-image";
import { getArticles } from "@/lib/news";
import { getStories } from "@/lib/stories";
import { BreakingNewsTicker } from "@/components/story/breaking-news-ticker";
import { getServerPreferences } from "@/lib/preferences";

const CATEGORY_SECTIONS = [
  { slug: "World",         label: "World",           gradient: "from-blue-500/20 to-cyan-500/20" },
  { slug: "Technology",    label: "Tech & AI",       gradient: "from-violet-500/20 to-purple-500/20" },
  { slug: "Sports",        label: "Sports",           gradient: "from-orange-500/20 to-amber-500/20" },
  { slug: "Entertainment", label: "Entertainment",    gradient: "from-fuchsia-500/20 to-pink-500/20" },
  { slug: "Science",       label: "Science",          gradient: "from-cyan-500/20 to-blue-500/20" },
  { slug: "Business",      label: "Business",         gradient: "from-emerald-500/20 to-teal-500/20" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function Home() {
  const articles = await getArticles();
  const stories = await getStories();
  const prefs = await getServerPreferences();

  const featuredStory = stories[0];
  const hasPersonalization = prefs.followedTopics.length > 0;

  const latestStories = stories.slice(1, 7);

  return (
    <main className="overflow-hidden">
      {/* ── Breaking Ticker ── */}
      <BreakingNewsTicker stories={stories} />

      {/* ── Hero Section: ONE STORY. EVERY PERSPECTIVE. ── */}
      <section className="relative border-b border-white/10">
        {featuredStory ? (
          <div className="relative min-h-[600px] lg:min-h-[700px]">
            <HeroImage
              src={featuredStory.heroImage}
              alt={featuredStory.headline}
              category={featuredStory.category}
            />

            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/60 to-[#070a12]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070a12]/80 via-[#070a12]/40 to-transparent" />
            <div className="absolute inset-0 bg-[#070a12]/10" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
              <div className="max-w-3xl">
                {/* Tagline */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-emerald-400" />
                  <span className="text-sm font-black uppercase tracking-[0.34em] text-emerald-300">
                    One Story. Every Perspective.
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg">
                  {featuredStory.headline}
                </h1>

                {/* Briefing */}
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 drop-shadow">
                  {featuredStory.whatHappened.length > 280
                    ? `${featuredStory.whatHappened.slice(0, 280)}...`
                    : featuredStory.whatHappened}
                </p>

                {/* Metadata */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/55">
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="font-bold text-white/80">{featuredStory.sourceCount}</span> source{featuredStory.sourceCount !== 1 ? "s" : ""}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span>Updated {timeAgo(featuredStory.lastUpdated)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white/70">{featuredStory.category}</span>
                </div>

                {/* Source names */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/40">
                  {featuredStory.sourceNames.slice(0, 4).map((name) => (
                    <span key={name} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">{name}</span>
                  ))}
                  {featuredStory.sourceNames.length > 4 && (
                    <span className="text-white/30">+{featuredStory.sourceNames.length - 4} more</span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href={`/story/${featuredStory.slug}`}
                    className="group inline-flex items-center gap-3 rounded bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    Read Full Intelligence
                    <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded border border-white/15 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10"
                  >
                    Search All Stories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/50 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-emerald-400" />
                  <span className="text-sm font-black uppercase tracking-[0.34em] text-emerald-300">
                    One Story. Every Perspective.
                  </span>
                </div>
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  Global intelligence. Multiple sources. Clear understanding.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                  We aggregate multiple sources to deliver unified intelligence briefings across world affairs, technology, sports, entertainment, science, and business.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/search" className="rounded bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-400">
                    Search Stories
                  </Link>
                  <Link href="/daily" className="rounded border border-white/15 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10">
                    Daily Briefing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Category Sections ── */}
      {CATEGORY_SECTIONS.map(({ slug, label, gradient }) => {
        const sectionStories = stories.filter((s) => s.category === slug).slice(0, 4);
        if (sectionStories.length === 0) return null;

        return (
          <section key={slug} className="border-b border-white/10">
            <div className={`mx-auto max-w-7xl px-4 py-12 sm:px-6`}>
              <div className={`rounded-xl bg-gradient-to-br ${gradient} p-px`}>
                <div className="rounded-xl bg-[#070a12] p-6 sm:p-8">
                  <div className="mb-8 flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black">{label}</h2>
                      <p className="mt-1 text-sm text-white/40">Latest developments in {label.toLowerCase()}</p>
                    </div>
                    <Link href={`/category/${slug}`} className="text-sm font-bold text-emerald-300 hover:text-white transition">
                      View all →
                    </Link>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {sectionStories.map((story) => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── More Stories + Sidebar ── */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/40">Latest Intelligence</p>
              <h2 className="mt-2 text-3xl font-black">
                {hasPersonalization ? "Your Global Briefing" : "More Stories"}
              </h2>
            </div>
            <Link href="/daily" className="text-sm font-bold text-emerald-300 hover:text-white transition">Full briefing →</Link>
          </div>

          {latestStories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-white/10 rounded bg-white/5">
              <p className="text-white/50 mb-4">No stories available right now.</p>
              <Link href="/blog" className="text-emerald-400 hover:underline">Browse all stories</Link>
            </div>
          )}

          {/* ── Category Quick Links ── */}
          <div className="mt-12 border-t border-white/10 pt-10">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/40 mb-5">Explore Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORY_SECTIONS.map(({ slug, label }) => {
                const count = stories.filter((s) => s.category === slug).length;
                if (count === 0) return null;
                return (
                  <Link key={slug} href={`/category/${slug}`} className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
                    <h4 className="font-bold text-white group-hover:text-emerald-200 transition-colors">{label}</h4>
                    <p className="mt-1 text-xs text-white/40">{count} stor{count !== 1 ? "ies" : "y"}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">
          <div className="rounded border border-emerald-300/20 bg-emerald-300/10 p-5">
            <h3 className="text-2xl font-black">Daily Intelligence</h3>
            <p className="mt-3 text-sm leading-6 text-white/58">A concise morning brief on power, money, technology, and global risk.</p>
            <div className="mt-5 mb-4">
              <Link href="/daily" className="block w-full text-center rounded bg-emerald-500 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-emerald-400 transition-colors">
                Read Today&apos;s Briefing
              </Link>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Quick Stats</h3>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Total stories</span>
                <span className="text-sm font-bold">{stories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Categories</span>
                <span className="text-sm font-bold">{new Set(stories.map((s) => s.category)).size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Sources</span>
                <span className="text-sm font-bold">{new Set(stories.flatMap((s) => s.sourceNames)).size}</span>
              </div>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Explore Interests</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/following" className="flex items-center justify-between rounded border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:border-emerald-300/40 hover:text-white group">
                Manage your topics
                <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
              <Link href="/search" className="flex items-center justify-between rounded border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:border-emerald-300/40 hover:text-white group">
                Search all stories
                <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

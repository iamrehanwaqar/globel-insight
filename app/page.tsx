import Link from "next/link";
import Image from "next/image";
import { StoryCard } from "@/components/story/story-card";
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

      {/* ── Hero Section ── */}
      <section className="relative border-b border-white/10">
        {featuredStory && featuredStory.heroImage ? (
          <div className="relative min-h-[520px] lg:min-h-[600px]">
            <Image
              src={featuredStory.heroImage}
              alt={featuredStory.headline}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/70 to-[#070a12]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070a12]/60 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                <div>
                  <p className="mb-5 text-sm font-black uppercase tracking-[0.34em] text-emerald-300">
                    Global Insight Intelligence
                  </p>
                  <h1 className="max-w-5xl text-4xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                    One story. Every perspective. Clear understanding.
                  </h1>
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
                    We aggregate multiple sources to deliver unified intelligence briefings across world affairs, technology, sports, entertainment, science, and business.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/search" className="rounded bg-emerald-500 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-400">
                      Search Stories
                    </Link>
                    <Link href="/following" className="flex items-center gap-2 rounded border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10">
                      <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      Your Interests
                    </Link>
                  </div>
                </div>

                <Link href={`/story/${featuredStory.slug}`} className="group rounded-xl border border-emerald-500/30 bg-black/40 backdrop-blur-xl p-6 shadow-2xl transition hover:border-emerald-400/60">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Top Story
                    </span>
                    <span className="text-xs text-white/40">{featuredStory.sourceCount} sources</span>
                  </div>
                  <div className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400/70">
                    {featuredStory.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight group-hover:text-emerald-300 transition-colors">
                    {featuredStory.headline}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/65 line-clamp-3">
                    {featuredStory.whatHappened}
                  </p>
                  <div className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-400 group-hover:text-emerald-300">
                    Read Intelligence Briefing →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-end">
              <div>
                <p className="mb-5 text-sm font-black uppercase tracking-[0.34em] text-emerald-300">Global Insight Intelligence</p>
                <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                  One story. Every perspective. Clear understanding.
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
                  We aggregate multiple sources to deliver unified intelligence briefings across world affairs, technology, sports, entertainment, science, and business.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/search" className="rounded bg-emerald-500 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-400">
                    Search Stories
                  </Link>
                  <Link href="/following" className="flex items-center gap-2 rounded border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10">
                    <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Your Interests
                  </Link>
                </div>
              </div>

              {featuredStory && (
                <Link href={`/story/${featuredStory.slug}`} className="group rounded border border-emerald-500/30 bg-emerald-950/40 p-6 backdrop-blur-xl transition hover:border-emerald-400/60 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Top Story
                    </span>
                    <span className="text-xs text-white/40">{featuredStory.sourceCount} sources</span>
                  </div>
                  <h2 className="mt-5 text-4xl font-black leading-tight group-hover:text-emerald-300 transition-colors">{featuredStory.headline}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/70 line-clamp-3">{featuredStory.whatHappened}</p>
                  <div className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-emerald-400 group-hover:text-emerald-300">Read Intelligence Briefing →</div>
                </Link>
              )}
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

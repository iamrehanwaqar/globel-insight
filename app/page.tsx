import Link from "next/link";
import Image from "next/image";
import { TrendingDashboard } from "@/components/analytics/trending-dashboard";
import { ArticleCard } from "@/components/news/article-card";
import { StoryCard } from "@/components/story/story-card";
import { getArticles, getCategories } from "@/lib/news";
import { getStories, getPersonalizedBriefing } from "@/lib/stories";
import { BreakingNewsTicker } from "@/components/story/breaking-news-ticker";
import { getServerPreferences } from "@/lib/preferences";

export default async function Home() {
  const articles = await getArticles();
  const stories = await getStories();
  const prefs = await getServerPreferences();

  const featuredStory = stories[0];
  const hasPersonalization = prefs.followedTopics.length > 0;

  const briefingStories = await getPersonalizedBriefing(prefs.followedTopics);

  const latestStories = briefingStories.filter(s => s.id !== featuredStory?.id).slice(0, 3);
  const secondaryStories = stories.slice(1, 4).filter(s => s.id !== featuredStory?.id).slice(0, 2);

  const latestArticles = articles.filter(a => !a.featured).slice(0, 3);
  const categories = getCategories(articles).slice(0, 6);

  return (
    <main className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative border-b border-white/10">
        <BreakingNewsTicker stories={stories} />

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
                    We aggregate multiple sources to deliver unified intelligence briefings. Track breaking events, understand what happened, and see where sources agree or differ.
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
                  We aggregate multiple sources to deliver unified intelligence briefings. Track breaking events, understand what happened, and see where sources agree or differ.
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

      {/* ── Main Content Grid ── */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          {/* ── Editor's Briefing / Top Stories ── */}
          <div className="mb-12">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                {hasPersonalization ? (
                  <>
                    <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Your Global Briefing
                  </>
                ) : (
                  "Editor&apos;s Briefing"
                )}
              </h2>
              <Link href="/daily" className="text-sm font-bold text-emerald-300 hover:text-white">Full briefing →</Link>
            </div>

            {secondaryStories.length > 0 && (
              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                {secondaryStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.slug}`} className="group relative block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-emerald-400/40">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {story.heroImage ? (
                        <Image
                          src={story.heroImage}
                          alt={story.headline}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#064e3b,#111827_40%,#1e3a5f)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <span className="mb-2 inline-block rounded bg-emerald-500/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {story.category}
                      </span>
                      <h3 className="text-lg font-black leading-snug text-white group-hover:text-emerald-200 transition-colors line-clamp-2">
                        {story.headline}
                      </h3>
                      <p className="mt-2 text-xs text-white/50 line-clamp-1">{story.whatHappened}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>

            {latestStories.length === 0 && (
              <div className="py-12 text-center border border-white/10 rounded bg-white/5">
                <p className="text-white/50 mb-4">No stories available right now.</p>
                <Link href="/blog" className="text-emerald-400 hover:underline">Browse all stories</Link>
              </div>
            )}
          </div>

          {/* ── Latest Original Reporting ── */}
          {latestArticles.length > 0 && (
            <div>
              <div className="mb-6 flex items-end justify-between gap-4 border-t border-white/10 pt-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/40">Source Material</p>
                  <h2 className="mt-2 text-3xl font-black">Latest Original Reporting</h2>
                </div>
                <Link href="/blog" className="text-sm font-bold text-emerald-300 hover:text-white">View all</Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {latestArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">
          <TrendingDashboard articles={articles} />

          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Explore Interests</h3>
            <div className="mt-4 grid gap-3">
              {categories.map((cat) => (
                <Link key={cat} href={`/search?category=${encodeURIComponent(cat)}`} className="flex items-center justify-between rounded border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:border-emerald-300/40 hover:text-white group">
                  {cat}
                  <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Follow →</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link href="/following" className="text-xs text-white/50 hover:text-white uppercase font-bold tracking-widest block text-center">Manage Your Topics</Link>
            </div>
          </div>

          <div className="rounded border border-emerald-300/20 bg-emerald-300/10 p-5">
            <h3 className="text-2xl font-black">Daily Intelligence</h3>
            <p className="mt-3 text-sm leading-6 text-white/58">A concise morning brief on power, money, technology, and global risk.</p>
            <div className="mt-5 mb-4">
              <Link href="/daily" className="block w-full text-center rounded bg-emerald-500 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-emerald-400 transition-colors">
                Read Today&apos;s Briefing
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

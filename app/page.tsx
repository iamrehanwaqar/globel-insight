import Link from "next/link";
import { TrendingDashboard } from "@/components/analytics/trending-dashboard";
import { ArticleCard } from "@/components/news/article-card";
import { AdSlot } from "@/components/news/ad-slot";
import { LocalPublishedArticles } from "@/components/news/local-published-articles";
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
  
  // Get personalized or just latest stories
  const briefingStories = await getPersonalizedBriefing(prefs.followedTopics);
  
  // Remove featured from list to prevent duplication
  const latestStories = briefingStories.filter(s => s.id !== featuredStory?.id).slice(0, 3);
  
  const latestArticles = articles.filter(a => !a.featured).slice(0, 3);
  const categories = getCategories(articles).slice(0, 6);

  return (
    <main className="overflow-hidden">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_28%),linear-gradient(135deg,#070a12,#111827_52%,#07111f)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-14">
          <BreakingNewsTicker stories={stories} />

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
                <Link href="/following" className="rounded border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10 flex items-center gap-2">
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
                  <span className="text-xs text-white/40">Compiled from {featuredStory.sourceCount} sources</span>
                </div>
                <h2 className="mt-5 text-4xl font-black leading-tight group-hover:text-emerald-300 transition-colors">{featuredStory.headline}</h2>
                <p className="mt-4 text-sm leading-7 text-white/70 line-clamp-3">{featuredStory.whatHappened}</p>
                <div className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-emerald-400 group-hover:text-emerald-300">Read Intelligence Briefing →</div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-10">
            <h2 className="mb-6 text-3xl font-black flex items-center gap-3">
              {hasPersonalization ? (
                <>
                  <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Your Global Briefing
                </>
              ) : (
                "Developing Stories"
              )}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latestStories.map(story => {
                const isPersonalized = prefs.followedTopics.some(t => t.toLowerCase() === story.category.toLowerCase());
                
                return (
                  <Link href={`/story/${story.slug}`} key={story.id} className="group flex flex-col justify-between rounded border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/10 hover:border-emerald-500/50 relative">
                    {hasPersonalization && isPersonalized && (
                      <div className="absolute top-0 right-0 rounded-bl-lg rounded-tr bg-emerald-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border-b border-l border-emerald-500/30">
                        Based on your interests
                      </div>
                    )}
                    <div>
                      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400 mt-2">{story.category}</div>
                      <h3 className="mb-3 text-xl font-bold group-hover:text-emerald-300 transition-colors">{story.headline}</h3>
                      <p className="text-sm text-white/60 line-clamp-2">{story.whatHappened}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/40">
                      <span>{story.sourceCount} Sources</span>
                      <span>•</span>
                      <span>Updated {new Date(story.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {latestStories.length === 0 && (
              <div className="py-12 text-center border border-white/10 rounded bg-white/5">
                <p className="text-white/50 mb-4">You haven't followed any topics yet, or there are no new stories.</p>
                <Link href="/following" className="text-emerald-400 hover:underline">Explore topics to follow</Link>
              </div>
            )}
          </div>

          <div className="mb-6 flex items-end justify-between gap-4 border-t border-white/10 pt-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/40">Source Material</p>
              <h2 className="mt-2 text-3xl font-black">Latest Original Reporting</h2>
            </div>
            <Link href="/blog" className="text-sm font-bold text-emerald-300 hover:text-white">View all articles</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
        <aside className="space-y-5">
          <AdSlot />
          <TrendingDashboard articles={articles} />
          
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Explore Interests</h3>
            <div className="mt-4 grid gap-3">
              {categories.map((category) => (
                <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="flex items-center justify-between rounded border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:border-emerald-300/40 hover:text-white group">
                  {category}
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
            <form className="mt-5 grid gap-3">
              <input type="email" placeholder="Email address" className="rounded border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-emerald-300" />
              <button className="rounded bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">Subscribe</button>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}


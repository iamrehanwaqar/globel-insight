import Link from "next/link";
import { TrendingDashboard } from "@/components/analytics/trending-dashboard";
import { ArticleCard } from "@/components/news/article-card";
import { AdSlot } from "@/components/news/ad-slot";
import { LocalPublishedArticles } from "@/components/news/local-published-articles";
import { getArticles, getCategories } from "@/lib/news";

export default async function Home() {
  const articles = await getArticles();
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const latest = articles.filter((article) => article._id !== featured?._id).slice(0, 6);
  const categories = getCategories(articles).slice(0, 6);

  return (
    <main className="overflow-hidden">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_28%),linear-gradient(135deg,#070a12,#111827_52%,#07111f)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-14">
          <div className="mb-8 overflow-hidden rounded border border-red-400/20 bg-red-500/10 py-3">
            <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-red-100">
              {["Breaking: AI governance summit opens", "Markets watch central bank signals", "Energy diplomacy reshapes trade routes", "Global sports calendar enters peak season"].concat(["Breaking: AI governance summit opens", "Markets watch central bank signals"]).map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-5 text-sm font-black uppercase tracking-[0.34em] text-emerald-300">Premium Global Affairs</p>
              <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                Signal-first journalism for a fast-moving world.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
                Global Insight blends newsroom urgency with calm analysis across politics, AI, markets, diplomacy, and culture.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/blog" className="rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-emerald-300">
                  Read latest
                </Link>
                <Link href="/about" className="rounded border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10">
                  Our newsroom
                </Link>
              </div>
            </div>

            {featured && (
              <Link href={`/blog/${featured.slug?.current}`} className="group rounded border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition hover:border-emerald-300/40">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Featured dispatch</div>
                <h2 className="mt-5 text-3xl font-black leading-tight group-hover:text-emerald-100">{featured.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/58">{featured.excerpt}</p>
                <div className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-white">Continue reading</div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <LocalPublishedArticles />
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/40">Trending now</p>
              <h2 className="mt-2 text-3xl font-black">Editor’s Briefing</h2>
            </div>
            <Link href="/blog" className="text-sm font-bold text-emerald-300 hover:text-white">View all</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
        <aside className="space-y-5">
          <AdSlot />
          <TrendingDashboard articles={articles} />
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Categories</h3>
            <div className="mt-4 grid gap-3">
              {categories.map((category) => (
                <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`} className="flex items-center justify-between rounded border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:border-emerald-300/40 hover:text-white">
                  {category}
                  <span>→</span>
                </Link>
              ))}
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

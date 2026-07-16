import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/news/article-card";
import { StoryCard } from "@/components/story/story-card";
import { getArticles, getCategories } from "@/lib/news";
import { getStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Latest Articles",
  description: "Read the latest Global Insight reporting, analysis, and current affairs briefings.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [articles, stories] = await Promise.all([getArticles(), getStories()]);
  const categories = getCategories(articles);

  const storyCategories = Array.from(new Set(stories.map((s) => s.category)));
  const allCategories = Array.from(new Set([...categories, ...storyCategories]));

  const page = Math.max(1, Number(params.page ?? 1));
  const perPage = 9;
  const query = (params.q ?? "").toLowerCase();
  const category = params.category ?? "";

  const filteredStories = stories.filter((story) => {
    const haystack = `${story.headline} ${story.whatHappened} ${story.category} ${story.sourceNames.join(" ")}`.toLowerCase();
    const inCategory = !category || story.category === category;
    return inCategory && (!query || haystack.includes(query));
  });

  const filteredArticles = articles.filter((article) => {
    const haystack = `${article.title} ${article.excerpt ?? ""} ${article.tags?.join(" ") ?? ""}`.toLowerCase();
    const inCategory = !category || article.category === category || article.categories?.includes(category);
    return inCategory && (!query || haystack.includes(query));
  });

  const allItems = [
    ...filteredStories.map((s) => ({ type: "story" as const, story: s, article: undefined })),
    ...filteredArticles.map((a) => ({ type: "article" as const, story: undefined, article: a })),
  ];

  const totalItems = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const visibleItems = allItems.slice((page - 1) * perPage, page * perPage);

  return (
    <main>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.15),transparent_28%),linear-gradient(135deg,#070a12,#111827_52%,#07111f)] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Newsroom archive</p>
          <h1 className="mt-4 text-5xl font-black tracking-normal sm:text-7xl">Latest Articles</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/55">
            Intelligence briefings, analysis, and reporting from multiple sources worldwide.
          </p>
          <form className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_140px]">
            <input name="q" defaultValue={params.q} placeholder="Search politics, AI, markets..." className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
            <select name="category" defaultValue={category} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300">
              <option value="">All categories</option>
              {allCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button className="rounded bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">
            {totalItems} {totalItems === 1 ? "story" : "stories"} found
          </div>

          {visibleItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item, index) =>
                item.type === "story" ? (
                  <StoryCard key={`story-${item.story.id}`} story={item.story} priority={index < 2} />
                ) : (
                  <ArticleCard key={`article-${item.article!._id}`} article={item.article!} priority={index < 2} />
                )
              )}
            </div>
          ) : (
            <div className="rounded border border-white/10 bg-white/[0.03] py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 text-lg font-bold text-white/50">No stories found</p>
              <p className="mt-2 text-sm text-white/35">Try a different search term or category</p>
              <Link href="/blog" className="mt-6 inline-block rounded bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400">
                View all stories
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-sm font-bold">
              <Link
                className={page <= 1 ? "pointer-events-none text-white/25" : "text-emerald-300"}
                href={`/blog?page=${page - 1}${category ? `&category=${category}` : ""}${query ? `&q=${query}` : ""}`}
              >
                Previous
              </Link>
              <span className="text-white/45">Page {page} of {totalPages}</span>
              <Link
                className={page >= totalPages ? "pointer-events-none text-white/25" : "text-emerald-300"}
                href={`/blog?page=${page + 1}${category ? `&category=${category}` : ""}${query ? `&q=${query}` : ""}`}
              >
                Next
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Categories</h2>
            <div className="mt-4 grid gap-2">
              <Link
                href="/blog"
                className={`rounded px-3 py-2 text-sm font-bold transition ${!category ? "bg-emerald-500/20 text-emerald-300" : "text-white/60 hover:bg-white/10"}`}
              >
                All Stories
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`rounded px-3 py-2 text-sm font-bold transition ${category === cat ? "bg-emerald-500/20 text-emerald-300" : "text-white/60 hover:bg-white/10"}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Source Outlets</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["BBC News", "The Guardian", "Al Jazeera", "NPR", "Reuters", "Global Insight"].map((name) => (
                <span key={name} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/50">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded border border-emerald-300/20 bg-emerald-300/10 p-5">
            <h3 className="text-lg font-black">Daily Intelligence</h3>
            <p className="mt-2 text-sm text-white/55">Get a concise morning brief on power, money, technology, and global risk.</p>
            <Link href="/daily" className="mt-4 block w-full rounded bg-emerald-500 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-emerald-400">
              Read Today&apos;s Briefing
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

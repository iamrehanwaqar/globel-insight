import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/news/article-card";
import { AdSlot } from "@/components/news/ad-slot";
import { LocalPublishedArticles } from "@/components/news/local-published-articles";
import { getArticles, getCategories } from "@/lib/news";

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
  const articles = await getArticles();
  const categories = getCategories(articles);
  const page = Math.max(1, Number(params.page ?? 1));
  const perPage = 9;
  const query = (params.q ?? "").toLowerCase();
  const category = params.category ?? "";

  const filtered = articles.filter((article) => {
    const haystack = `${article.title} ${article.excerpt ?? ""} ${article.tags?.join(" ") ?? ""}`.toLowerCase();
    const inCategory = !category || article.category === category || article.categories?.includes(category);
    return inCategory && (!query || haystack.includes(query));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <main>
      <section className="border-b border-white/10 bg-white/[0.03] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Newsroom archive</p>
          <h1 className="mt-4 text-5xl font-black tracking-normal sm:text-7xl">Latest Articles</h1>
          <form className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_140px]">
            <input name="q" defaultValue={params.q} placeholder="Search politics, AI, markets..." className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
            <select name="category" defaultValue={category} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300">
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button className="rounded bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <LocalPublishedArticles />
          <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">{filtered.length} stories found</div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((article, index) => (
              <ArticleCard key={article._id} article={article} priority={index < 2} />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-sm font-bold">
            <Link className={page <= 1 ? "pointer-events-none text-white/25" : "text-emerald-300"} href={`/blog?page=${page - 1}`}>Previous</Link>
            <span className="text-white/45">Page {page} of {totalPages}</span>
            <Link className={page >= totalPages ? "pointer-events-none text-white/25" : "text-emerald-300"} href={`/blog?page=${page + 1}`}>Next</Link>
          </div>
        </div>
        <aside className="space-y-5">
          <AdSlot label="Sidebar advertisement" />
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Popular tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from(new Set(articles.flatMap((article) => article.tags ?? []))).slice(0, 16).map((tag) => (
                <span key={tag} className="rounded border border-white/10 px-3 py-2 text-xs font-bold text-white/60">{tag}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

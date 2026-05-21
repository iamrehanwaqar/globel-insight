import { NewsArticle } from "@/lib/news";

export function TrendingDashboard({ articles }: { articles: NewsArticle[] }) {
  const categories = articles.reduce<Record<string, number>>((acc, article) => {
    const category = article.category ?? "Global";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(categories));

  return (
    <div className="rounded border border-white/10 bg-white/[0.045] p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Trending analytics</h3>
      <div className="mt-5 grid gap-4">
        {Object.entries(categories).slice(0, 6).map(([category, count]) => (
          <div key={category}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold">{category}</span>
              <span className="text-white/40">{count} stories</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-white/10">
              <div className="h-full rounded bg-emerald-300" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

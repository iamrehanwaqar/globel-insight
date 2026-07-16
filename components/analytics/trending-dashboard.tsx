import { Story } from "@/lib/stories";

export function TrendingDashboard({ stories }: { stories: Story[] }) {
  const categories = stories.reduce<Record<string, number>>((acc, story) => {
    const category = story.category || "General";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const max = Math.max(1, ...sorted.map(([, c]) => c));

  return (
    <div className="rounded border border-white/10 bg-white/[0.045] p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Trending analytics</h3>
      <div className="mt-5 grid gap-4">
        {sorted.map(([category, count]) => (
          <div key={category}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold">{category}</span>
              <span className="text-white/40">{count} stor{count !== 1 ? "ies" : "y"}</span>
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

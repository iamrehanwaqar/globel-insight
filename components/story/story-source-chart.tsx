import type { Story } from "@/lib/stories";

export function StorySourceChart({ story }: { story: Story }) {
  if (story.sourceCount < 2) return null;

  const sourceCounts = new Map<string, number>();
  for (const src of story.sources) {
    sourceCounts.set(src.sourceName, (sourceCounts.get(src.sourceName) || 0) + 1);
  }

  const sorted = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] || 1;

  const categoryCounts = new Map<string, number>();
  for (const src of story.sources) {
    categoryCounts.set(src.category, (categoryCounts.get(src.category) || 0) + 1);
  }
  const sortedCategories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxCatCount = sortedCategories[0]?.[1] || 1;

  return (
    <div className="rounded border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
        Source Distribution
      </h3>

      <div className="space-y-3">
        {sorted.map(([name, count]) => (
          <div key={name}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-white/60 truncate max-w-[180px]">{name}</span>
              <span className="text-white/40 font-mono">{count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-emerald-400/60 transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length > 1 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
            By Category
          </h4>
          <div className="flex gap-2">
            {sortedCategories.map(([cat, count]) => {
              const percentage = Math.round((count / maxCatCount) * 100);
              return (
                <div key={cat} className="flex-1">
                  <div className="text-[10px] text-white/40 mb-1 truncate">{cat}</div>
                  <div className="h-8 overflow-hidden rounded bg-white/5 relative">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 transition-all duration-500"
                      style={{ height: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/50">
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-3">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Total articles</span>
          <span className="font-bold text-white/50">{story.sourceCount}</span>
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Unique outlets</span>
          <span className="font-bold text-white/50">{story.sourceNames.length}</span>
        </div>
      </div>
    </div>
  );
}

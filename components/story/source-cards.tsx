import type { SourceArticle } from "@/lib/sources";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SourceCards({ sources }: { sources: SourceArticle[] }) {
  const grouped = new Map<string, SourceArticle[]>();
  for (const src of sources) {
    const arr = grouped.get(src.sourceName) || [];
    arr.push(src);
    grouped.set(src.sourceName, arr);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Source Coverage</h3>
        <p className="text-sm text-white/50 mt-1">
          {sources.length} original source{sources.length !== 1 ? "s" : ""} across{" "}
          {grouped.size} outlet{grouped.size !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-5 py-3">
          <div className="grid grid-cols-[1fr_140px_100px] gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
            <span>Source</span>
            <span className="hidden sm:block">Published</span>
            <span className="text-right">Link</span>
          </div>
        </div>

        {sources.map((src, idx) => (
          <div
            key={src.id}
            className={`border-b border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.03] ${
              idx === sources.length - 1 ? "border-b-0" : ""
            }`}
          >
            <div className="grid grid-cols-[1fr_140px_100px] gap-4 items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-400/80">
                    {src.sourceName}
                  </span>
                  {src.tags.length > 0 && (
                    <span className="text-[10px] text-white/30">
                      {src.tags[0]}
                    </span>
                  )}
                </div>
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/80 hover:text-emerald-300 transition-colors line-clamp-2"
                >
                  {src.title}
                </a>
                <p className="mt-1 text-xs text-white/40 line-clamp-1">
                  {src.description.slice(0, 120)}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeAgo(src.publishedAt)}
              </div>

              <div className="flex justify-end">
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded border border-white/10 px-3 py-1.5 text-xs font-bold text-white/60 transition hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  Read
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

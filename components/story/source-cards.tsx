import Image from "next/image";
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
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white">Source Coverage</h3>
        <p className="text-sm text-white/50 mt-1">
          {sources.length} original source{sources.length !== 1 ? "s" : ""} across{" "}
          {grouped.size} outlet{grouped.size !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-3">
        {sources.map((src) => (
          <a
            key={src.id}
            href={src.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06] hover:border-white/20"
          >
            {src.imageUrl ? (
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-white/5">
                <Image
                  src={src.imageUrl}
                  alt={src.title}
                  fill
                  sizes="112px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-gradient-to-br from-emerald-900/30 to-white/5 flex items-center justify-center">
                <span className="text-lg font-black text-white/10">
                  {src.sourceName.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-400/80">
                  {src.sourceName}
                </span>
                <span className="text-[10px] text-white/25">•</span>
                <span className="text-[10px] text-white/30">{timeAgo(src.publishedAt)}</span>
              </div>
              <h4 className="text-sm font-medium text-white/80 group-hover:text-emerald-300 transition-colors line-clamp-2">
                {src.title}
              </h4>
              <p className="mt-1 text-xs text-white/40 line-clamp-1">
                {src.description.slice(0, 120)}
              </p>
              {src.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {src.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center">
              <span className="inline-flex items-center gap-1 rounded border border-white/10 px-2.5 py-1.5 text-[10px] font-bold text-white/40 transition group-hover:border-emerald-400/30 group-hover:text-emerald-300">
                Read
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

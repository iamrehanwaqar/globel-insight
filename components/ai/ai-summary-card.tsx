import { NewsArticle } from "@/lib/news";

export function AiSummaryCard({ article }: { article: NewsArticle }) {
  const summary =
    article.excerpt ??
    "A concise Global Insight briefing with context, stakes, and likely next developments.";

  return (
    <div className="rounded border border-emerald-300/20 bg-emerald-300/10 p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">AI briefing</h3>
      <p className="mt-4 text-sm leading-7 text-white/66">{summary}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.14em] text-white/45">
        <span className="rounded border border-white/10 py-2">Summary</span>
        <span className="rounded border border-white/10 py-2">SEO</span>
        <span className="rounded border border-white/10 py-2">Related</span>
      </div>
    </div>
  );
}

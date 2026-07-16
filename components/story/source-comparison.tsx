import type { Story } from "@/lib/stories";

export function SourceComparison({ story }: { story: Story }) {
  return (
    <div className="my-10 space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white">Source Comparison</h3>
        <p className="text-sm text-white/50 mt-1">
          Based on {story.sourceCount} original sources covering this event.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-white/10 bg-white/5 p-5">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Consensus
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            {story.agreements.map((agreement, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-emerald-400/50">•</span>
                {agreement}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-white/10 bg-white/5 p-5">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Differing Angles
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            {story.disagreements.length > 0 ? (
              story.disagreements.map((disagreement, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-amber-400/50">•</span>
                  {disagreement}
                </li>
              ))
            ) : (
              <li className="text-white/40 italic">No significant disagreements found among the sources.</li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Original Coverage</h4>
        <div className="flex flex-wrap gap-3">
          {story.sources.map((source) => (
            <a
              key={source._id}
              href={`/blog/${source.slug?.current || source._id}`}
              className="flex items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
            >
              <div className="text-sm">
                <div className="font-medium text-white line-clamp-1 max-w-[250px]">{source.title}</div>
                <div className="mt-1 text-xs text-white/40">
                  {source.author?.name || "Global Insight"} • {new Date(source.publishedAt || source._createdAt || 0).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

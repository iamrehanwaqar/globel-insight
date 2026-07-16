import type { Story } from "@/lib/stories";

export function SourceComparison({ story }: { story: Story }) {
  return (
    <div className="my-10 space-y-8">
      <WhereSourcesAgree story={story} />
      <WhereCoverageDiffers story={story} />
    </div>
  );
}

function WhereSourcesAgree({ story }: { story: Story }) {
  if (story.agreements.length === 0) return null;

  return (
    <div className="rounded border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Where Sources Agree
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
  );
}

function WhereCoverageDiffers({ story }: { story: Story }) {
  if (story.differences.length === 0) {
    return (
      <div className="rounded border border-white/10 bg-white/5 p-5">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Where Coverage Differs
        </h4>
        <p className="text-sm text-white/40 italic">
          Source comparison will become available as additional coverage is collected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-amber-500/20 bg-amber-500/[0.05] p-5">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Where Coverage Differs
      </h4>
      <div className="space-y-4">
        {story.differences.map((diff, idx) => (
          <div key={idx}>
            <p className="mb-2 text-sm font-bold text-white/80">{diff.point}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {diff.perspectives.map((p, pi) => (
                <div key={pi} className="rounded border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-xs font-bold text-emerald-400/80">{p.source}</span>
                  <p className="mt-1 text-xs text-white/50 line-clamp-2">{p.angle}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

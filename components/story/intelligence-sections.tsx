import type { Story } from "@/lib/stories";

export function WhereSourcesAgree({ story }: { story: Story }) {
  if (story.agreements.length === 0) return null;

  return (
    <div className="rounded border border-emerald-500/20 bg-emerald-500/[0.05] p-6">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Where Sources Agree
      </h4>
      <ul className="space-y-3">
        {story.agreements.map((agreement, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-white/70">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>{agreement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhereCoverageDiffers({ story }: { story: Story }) {
  if (story.differences.length === 0) {
    return (
      <div className="rounded border border-white/10 bg-white/[0.03] p-6">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-400">
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
    <div className="rounded border border-amber-500/20 bg-amber-500/[0.05] p-6">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Where Coverage Differs
      </h4>
      <div className="space-y-5">
        {story.differences.map((diff, idx) => (
          <div key={idx}>
            <p className="mb-3 text-sm font-bold text-white/80">{diff.point}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {diff.perspectives.map((p, pi) => (
                <div
                  key={pi}
                  className="rounded border border-white/10 bg-white/[0.03] p-3"
                >
                  <span className="text-xs font-bold text-emerald-400/80">
                    {p.source}
                  </span>
                  <p className="mt-1 text-xs text-white/50 line-clamp-3">
                    {p.angle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhatChanged({ story }: { story: Story }) {
  if (!story.whatChanged) {
    return (
      <div className="rounded border border-white/10 bg-white/[0.03] p-6">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          What Changed
        </h4>
        <p className="text-sm text-white/40 italic">
          No recent updates to this story. Check back for new developments.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-blue-500/20 bg-blue-500/[0.05] p-6">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        What Changed
      </h4>
      <p className="text-sm text-white/70">{story.whatChanged}</p>
    </div>
  );
}

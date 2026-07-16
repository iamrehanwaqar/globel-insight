import type { Story } from "@/lib/stories";

const SOURCE_COLORS: Record<string, string> = {
  "BBC News": "bg-red-400",
  "BBC News Technology": "bg-red-400",
  "BBC News Business": "bg-red-400",
  "The Guardian World": "bg-blue-400",
  "The Guardian Technology": "bg-blue-400",
  "Al Jazeera": "bg-amber-400",
  "NPR News": "bg-purple-400",
  "Reuters Business": "bg-orange-400",
  "Global Insight": "bg-emerald-400",
};

function getSourceColor(sourceName: string): string {
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (sourceName.includes(key.split(" ")[0])) return color;
  }
  return "bg-emerald-400";
}

export function StoryTimeline({ story }: { story: Story }) {
  if (story.timeline.length <= 1) {
    return (
      <div>
        <h3 className="mb-4 text-xl font-bold text-white">Timeline</h3>
        <p className="text-sm text-white/40 italic">
          Timeline will be available as more coverage is collected.
        </p>
      </div>
    );
  }

  const uniqueSources = [...new Set(story.timeline.map((e) => e.sourceName))];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Timeline</h3>
        <div className="flex flex-wrap gap-3">
          {uniqueSources.map((src) => (
            <span key={src} className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className={`h-2 w-2 rounded-full ${getSourceColor(src)}`} />
              {src}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400/40 via-white/10 to-transparent" />

        <div className="space-y-0">
          {story.timeline.map((event, idx) => {
            const isLast = idx === story.timeline.length - 1;
            const colorClass = getSourceColor(event.sourceName);

            return (
              <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                <div className="relative z-10 flex shrink-0 items-start pt-1">
                  <span
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${colorClass} ring-4 ring-[#070a12]`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white/80" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-3">
                    <time className="text-xs font-bold uppercase tracking-wider text-white/40">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-[10px] text-white/25">
                      {new Date(event.date).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {event.sourceName}
                    </span>
                  </div>

                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/headline text-base font-medium text-white/90 hover:text-emerald-400 transition-colors leading-snug"
                  >
                    {event.headline}
                    <svg className="ml-1.5 inline h-3 w-3 opacity-0 transition group-hover/headline:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  {!isLast && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-white/20">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span>Developing</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

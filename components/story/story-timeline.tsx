import type { Story } from "@/lib/stories";

export function StoryTimeline({ story }: { story: Story }) {
  if (story.timeline.length <= 1) return null;

  return (
    <div className="my-10">
      <h3 className="mb-6 text-xl font-bold text-white">Timeline of Events</h3>
      <div className="relative border-l border-white/20 pl-6 ml-3 space-y-8">
        {story.timeline.map((event, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-4 ring-[#0A0F1A]" />
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/40">
              {new Date(event.date).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute:'2-digit' 
              })}
            </div>
            <a href={`/blog/${event.articleSlug}`} className="text-lg font-medium text-white hover:text-emerald-400 transition-colors">
              {event.headline}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

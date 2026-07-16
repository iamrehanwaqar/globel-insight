import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/lib/stories";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function StoryCard({
  story,
  featured = false,
  priority = false,
}: {
  story: Story;
  featured?: boolean;
  priority?: boolean;
}) {
  const href = `/story/${story.slug}`;

  if (featured) {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition duration-300 hover:border-emerald-400/40">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          {story.heroImage ? (
            <Image
              src={story.heroImage}
              alt={story.headline}
              fill
              priority={priority}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#064e3b,#111827_40%,#1e3a5f)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-emerald-900/0 transition group-hover:bg-emerald-900/10" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded bg-emerald-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {story.category}
            </span>
            <span className="text-xs text-white/50">{timeAgo(story.lastUpdated)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white group-hover:text-emerald-200 transition-colors">
            {story.headline}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-6 text-white/65 line-clamp-2 max-w-3xl">
            {story.whatHappened}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {story.sourceCount} source{story.sourceCount !== 1 ? "s" : ""}
            </span>
            <span>{story.sourceNames.slice(0, 3).join(", ")}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.06]">
      <div className="relative aspect-[16/10] overflow-hidden">
        {story.heroImage ? (
          <Image
            src={story.heroImage}
            alt={story.headline}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#064e3b,#111827_40%,#1e3a5f)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
          {story.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-black leading-snug text-white transition group-hover:text-emerald-200 line-clamp-2">
          {story.headline}
        </h3>
        <p className="mt-2 text-sm leading-5 text-white/55 line-clamp-2 flex-1">
          {story.whatHappened}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/35">
          <span>{story.sourceCount} source{story.sourceCount !== 1 ? "s" : ""}</span>
          <span>{timeAgo(story.lastUpdated)}</span>
        </div>
      </div>
    </Link>
  );
}

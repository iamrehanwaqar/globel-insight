import Image from "next/image";
import type { StoryMedia } from "@/lib/stories";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function StoryVideoEmbed({
  video,
  compact = false,
}: {
  video: StoryMedia;
  compact?: boolean;
}) {
  const ytId = extractYouTubeId(video.url);

  if (compact) {
    return (
      <div className="rounded border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          {ytId ? (
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded bg-black">
              <Image
                src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                alt={video.alt}
                fill
                sizes="112px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white/80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative h-16 w-28 shrink-0 rounded bg-white/5 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <a
              href={video.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/80 hover:text-emerald-300 transition-colors line-clamp-2"
            >
              {video.alt}
            </a>
            <p className="mt-1 text-[10px] text-white/30">
              {video.sourceName} • Video
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={video.alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            src={video.url}
            title={video.alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-white/40 line-clamp-1">{video.caption}</p>
        <a
          href={video.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-emerald-400/60 hover:text-emerald-300 shrink-0 ml-2"
        >
          Source
        </a>
      </div>
    </div>
  );
}

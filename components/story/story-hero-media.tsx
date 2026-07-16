import Image from "next/image";
import type { Story } from "@/lib/stories";

export function StoryHeroMedia({ story }: { story: Story }) {
  const images = story.media.filter((m) => m.type === "image");
  const videos = story.media.filter((m) => m.type === "video");

  if (images.length === 0 && videos.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-6">
      {story.heroImage ? (
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          <Image
            src={story.heroImage}
            alt={story.heroImageCaption || story.headline}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {story.heroImageCaption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="text-xs text-white/70">
                {story.heroImageCaption}
              </p>
            </div>
          )}
        </div>
      ) : null}

      {videos.length > 0 && !story.heroImage && (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
          <iframe
            src={videos[0].url}
            title={videos[0].alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
          {videos[0].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-xs text-white/70">{videos[0].caption}</p>
            </div>
          )}
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] overflow-hidden rounded border border-white/10 bg-white/[0.03]"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <p className="text-[10px] text-white/70 line-clamp-1">
                  {img.sourceName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

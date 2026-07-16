import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStory, getStories } from "@/lib/stories";
import type { Story } from "@/lib/stories";
import { StoryHeader } from "@/components/story/story-header";
import { StoryHeroMedia } from "@/components/story/story-hero-media";
import { AiSummaryModes } from "@/components/story/ai-summary-modes";
import { StoryTimeline } from "@/components/story/story-timeline";
import { SourceCards } from "@/components/story/source-cards";
import { StoryVideoEmbed } from "@/components/story/story-video-embed";
import { StorySourceChart } from "@/components/story/story-source-chart";
import { WhereSourcesAgree, WhereCoverageDiffers, WhatChanged } from "@/components/story/intelligence-sections";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story not found" };
  return {
    title: `${story.headline} | Global Insight`,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
      type: "article",
      images: story.heroImage ? [{ url: story.heroImage, alt: story.headline }] : undefined,
    },
  };
}

function StorySidebar({ story }: { story: Story }) {
  return (
    <aside className="space-y-6 lg:mt-8">
      <StorySourceChart story={story} />

      <div className="rounded border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
          Source Transparency
        </h3>
        <div className="space-y-3 text-xs text-white/50">
          <div className="flex justify-between">
            <span>Total Sources</span>
            <span className="font-bold text-white/70">{story.sourceCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Source Outlets</span>
            <span className="font-bold text-white/70">{story.sourceNames.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Category</span>
            <span className="font-bold text-white/70">{story.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Created</span>
            <span className="font-bold text-white/70">
              {new Date(story.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated</span>
            <span className="font-bold text-white/70">
              {new Date(story.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          {story.media.length > 0 && (
            <div className="flex justify-between">
              <span>Media Items</span>
              <span className="font-bold text-white/70">{story.media.length}</span>
            </div>
          )}
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/60 mb-2">
            Data Classification
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-white/40">Reported Facts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-[10px] text-white/40">AI-Generated Summary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-white/40">Analysis</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
          Source Outlets
        </h3>
        <div className="flex flex-wrap gap-2">
          {story.sourceNames.map((name) => (
            <span key={name} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
          Related Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/search?category=${encodeURIComponent(story.category)}`}
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 transition-colors"
          >
            {story.category}
          </Link>
        </div>
      </div>
    </aside>
  );
}

function StoryContent({ story }: { story: Story }) {
  const videos = story.media.filter((m) => m.type === "video");
  const images = story.media.filter((m) => m.type === "image");

  return (
    <main className="min-h-screen pb-20">
      <article>
        <StoryHeader story={story} />
        <StoryHeroMedia story={story} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <section>
                <AiSummaryModes story={story} />
              </section>

              <section>
                <WhatChanged story={story} />
              </section>

              {videos.length > 0 && story.heroImage && (
                <section>
                  <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Related Video Coverage
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {videos.slice(0, 2).map((vid, idx) => (
                      <StoryVideoEmbed key={idx} video={vid} />
                    ))}
                  </div>
                </section>
              )}

              {!story.heroImage && videos.length > 0 && (
                <section>
                  <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Video Coverage
                  </h3>
                  <StoryVideoEmbed video={videos[0]} />
                  {videos.length > 1 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {videos.slice(1, 3).map((vid, idx) => (
                        <StoryVideoEmbed key={idx} video={vid} compact />
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section>
                <StoryTimeline story={story} />
              </section>

              {images.length > (story.heroImage ? 1 : 0) && (
                <section>
                  <h3 className="mb-4 text-lg font-bold text-white">Source Imagery</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images
                      .filter((img) => img.url !== story.heroImage)
                      .slice(0, 6)
                      .map((img, idx) => (
                        <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded border border-white/10 bg-white/[0.03]">
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            unoptimized
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 transition group-hover:opacity-100">
                            <p className="text-[10px] text-white/70 line-clamp-1">
                              {img.sourceName}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              <section>
                <SourceCards sources={story.sources} />
              </section>

              <section>
                <WhereSourcesAgree story={story} />
              </section>

              <section>
                <WhereCoverageDiffers story={story} />
              </section>
            </div>

            <StorySidebar story={story} />
          </div>
        </div>
      </article>
    </main>
  );
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);

  if (story) return <StoryContent story={story} />;

  const allStories = await getStories();
  const fallbackStory = allStories.find(
    (s) => s.slug.includes(slug) || s.id.includes(slug)
  );

  if (!fallbackStory) notFound();

  return <StoryContent story={fallbackStory} />;
}

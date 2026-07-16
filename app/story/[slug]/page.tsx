import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStory, getStories } from "@/lib/stories";
import { StoryHeader } from "@/components/story/story-header";
import { AiSummaryModes } from "@/components/story/ai-summary-modes";
import { StoryTimeline } from "@/components/story/story-timeline";
import { SourceCards } from "@/components/story/source-cards";
import { WhereSourcesAgree, WhereCoverageDiffers, WhatChanged } from "@/components/story/intelligence-sections";
import Link from "next/link";

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
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);

  if (story) {
    return (
      <main className="min-h-screen pb-20">
        <article>
          <StoryHeader story={story} />

          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
              <div className="space-y-12">
                <section className="mt-8">
                  <AiSummaryModes story={story} />
                </section>

                <section>
                  <WhatChanged story={story} />
                </section>

                <StoryTimeline story={story} />

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

              <aside className="space-y-8 lg:mt-8">
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
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full text-[10px] text-white/40">·</span>
                        <span className="text-[10px] text-white/40">Potential Impact</span>
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
            </div>
          </div>
        </article>
      </main>
    );
  }

  const allStories = await getStories();
  const fallbackStory = allStories.find((s) => s.slug.includes(slug) || s.id.includes(slug));

  if (!fallbackStory) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20">
      <article>
        <StoryHeader story={fallbackStory} />

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="space-y-12">
              <section className="mt-8">
                <AiSummaryModes story={fallbackStory} />
              </section>

              <section>
                <WhatChanged story={fallbackStory} />
              </section>

              <StoryTimeline story={fallbackStory} />

              <section>
                <SourceCards sources={fallbackStory.sources} />
              </section>

              <section>
                <WhereSourcesAgree story={fallbackStory} />
              </section>

              <section>
                <WhereCoverageDiffers story={fallbackStory} />
              </section>
            </div>

            <aside className="space-y-8 lg:mt-8">
              <div className="rounded border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
                  Source Transparency
                </h3>
                <div className="space-y-3 text-xs text-white/50">
                  <div className="flex justify-between">
                    <span>Total Sources</span>
                    <span className="font-bold text-white/70">{fallbackStory.sourceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Source Outlets</span>
                    <span className="font-bold text-white/70">{fallbackStory.sourceNames.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-bold text-white/70">{fallbackStory.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-bold text-white/70">
                      {new Date(fallbackStory.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-bold text-white/70">
                      {new Date(fallbackStory.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
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
                  {fallbackStory.sourceNames.map((name) => (
                    <span key={name} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}

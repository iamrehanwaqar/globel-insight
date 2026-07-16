import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStory } from "@/lib/stories";
import { StoryHeader } from "@/components/story/story-header";
import { AiSummaryModes } from "@/components/story/ai-summary-modes";
import { StoryTimeline } from "@/components/story/story-timeline";
import { SourceComparison } from "@/components/story/source-comparison";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story not found" };
  
  return {
    title: `${story.headline} | Global Insight`,
    description: story.whatHappened,
    openGraph: {
      title: story.headline,
      description: story.whatHappened,
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);
  
  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20">
      <article>
        <StoryHeader story={story} />

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {/* Main Content Area */}
            <div className="space-y-12">
              <section className="mt-8">
                <AiSummaryModes story={story} />
              </section>

              <StoryTimeline story={story} />

              <SourceComparison story={story} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-8 lg:mt-8">
              <div className="rounded border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/40">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  <a href={`/search?category=${encodeURIComponent(story.category)}`} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 transition-colors">
                    {story.category}
                  </a>
                  {/* Additional tags could go here */}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStories } from "@/lib/stories";
import { StoryCard } from "@/components/story/story-card";

export const dynamic = "force-dynamic";

const ALL_CATEGORIES = [
  "World", "Technology", "AI", "Business", "Politics", "Science",
  "Health", "Climate", "Sports", "Entertainment", "Movies", "TV",
  "Anime", "Music", "Culture", "Space", "Conflict",
];

const CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
  World:         { title: "World News",             description: "Global developments from every continent.",                icon: "\uD83C\uDF0D" },
  Technology:    { title: "Technology",              description: "The latest in tech, software, and digital innovation.",  icon: "\uD83D\uDCBB" },
  AI:            { title: "Artificial Intelligence", description: "AI breakthroughs, applications, and the race to AGI.",    icon: "\uD83E\uDD16" },
  Business:      { title: "Business & Finance",      description: "Markets, earnings, and the global economy.",             icon: "\uD83D\uDCC8" },
  Politics:      { title: "Politics",                description: "Elections, policy, and global diplomacy.",              icon: "\uD83C\uDFDB\uFE0F" },
  Science:       { title: "Science",                 description: "Breakthroughs in research and discovery.",              icon: "\uD83D\uDD2C" },
  Health:        { title: "Health & Medicine",       description: "Medical research, public health, and wellness.",        icon: "\uD83D\uDC8A" },
  Climate:       { title: "Climate & Environment",   description: "Climate change, sustainability, and environmental policy.", icon: "\uD83C\uDF3F" },
  Sports:        { title: "Sports",                  description: "Scores, transfers, and the world of competitive sport.", icon: "\u26BD" },
  Entertainment: { title: "Entertainment",           description: "Movies, series, music, and pop culture.",               icon: "\uD83C\uDFAC" },
  Movies:        { title: "Movies & Cinema",         description: "Film releases, box office, and cinematic news.",        icon: "\uD83C\uDF7F" },
  TV:            { title: "TV & Streaming",          description: "Series, streaming platforms, and television news.",     icon: "\uD83D\uDCFA" },
  Anime:         { title: "Anime & Manga",           description: "Anime releases, manga, and studio news.",              icon: "\uD83D\uDCA4" },
  Music:         { title: "Music",                   description: "Albums, tours, charts, and music industry news.",       icon: "\uD83C\uDFB5" },
  Culture:       { title: "Culture & Trends",        description: "Viral moments, digital culture, and social trends.",   icon: "\uD83D\uDD25" },
  Space:         { title: "Space & Exploration",     description: "Missions, discoveries, and the final frontier.",        icon: "\uD83D\uDE80" },
  Conflict:      { title: "Conflict & Security",     description: "Geopolitical tensions and security developments.",      icon: "\u2622\uFE0F" },
};

const CATEGORY_COLORS: Record<string, string> = {
  World:         "from-blue-500 to-cyan-500",
  Technology:    "from-violet-500 to-indigo-500",
  AI:            "from-purple-500 to-pink-500",
  Business:      "from-emerald-500 to-teal-500",
  Politics:      "from-red-500 to-orange-500",
  Science:       "from-cyan-500 to-blue-500",
  Health:        "from-pink-500 to-rose-500",
  Climate:       "from-green-500 to-emerald-500",
  Sports:        "from-orange-500 to-amber-500",
  Entertainment: "from-fuchsia-500 to-purple-500",
  Movies:        "from-rose-500 to-red-500",
  TV:            "from-indigo-500 to-violet-500",
  Anime:         "from-pink-500 to-fuchsia-500",
  Music:         "from-amber-500 to-yellow-500",
  Culture:       "from-teal-500 to-cyan-500",
  Space:         "from-slate-400 to-blue-500",
  Conflict:      "from-red-600 to-red-400",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) return { title: "Category" };
  return {
    title: `${meta.title} | Global Insight`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) notFound();

  const stories = await getStories();
  const categoryStories = stories.filter((s) => s.category === slug);
  const relatedStories = categoryStories.length > 0 ? categoryStories : stories.filter(
    (s) => s.sources.some((src) => src.tags?.some((t) => t.toLowerCase() === slug.toLowerCase()))
  );

  const gradientColor = CATEGORY_COLORS[slug] || "from-emerald-500 to-teal-500";
  const featured = relatedStories[0];
  const rest = relatedStories.slice(1);

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradientColor}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">{meta.title}</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">{meta.description}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-white/60">
            <span>{relatedStories.length} stor{relatedStories.length !== 1 ? "ies" : "y"}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>Updated {relatedStories.length > 0 ? new Date(relatedStories[0].lastUpdated).toLocaleDateString() : "recently"}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {relatedStories.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-12 text-center">
            <span className="text-4xl block mb-4">{meta.icon}</span>
            <h2 className="text-xl font-bold">No stories in {meta.title} yet</h2>
            <p className="mt-2 text-white/50">New stories appear here as coverage arrives from our sources.</p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-12">
                <StoryCard story={featured} featured priority />
              </div>
            )}

            {rest.length > 0 && (
              <>
                <h2 className="mb-8 text-sm font-black uppercase tracking-[0.22em] text-white/40">
                  More {meta.title}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}

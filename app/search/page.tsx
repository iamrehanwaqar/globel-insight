import { searchStories } from "@/lib/stories";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SearchPage(props: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const categoryFilter = searchParams?.category || "";
  
  const stories = await searchStories(query);
  
  const filteredStories = categoryFilter 
    ? stories.filter(s => s.category.toLowerCase() === categoryFilter.toLowerCase())
    : stories;

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-5xl">
      <h1 className="text-4xl font-black text-white mb-8">Search Intelligence</h1>
      
      <form method="GET" action="/search" className="mb-12 flex gap-4">
        <input 
          type="text" 
          name="q" 
          defaultValue={query} 
          placeholder="Search topics, regions, people..." 
          className="flex-1 rounded border border-white/20 bg-white/5 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <button type="submit" className="rounded bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600 transition-colors">
          Search
        </button>
      </form>

      {query && (
        <p className="mb-8 text-sm text-white/50">
          Found {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} for "{query}"
        </p>
      )}

      <div className="grid gap-6">
        {filteredStories.map(story => (
          <Link href={`/story/${story.slug}`} key={story.id} className="block group">
            <div className="rounded border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-emerald-500/50">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {story.category}
                </span>
                <span className="text-xs text-white/40">
                  {new Date(story.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {story.headline}
              </h2>
              <p className="text-white/70 line-clamp-2">
                {story.whatHappened}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Compiled from {story.sourceCount} sources
              </div>
            </div>
          </Link>
        ))}
        {filteredStories.length === 0 && (
          <div className="py-12 text-center text-white/40">
            No stories found matching your criteria. Try different keywords.
          </div>
        )}
      </div>
    </main>
  );
}

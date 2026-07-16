import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntityData } from "@/lib/stories";
import { FollowButton } from "@/components/user/follow-button";

export const dynamic = 'force-dynamic';

export default async function EntityPage(props: { params: Promise<{ type: string; slug: string }> }) {
  const params = await props.params;
  const { type, slug } = params;
  
  const entity = await getEntityData(type, slug);
  
  if (!entity) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-5xl">
      <header className="mb-12 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Entity Profile: {entity.type}
              </span>
            </div>
            <h1 className="text-5xl font-black text-white">{entity.name}</h1>
          </div>
          <div>
            <FollowButton topic={entity.name} />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-10">
        <div className="space-y-12">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-4 border-l-2 border-white/20 pl-3">
              Intelligence Overview
            </h2>
            <p className="text-lg text-white/80 leading-relaxed bg-white/5 border border-white/10 rounded p-6">
              {entity.overview}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 border-l-2 border-emerald-400 pl-3">
              Latest Developments
            </h2>
            
            {entity.relatedStories.length === 0 ? (
              <p className="text-white/40 italic">No recent developments tracked for this entity.</p>
            ) : (
              <div className="grid gap-6">
                {entity.relatedStories.map(story => (
                  <Link href={`/story/${story.slug}`} key={story.id} className="group flex flex-col md:flex-row gap-6 rounded border border-white/10 bg-white/[0.045] p-5 hover:border-emerald-500/50 transition-colors">
                    <div className="flex-1">
                      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400/70">{story.category}</div>
                      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{story.headline}</h3>
                      <p className="text-sm text-white/60 line-clamp-2">{story.whatHappened}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                        <span>{story.sourceCount} Sources</span>
                        <span>•</span>
                        <span>Updated {new Date(story.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          <div className="rounded border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4">
              Related Entities
            </h3>
            <ul className="space-y-3">
              {/* Mock related entities based on the type */}
              {entity.type === 'topic' && (
                <>
                  <li><Link href="/entity/topic/technology" className="text-sm text-emerald-400 hover:text-emerald-300">Technology</Link></li>
                  <li><Link href="/entity/topic/economy" className="text-sm text-emerald-400 hover:text-emerald-300">Global Economy</Link></li>
                </>
              )}
              {entity.type === 'company' && (
                <>
                  <li><Link href="/entity/topic/artificial-intelligence" className="text-sm text-emerald-400 hover:text-emerald-300">Artificial Intelligence</Link></li>
                  <li><Link href="/entity/company/microsoft" className="text-sm text-emerald-400 hover:text-emerald-300">Microsoft</Link></li>
                </>
              )}
              {!['topic', 'company'].includes(entity.type) && (
                <li className="text-sm text-white/40 italic">More entity relations analyzing...</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

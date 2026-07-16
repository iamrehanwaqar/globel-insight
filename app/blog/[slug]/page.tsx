import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { AiSummaryCard } from "@/components/ai/ai-summary-card";
import { AdSlot } from "@/components/news/ad-slot";
import { ArticleCard } from "@/components/news/article-card";
import { UserActions } from "@/components/user/user-actions";
import { formatDate, getArticle, getArticleDate, getArticles, readingTime } from "@/lib/news";
import { urlFor } from "@/lib/sanity";

type Props = { params: Promise<{ slug: string }> };
type PortableBlockProps = {
  children?: ReactNode;
  value?: { _key?: string };
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  World:         "from-blue-600 via-cyan-700 to-slate-900",
  Technology:    "from-violet-600 via-indigo-700 to-slate-900",
  AI:            "from-purple-600 via-fuchsia-700 to-slate-900",
  Business:      "from-emerald-600 via-teal-700 to-slate-900",
  Politics:      "from-red-600 via-orange-700 to-slate-900",
  Science:       "from-cyan-600 via-blue-700 to-slate-900",
  Health:        "from-pink-600 via-rose-700 to-slate-900",
  Climate:       "from-green-600 via-emerald-700 to-slate-900",
  Sports:        "from-orange-600 via-amber-700 to-slate-900",
  Entertainment: "from-fuchsia-600 via-purple-700 to-slate-900",
  Economy:       "from-emerald-600 via-green-700 to-slate-900",
  Global:        "from-emerald-600 via-teal-700 to-slate-900",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticle(slug);
  if (!post) return { title: "Article not found" };
  const title = post.seoTitle || post.title || "Global Insight article";
  const description = post.seoDescription || post.excerpt || "Global Insight news and analysis.";
  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: getArticleDate(post),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function resolveDetailImage(post: { imageUrl?: string | null; mainImage?: unknown; category?: string }) {
  if (post.imageUrl && post.imageUrl.startsWith("http")) return post.imageUrl;
  if (post.mainImage) {
    try {
      const url = urlFor(post.mainImage).width(1400).height(780).url();
      if (url && url.startsWith("http")) return url;
    } catch {}
  }
  return null;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getArticle(slug);
  if (!post) notFound();

  const allArticles = await getArticles();
  const related = allArticles.filter((article) => article._id !== post._id && article.category === post.category).slice(0, 3);
  const title = post.title || "Global Insight article";
  const category = post.category || "Global";
  const image = resolveDetailImage(post);
  const hasBody = Array.isArray(post.body) && post.body.length > 0;

  const headings = hasBody
    ? post.body!.filter((block) => block._type === "block" && ["h2", "h3"].includes(block.style ?? "")).map((block) => ({
        id: block._key,
        text: block.children?.map((child: { text?: string }) => child.text).join("") ?? "",
      }))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: post.excerpt || "Global Insight news and analysis.",
    datePublished: getArticleDate(post),
    author: { "@type": "Person", name: post.author?.name ?? "Global Insight" },
    publisher: { "@type": "Organization", name: "Global Insight" },
  };

  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.Global;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="border-b border-white/10">
        <header className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <Link href={`/blog?category=${encodeURIComponent(category)}`} className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            {category}
          </Link>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-6xl">{title}</h1>
          {post.excerpt && <p className="mt-6 max-w-3xl text-xl leading-8 text-white/60">{post.excerpt}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/45">
            <span>{post.author?.name ?? "Global Insight Desk"}</span>
            <span>{formatDate(getArticleDate(post))}</span>
            <span>{readingTime(post.body, post.excerpt)} min read</span>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative aspect-[16/8] overflow-hidden rounded border border-white/10 bg-white/[0.04]">
            {image ? (
              <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-15">
                  <svg className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_minmax(0,760px)_260px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <h2 className="text-xs font-black uppercase tracking-[0.24em] text-white/35">In this story</h2>
              <div className="mt-4 grid gap-3 text-sm text-white/55">
                {headings.length ? headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="hover:text-white">{heading.text}</a>) : <span>Analysis and context</span>}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 flex flex-wrap gap-3">
              {["X", "LinkedIn", "Email"].map((item) => (
                <button key={item} className="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/60 hover:bg-white/10 hover:text-white">
                  Share {item}
                </button>
              ))}
            </div>
            <div className="mb-8">
              <UserActions articleSlug={slug} articleTitle={title} />
            </div>

            {/* Full article body */}
            <div className="prose-news text-lg leading-9 text-white/72">
              {hasBody ? (
                <PortableText
                  value={post.body!}
                  components={{
                    block: {
                      h2: ({ children, value }: PortableBlockProps) => <h2 id={value?._key} className="text-3xl">{children}</h2>,
                      h3: ({ children, value }: PortableBlockProps) => <h3 id={value?._key} className="text-2xl">{children}</h3>,
                    },
                  }}
                />
              ) : (
                <div>
                  {post.excerpt && (
                    <div className="space-y-6">
                      <p className="text-xl leading-9 text-white/80">{post.excerpt}</p>
                      <div className="border-t border-white/10 pt-8">
                        <p className="text-sm text-white/40">
                          This is a summary of the article. The full content is available from the original source.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Source link for articles without full body */}
            {!hasBody && (
              <div className="mt-10 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="text-lg font-black text-white">Read the full article</h3>
                <p className="mt-2 text-sm text-white/55">
                  The complete article is available from the original source. Click below to read the full story.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className="rounded bg-emerald-500 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white hover:bg-emerald-400 transition"
                  >
                    Browse more articles
                  </Link>
                  <Link
                    href="/search"
                    className="rounded border border-white/15 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white/70 hover:bg-white/10 transition"
                  >
                    Search all stories
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <AdSlot label="Article advertisement" />
            <AiSummaryCard article={post} />
            <div className="rounded border border-white/10 bg-white/[0.045] p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Tags</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(post.tags ?? []).map((tag) => <span key={tag} className="rounded border border-white/10 px-3 py-2 text-xs text-white/60">{tag}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 text-3xl font-black">Related Articles</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((article) => <ArticleCard key={article._id} article={article} />)}
          </div>
        </section>
      )}
    </main>
  );
}

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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getArticle(slug);
  if (!post) notFound();

  const allArticles = await getArticles();
  const related = allArticles.filter((article) => article._id !== post._id && article.category === post.category).slice(0, 3);
  const title = post.title || "Global Insight article";
  const image = post.imageUrl ?? (post.mainImage ? urlFor(post.mainImage).width(1400).height(780).url() : null);
  const headings = post.body?.filter((block) => block._type === "block" && ["h2", "h3"].includes(block.style ?? "")).map((block) => ({
    id: block._key,
    text: block.children?.map((child: { text?: string }) => child.text).join("") ?? "",
  })) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: post.excerpt || "Global Insight news and analysis.",
    datePublished: getArticleDate(post),
    author: { "@type": "Person", name: post.author?.name ?? "Global Insight" },
    publisher: { "@type": "Organization", name: "Global Insight" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="border-b border-white/10">
        <header className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <Link href={`/blog?category=${encodeURIComponent(post.category ?? "Global")}`} className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            {post.category ?? "Global"}
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
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f766e,#111827_48%,#1d4ed8)]" />
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
            <div className="prose-news text-lg leading-9 text-white/72">
              {post.body?.length ? (
                <PortableText
                  value={post.body}
                  components={{
                    block: {
                      h2: ({ children, value }: PortableBlockProps) => <h2 id={value?._key} className="text-3xl">{children}</h2>,
                      h3: ({ children, value }: PortableBlockProps) => <h3 id={value?._key} className="text-2xl">{children}</h3>,
                    },
                  }}
                />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </div>
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

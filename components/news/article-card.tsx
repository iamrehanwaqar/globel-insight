import Image from "next/image";
import Link from "next/link";
import { NewsArticle, formatDate, getArticleDate, readingTime } from "@/lib/news";
import { urlFor } from "@/lib/sanity";

export function ArticleCard({ article, priority = false }: { article: NewsArticle; priority?: boolean }) {
  const slug = article.slug?.current;
  const href = slug ? `/blog/${slug}` : "/blog";
  const title = article.title || "Untitled story";
  const image = article.imageUrl ?? (article.mainImage ? urlFor(article.mainImage).width(900).height(560).url() : null);

  return (
    <article className="group overflow-hidden rounded border border-white/10 bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.07]">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          {image ? (
            <Image src={image} alt={title} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1d4ed8,#111827_48%,#059669)]" />
          )}
          <span className="absolute left-4 top-4 rounded bg-black/75 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            {article.category ?? "Global"}
          </span>
        </div>
        <div className="p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
            {formatDate(getArticleDate(article))} · {readingTime(article.body, article.excerpt)} min read
          </div>
          <h3 className="text-xl font-black leading-tight text-white transition group-hover:text-emerald-200">{title}</h3>
          {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{article.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}

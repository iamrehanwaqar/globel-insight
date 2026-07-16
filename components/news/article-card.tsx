"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NewsArticle, formatDate, getArticleDate, readingTime } from "@/lib/news";
import { urlFor } from "@/lib/sanity";

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
  Movies:        "from-rose-600 via-red-700 to-slate-900",
  TV:            "from-indigo-600 via-violet-700 to-slate-900",
  Anime:         "from-pink-600 via-fuchsia-700 to-slate-900",
  Music:         "from-amber-600 via-yellow-700 to-slate-900",
  Culture:       "from-teal-600 via-cyan-700 to-slate-900",
  Economy:       "from-emerald-600 via-green-700 to-slate-900",
  Global:        "from-emerald-600 via-teal-700 to-slate-900",
};

function resolveImageUrl(article: NewsArticle): string | null {
  if (article.imageUrl && article.imageUrl.startsWith("http")) {
    return article.imageUrl;
  }
  if (article.mainImage) {
    try {
      const url = urlFor(article.mainImage).width(900).height(560).url();
      if (url && url.startsWith("http")) return url;
    } catch {
      // urlFor failed
    }
  }
  return null;
}

function ImageWithFallback({
  src,
  alt,
  priority,
  category,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  category: string;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.Global;

  return (
    <>
      {state === "loading" && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`} />
      )}
      {state === "error" && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover transition-all duration-500 group-hover:scale-105 ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </>
  );
}

export function ArticleCard({ article, priority = false }: { article: NewsArticle; priority?: boolean }) {
  const slug = article.slug?.current;
  const href = slug ? `/blog/${slug}` : "/blog";
  const title = article.title || "Untitled story";
  const category = article.category || "Global";
  const image = resolveImageUrl(article);

  return (
    <article className="group overflow-hidden rounded border border-white/10 bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.07]">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          {image ? (
            <ImageWithFallback src={image} alt={title} priority={priority} category={category} />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.Global}`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-15">
                <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded bg-black/75 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            {category}
          </span>
        </div>
        <div className="p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
            {formatDate(getArticleDate(article))} · {readingTime(article.body, article.excerpt)} min read
          </div>
          <h3 className="text-xl font-black leading-tight text-white transition group-hover:text-emerald-200">{title}</h3>
          {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{article.excerpt}</p>}
          {article.author?.name && (
            <div className="mt-3 text-xs text-white/35">By {article.author.name}</div>
          )}
        </div>
      </Link>
    </article>
  );
}

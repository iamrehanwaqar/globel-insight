"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type LocalPost = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  thumbnail: string;
  markdown: string;
  status: "draft" | "published" | "archived";
  scheduledAt: string;
  updatedAt: string;
};

const storageKey = "global_insight_editorial_posts";

function renderMarkdown(markdown?: string) {
  return (markdown || "").split("\n").map((line, index) => {
    if (line.startsWith("### ")) return <h3 key={index} className="mt-8 text-2xl font-black">{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={index} className="mt-10 text-3xl font-black">{line.slice(3)}</h2>;
    if (line.startsWith("> ")) return <blockquote key={index} className="my-6 border-l-2 border-emerald-300 pl-4 text-white/70">{line.slice(2)}</blockquote>;
    if (line.startsWith("- ")) return <li key={index} className="ml-5 list-disc text-white/70">{line.slice(2)}</li>;
    if (line.startsWith("```")) return <pre key={index} className="my-5 overflow-x-auto rounded bg-black/45 p-4 text-sm text-emerald-100">Code block</pre>;
    if (!line.trim()) return <br key={index} />;
    return <p key={index} className="mb-5 text-white/72">{line}</p>;
  });
}

export default function LocalArticlePage() {
  const params = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<LocalPost | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const posts = JSON.parse(localStorage.getItem(storageKey) || "[]") as LocalPost[];
      const found = posts.find((item) => item.slug === params.slug && item.status === "published") ?? null;
      setPost(found);
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (!mounted) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="h-96 animate-pulse rounded border border-white/10 bg-white/[0.05]" /></main>;
  }

  if (!post) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 py-20 text-center">
        <div>
          <h1 className="text-5xl font-black">Article not available</h1>
          <p className="mt-4 text-white/55">This article is unpublished, scheduled, deleted, or not saved in this browser.</p>
          <Link href="/blog" className="mt-8 inline-block rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">Back to blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">{post.category || "Global"}</p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">{post.title || "Untitled story"}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-white/60">{post.excerpt}</p>
        <div className="mt-8 text-sm text-white/40">Global Insight Desk</div>
        <div className="mt-10 aspect-[16/8] overflow-hidden rounded border border-white/10 bg-white/[0.04]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title || "Article image"}
              width={1400}
              height={780}
              unoptimized={post.thumbnail.startsWith("data:")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full bg-[linear-gradient(135deg,#0f766e,#111827_48%,#1d4ed8)]" />
          )}
        </div>
        <div className="prose-news mt-12 text-lg leading-9">{renderMarkdown(post.markdown || post.excerpt)}</div>
      </article>
    </main>
  );
}

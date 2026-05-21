"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type LocalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  thumbnail: string;
  markdown: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  scheduledAt: string;
  updatedAt: string;
};

const storageKey = "global_insight_editorial_posts";

export function LocalPublishedArticles() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<LocalPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const allPosts = JSON.parse(localStorage.getItem(storageKey) || "[]") as LocalPost[];
      const now = Date.now();
      setPosts(
        allPosts.filter((post) => {
          if (post.status !== "published") return false;
          if (!post.scheduledAt) return true;
          return new Date(post.scheduledAt).getTime() <= now;
        }),
      );
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted || posts.length === 0) return null;

  return (
    <section className="mb-10 rounded border border-emerald-300/20 bg-emerald-300/10 p-5">
      <h2 className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">Published from admin</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/local/${post.slug}`} className="group overflow-hidden rounded border border-white/10 bg-black/20 transition hover:-translate-y-1 hover:border-emerald-300/40">
            <div className="relative aspect-[16/10] bg-white/5">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title || "Published article"}
                  fill
                  unoptimized={post.thumbnail.startsWith("data:")}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-[linear-gradient(135deg,#0f766e,#111827_48%,#1d4ed8)]" />
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">{post.category || "Global"}</p>
              <h3 className="mt-3 text-xl font-black group-hover:text-emerald-100">{post.title || "Untitled story"}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{post.excerpt || "Published article"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

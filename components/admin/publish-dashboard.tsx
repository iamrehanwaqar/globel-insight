"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type PostStatus = "draft" | "published" | "archived";

type EditorialPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  markdown: string;
  status: PostStatus;
  featured: boolean;
  scheduledAt: string;
  updatedAt: string;
};

const storageKey = "global_insight_editorial_posts";

const emptyPost: EditorialPost = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  category: "World",
  tags: "",
  thumbnail: "",
  seoTitle: "",
  seoDescription: "",
  markdown: "",
  status: "draft",
  featured: false,
  scheduledAt: "",
  updatedAt: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function renderMarkdown(markdown: string) {
  return markdown.split("\n").map((line, index) => {
    if (line.startsWith("### ")) return <h3 key={index} className="mt-6 text-2xl font-black">{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={index} className="mt-8 text-3xl font-black">{line.slice(3)}</h2>;
    if (line.startsWith("> ")) return <blockquote key={index} className="my-5 border-l-2 border-emerald-300 pl-4 text-white/70">{line.slice(2)}</blockquote>;
    if (line.startsWith("- ")) return <li key={index} className="ml-5 list-disc text-white/70">{line.slice(2)}</li>;
    if (line.startsWith("```")) return <pre key={index} className="my-4 overflow-x-auto rounded bg-black/45 p-4 text-sm text-emerald-100">Code block</pre>;
    if (!line.trim()) return <br key={index} />;
    return <p key={index} className="mb-4 text-white/68">{line}</p>;
  });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PublishDashboard() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [post, setPost] = useState<EditorialPost>(emptyPost);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? (JSON.parse(saved) as EditorialPost[]) : [];
      setPosts(parsed);
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timeout = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(posts));
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [mounted, posts]);

  const aiSuggestions = useMemo(() => {
    const seed = `${post.title} ${post.category}`.trim() || "Global Insight";
    return {
      headline: seed.length > 12 ? `${post.title}: What It Means Now` : "Inside the Shift Reshaping Global Power",
      category: post.category || "World",
      seo: post.excerpt || "Clear, concise global analysis from Global Insight.",
      summary: post.markdown ? post.markdown.replace(/[#>`-]/g, "").slice(0, 180) : "Add article copy to generate a concise reader summary.",
    };
  }, [post]);

  function updatePost(next: Partial<EditorialPost>) {
    setPost((current) => {
      const merged = { ...current, ...next, updatedAt: new Date().toISOString() };
      if (next.title !== undefined && !current.slug) merged.slug = slugify(next.title);
      return merged;
    });
  }

  function save(status: PostStatus = post.status) {
    const id = post.id || crypto.randomUUID();
    const nextPost = {
      ...post,
      id,
      slug: post.slug || slugify(post.title),
      status,
      updatedAt: new Date().toISOString(),
    };
    setPosts((current) => [nextPost, ...current.filter((item) => item.id !== id)]);
    setPost(nextPost);
    setActiveId(id);
  }

  function edit(item: EditorialPost) {
    setPost(item);
    setActiveId(item.id);
  }

  function remove(id: string) {
    setPosts((current) => current.filter((item) => item.id !== id));
    if (activeId === id) {
      setPost(emptyPost);
      setActiveId("");
    }
  }

  async function handleImageFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await fileToDataUrl(file);
    updatePost({ thumbnail: dataUrl });
  }

  if (!mounted) {
    return <div className="h-96 animate-pulse rounded border border-white/10 bg-white/[0.05]" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded border border-white/10 bg-white/[0.045] p-4">
        <button onClick={() => { setPost(emptyPost); setActiveId(""); }} className="mb-4 w-full rounded bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">
          New story
        </button>
        <div className="grid gap-3">
          {posts.length === 0 && <p className="rounded border border-dashed border-white/15 p-4 text-sm text-white/45">No local drafts yet. Create your first article.</p>}
          {posts.map((item) => (
            <button key={item.id} onClick={() => edit(item)} className={`rounded border p-4 text-left transition ${activeId === item.id ? "border-emerald-300/50 bg-emerald-300/10" : "border-white/10 bg-black/15 hover:bg-white/[0.06]"}`}>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">{item.status}</span>
              <strong className="mt-2 block leading-tight">{item.title || "Untitled story"}</strong>
              <span className="mt-2 block text-xs text-white/40">{item.category}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="grid gap-6">
        <div className="grid gap-4 rounded border border-white/10 bg-white/[0.045] p-5 md:grid-cols-2">
          <input value={post.title} onChange={(event) => updatePost({ title: event.target.value })} placeholder="Article headline" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300 md:col-span-2" />
          <input value={post.slug} onChange={(event) => updatePost({ slug: slugify(event.target.value) })} placeholder="seo-friendly-slug" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <input value={post.category} onChange={(event) => updatePost({ category: event.target.value })} placeholder="Category" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <input value={post.tags} onChange={(event) => updatePost({ tags: event.target.value })} placeholder="Tags: AI, Markets, Policy" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <input value={post.thumbnail} onChange={(event) => updatePost({ thumbnail: event.target.value })} placeholder="Thumbnail URL" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void handleImageFile(event.dataTransfer.files[0]);
            }}
            className="grid min-h-32 cursor-pointer place-items-center rounded border border-dashed border-white/15 bg-black/20 px-4 py-5 text-center text-sm text-white/55 transition hover:border-emerald-300/50 md:col-span-2"
          >
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => void handleImageFile(event.target.files?.[0])} />
            <span>{post.thumbnail ? "Replace featured image" : "Upload or drag featured image"}</span>
            {post.thumbnail && (
              <Image
                src={post.thumbnail}
                alt="Uploaded article preview"
                width={640}
                height={360}
                unoptimized={post.thumbnail.startsWith("data:")}
                className="mt-4 max-h-48 rounded object-cover"
              />
            )}
          </label>
          <textarea value={post.excerpt} onChange={(event) => updatePost({ excerpt: event.target.value })} placeholder="Short excerpt / AI summary" rows={3} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300 md:col-span-2" />
          <input value={post.seoTitle} onChange={(event) => updatePost({ seoTitle: event.target.value })} placeholder="SEO meta title" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <input value={post.seoDescription} onChange={(event) => updatePost({ seoDescription: event.target.value })} placeholder="SEO meta description" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <input type="datetime-local" value={post.scheduledAt} onChange={(event) => updatePost({ scheduledAt: event.target.value })} className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
          <label className="flex items-center gap-3 rounded border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
            <input type="checkbox" checked={post.featured} onChange={(event) => updatePost({ featured: event.target.checked })} />
            Featured article
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <div className="mb-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/50">
              <span>Markdown</span><span>Headings</span><span>Lists</span><span>Quotes</span><span>Code</span>
            </div>
            <textarea value={post.markdown} onChange={(event) => updatePost({ markdown: event.target.value })} placeholder={"## Lead analysis\nWrite your article here...\n\n> Pull quote\n\n- Key point"} rows={22} className="min-h-[520px] w-full resize-y rounded border border-white/10 bg-black/25 px-4 py-3 font-mono text-sm leading-7 outline-none focus:border-emerald-300" />
          </div>
          <div className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-white/45">Live preview</h2>
            <article className="rounded border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">{post.category}</p>
              <h1 className="mt-3 text-3xl font-black leading-tight">{post.title || "Untitled story"}</h1>
              <p className="mt-3 text-white/55">{post.excerpt || aiSuggestions.summary}</p>
              <div className="mt-6 text-base leading-8">{renderMarkdown(post.markdown)}</div>
            </article>
          </div>
        </div>

        <div className="grid gap-4 rounded border border-emerald-300/20 bg-emerald-300/10 p-5 lg:grid-cols-4">
          <div><span className="text-xs uppercase tracking-[0.18em] text-white/45">AI headline</span><p className="mt-2 font-bold">{aiSuggestions.headline}</p></div>
          <div><span className="text-xs uppercase tracking-[0.18em] text-white/45">AI category</span><p className="mt-2 font-bold">{aiSuggestions.category}</p></div>
          <div><span className="text-xs uppercase tracking-[0.18em] text-white/45">AI SEO</span><p className="mt-2 font-bold">{aiSuggestions.seo}</p></div>
          <div><span className="text-xs uppercase tracking-[0.18em] text-white/45">AI summary</span><p className="mt-2 font-bold">{aiSuggestions.summary}</p></div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => save("draft")} className="rounded border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/80 hover:bg-white/10">Save draft</button>
          <button onClick={() => save("published")} className="rounded bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">Publish</button>
          <button onClick={() => save("archived")} className="rounded border border-emerald-300/30 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-emerald-200 hover:bg-emerald-300/10">Archive</button>
          {activeId && <button onClick={() => remove(activeId)} className="rounded border border-red-400/30 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-red-200 hover:bg-red-400/10">Delete</button>}
        </div>
      </section>
    </div>
  );
}

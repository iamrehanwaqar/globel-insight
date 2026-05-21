"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const profileKey = "global_insight_profile";
const bookmarksKey = "global_insight_bookmarks";
const likesKey = "global_insight_likes";
const historyKey = "global_insight_history";

export function UserActions({ articleSlug, articleTitle }: { articleSlug: string; articleTitle: string }) {
  const [mounted, setMounted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const bookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || "[]") as string[];
      const likes = JSON.parse(localStorage.getItem(likesKey) || "[]") as string[];
      const history = JSON.parse(localStorage.getItem(historyKey) || "[]") as { slug: string; title: string; readAt: string }[];
      const nextHistory = [{ slug: articleSlug, title: articleTitle, readAt: new Date().toISOString() }, ...history.filter((item) => item.slug !== articleSlug)].slice(0, 20);

      localStorage.setItem(historyKey, JSON.stringify(nextHistory));
      setBookmarked(bookmarks.includes(articleSlug));
      setLiked(likes.includes(articleSlug));
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, [articleSlug, articleTitle]);

  function toggleStored(key: string, value: string, setter: (next: boolean) => void) {
    const values = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const exists = values.includes(value);
    const nextValues = exists ? values.filter((item) => item !== value) : [...values, value];
    localStorage.setItem(key, JSON.stringify(nextValues));
    setter(!exists);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => toggleStored(bookmarksKey, articleSlug, setBookmarked)} className="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/60 hover:bg-white/10 hover:text-white">
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
      <button onClick={() => toggleStored(likesKey, articleSlug, setLiked)} className="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/60 hover:bg-white/10 hover:text-white">
        {liked ? "Liked" : "Like"}
      </button>
      <button onClick={() => navigator.share?.({ title: articleTitle, url: location.href })} className="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/60 hover:bg-white/10 hover:text-white">
        Share
      </button>
    </div>
  );
}

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const saved = localStorage.getItem(profileKey);
      if (saved) setName(JSON.parse(saved).name ?? "");
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return null;

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid admin email or password.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  }

  return (
    <div className="rounded border border-white/10 bg-white/[0.045] p-5">
      <h2 className="text-2xl font-black">Account Login</h2>
      <p className="mt-2 text-sm leading-6 text-white/55">Admins sign in with protected credentials. Readers can still use a local profile for bookmarks and history.</p>
      {status === "authenticated" && (
        <div className="mt-5 rounded border border-emerald-300/20 bg-emerald-300/10 p-4">
          <p className="font-bold">{session.user?.name ?? session.user?.email}</p>
          <p className="mt-1 text-sm text-white/55">Role: {session.user?.role ?? "user"}</p>
          <button onClick={() => void signOut({ callbackUrl: "/" })} className="mt-4 rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/70">
            Sign out
          </button>
        </div>
      )}
      <form className="mt-5 grid gap-3" onSubmit={handleAdminLogin}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Admin email"
          autoComplete="email"
          className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300"
        />
        <div className="flex overflow-hidden rounded border border-white/10 bg-black/25 focus-within:border-emerald-300">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="border-l border-white/10 px-4 text-xs font-black uppercase tracking-[0.14em] text-white/55 hover:bg-white/10 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="rounded border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <button disabled={loading} className="rounded bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing in..." : "Admin sign in"}
        </button>
      </form>
      <form
        className="mt-5 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem(profileKey, JSON.stringify({ name: name || "Global Reader", provider: "local" }));
        }}
      >
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="rounded border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emerald-300" />
        <button className="rounded border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/70">Continue as reader</button>
      </form>
    </div>
  );
}

export function ProfileDashboard() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<{ name?: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [history, setHistory] = useState<{ slug: string; title: string; readAt: string }[]>([]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setProfile(JSON.parse(localStorage.getItem(profileKey) || "null"));
      setBookmarks(JSON.parse(localStorage.getItem(bookmarksKey) || "[]"));
      setLikes(JSON.parse(localStorage.getItem(likesKey) || "[]"));
      setHistory(JSON.parse(localStorage.getItem(historyKey) || "[]"));
      setMounted(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return <div className="h-64 animate-pulse rounded border border-white/10 bg-white/[0.05]" />;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded border border-white/10 bg-white/[0.045] p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">Profile</p>
        <h2 className="mt-3 text-3xl font-black">{profile?.name ?? "Guest Reader"}</h2>
        <p className="mt-3 text-sm text-white/55">Connect real Google OAuth with Auth.js or your provider of choice when credentials are available.</p>
      </div>
      <Metric title="Bookmarks" value={bookmarks.length} />
      <Metric title="Liked articles" value={likes.length} />
      <div className="rounded border border-white/10 bg-white/[0.045] p-5 lg:col-span-3">
        <h2 className="text-sm font-black uppercase tracking-[0.22em] text-white/45">Reading history</h2>
        <div className="mt-4 grid gap-3">
          {history.length === 0 ? <p className="text-white/45">No reading history yet.</p> : history.map((item) => (
            <div key={item.slug} className="rounded border border-white/10 p-4">
              <strong>{item.title}</strong>
              <span className="ml-3 text-xs text-white/35">{new Date(item.readAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-white/[0.045] p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-white/40">{title}</p>
      <p className="mt-3 text-5xl font-black">{value}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/user/user-preferences-provider";
import type { Story } from "@/lib/stories";

export default function SavedStoriesPage() {
  const { savedStorySlugs, toggleSavedStory } = usePreferences();
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might have an API endpoint to fetch stories by slug.
    // For this client-side demo, we'll fetch search to get all stories and filter them.
    fetch('/search?q=') // Hacky way to trigger a server fetch, but we really need an API route.
      // Wait, we don't have an API route yet. Let's just create a quick server action or API route.
      // Actually, we can fetch all stories if we had an API.
      // For now, let's just make this a Server Component?
      // No, it uses usePreferences which is client-side.
      // To keep it simple, we will fetch the data via a temporary workaround, or just leave it empty until the API is built.
      // Since we need it working, let's create an API route next.
      .then(res => res.text())
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 mx-auto max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Saved Stories</h1>
        <p className="text-white/60 text-lg">Your personal intelligence archive.</p>
      </div>

      {savedStorySlugs.length === 0 ? (
        <div className="py-20 text-center border border-white/10 rounded-lg bg-white/5">
          <svg className="mx-auto h-12 w-12 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No saved stories</h3>
          <p className="text-white/50 mb-6">Stories you save will appear here for easy reference.</p>
          <Link href="/search" className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-colors">
            Explore Stories
          </Link>
        </div>
      ) : (
        <div className="py-12 text-center text-white/60">
          <p>You have {savedStorySlugs.length} saved stories.</p>
          <p className="text-xs mt-2 text-white/40">Note: In a full production environment, we will add an API route to hydrate this list. Slugs saved: {savedStorySlugs.join(", ")}</p>
        </div>
      )}
    </main>
  );
}

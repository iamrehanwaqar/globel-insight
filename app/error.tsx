"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-red-300">Runtime recovered</p>
        <h1 className="mt-4 text-5xl font-black">Something interrupted the briefing.</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/55">The page hit an unexpected error. Try again and the app will re-render this route.</p>
        <button onClick={reset} className="mt-8 rounded bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-emerald-300">
          Try again
        </button>
      </div>
    </main>
  );
}

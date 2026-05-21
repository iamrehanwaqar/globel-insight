import type { Metadata } from "next";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Careers</p>
      <h1 className="mt-4 text-5xl font-black sm:text-7xl">Build the future newsroom.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-white/58">
        Global Insight is designed for editors, analysts, engineers, and visual storytellers who care about trustworthy journalism and elegant reader experiences.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {["Editorial Analyst", "Audience Growth Lead", "Product Engineer"].map((role) => (
          <article key={role} className="rounded border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-2xl font-black">{role}</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">Remote-friendly role focused on premium global news products.</p>
            <button className="mt-5 rounded border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white/70">Apply soon</button>
          </article>
        ))}
      </div>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Editorial notice</p>
      <h1 className="mt-4 text-5xl font-black">Disclaimer</h1>
      <div className="prose-news mt-8 text-lg leading-9 text-white/70">
        <p>Global Insight publishes news, commentary, and analysis for general information. It should not be treated as legal, financial, medical, or investment advice.</p>
        <p>External links, advertisements, and third-party services may be governed by separate policies outside our control.</p>
      </div>
    </main>
  );
}

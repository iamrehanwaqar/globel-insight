import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Legal</p>
      <h1 className="mt-4 text-5xl font-black">Terms and Conditions</h1>
      <div className="prose-news mt-8 text-lg leading-9 text-white/70">
        <p>By using Global Insight, you agree to access our reporting for lawful, personal, and informational purposes.</p>
        <p>Content is protected by copyright and may not be republished, scraped, or redistributed without written permission.</p>
        <p>We may update these terms as our products, advertising partners, and publishing operations evolve.</p>
      </div>
    </main>
  );
}

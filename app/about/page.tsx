import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-sm font-black uppercase tracking-[0.34em] text-emerald-400 mb-6">
          Our Methodology
        </h1>
        <h2 className="text-5xl md:text-6xl font-black mb-12 leading-tight">
          One story. Every perspective.<br />Clear understanding.
        </h2>

        <div className="space-y-8 text-white/70 text-xl leading-relaxed">
          <p className="text-2xl text-white font-medium">
            Global Insight is not just another digital news website. We are an AI-powered global intelligence platform built to help you understand the world's most important stories.
          </p>

          <p>
            In a fast-moving world saturated with fragmented coverage, reading dozens of articles to understand a single event is inefficient. Global Insight brings together multiple sources to deliver unified intelligence briefings.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12 py-8 border-y border-white/10">
            <div>
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">What We Do</h3>
              <ul className="space-y-4 text-base">
                <li><strong className="text-white">Detect & Cluster:</strong> We identify when multiple sources are reporting on the same event.</li>
                <li><strong className="text-white">Extract Facts:</strong> We highlight the verified facts confirmed across coverage.</li>
                <li><strong className="text-white">Compare Sources:</strong> We show you exactly where sources agree and where their framing differs.</li>
                <li><strong className="text-white">Track Changes:</strong> We maintain a live timeline as stories develop.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">Our Promise</h3>
              <p className="text-base">
                We never present AI interpretation as confirmed fact. Our AI summaries are strictly generated from verified source material, and we always provide full transparency by linking directly to original reporting.
              </p>
            </div>
          </div>

          <p>
            Whether you need a 30-second summary or a deep dive into why a story matters to global markets, technology, or geopolitics, Global Insight adapts to your intelligence needs.
          </p>
          
          <div className="pt-8">
            <Link href="/" className="inline-flex items-center justify-center rounded bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-400">
              Read Today's Briefing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
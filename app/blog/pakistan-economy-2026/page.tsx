import Image from "next/image";

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <span className="text-blue-400 font-semibold text-lg">
          Economy
        </span>

        <h1 className="text-5xl font-bold mt-4 mb-6 leading-tight">
          Pakistan Economic Reforms 2026
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Published on May 2026 • Global Insight
        </p>

        <Image
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
          alt="Economy"
          width={1200}
          height={675}
          className="w-full h-[450px] object-cover rounded-3xl mb-12"
        />

        <article className="space-y-8 text-gray-300 text-lg leading-9">
          <p>
            Pakistan has announced major economic reforms aimed at
            stabilizing inflation, improving foreign investment,
            and strengthening the national currency.
          </p>

          <p>
            Government officials revealed plans for taxation reforms,
            industrial development, and technology-focused investment
            strategies to improve long-term economic growth.
          </p>

          <p>
            International financial analysts believe these reforms
            could significantly improve investor confidence and
            strengthen regional economic partnerships.
          </p>

          <p>
            Experts also highlighted the importance of digital
            transformation and artificial intelligence in shaping
            Pakistan’s economic future.
          </p>
        </article>
      </div>
    </main>
  );
}

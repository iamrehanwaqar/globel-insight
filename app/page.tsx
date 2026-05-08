
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">

          <Link href="/" className="text-3xl font-bold tracking-wide hover:text-gray-300 transition">
            Global Insight
          </Link>

          <ul className="hidden md:flex gap-8 text-gray-300 font-medium">

            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/privacy-policy" className="hover:text-white transition">
                Privacy
              </Link>
            </li>

          </ul>
        </div>
      </nav>


      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-black to-[#111827] py-32 px-6 border-b border-gray-800">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]"></div>

        <div className="relative max-w-6xl mx-auto text-center">

          <span className="inline-block bg-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-pulse">
            LIVE GLOBAL NEWS COVERAGE
          </span>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8 tracking-tight">
            Breaking News &
            <span className="block text-gray-300">
              Global Current Affairs
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-9">
            Global Insight delivers trusted reporting on politics,
            artificial intelligence, world economy, technology,
            international conflicts, and emerging global trends.
          </p>

          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">

            <Link
              href="/blog"
              className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition shadow-2xl"
            >
              Read Latest Articles
            </Link>

            <Link
              href="/about"
              className="border border-gray-700 px-10 py-5 rounded-2xl text-lg hover:bg-[#1e293b] transition"
            >
              Learn More
            </Link>

          </div>
        </div>
      </section>


      {/* BREAKING NEWS BAR */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="bg-red-600 rounded-3xl p-6 shadow-2xl border border-red-500">
          <h2 className="text-2xl md:text-3xl font-bold leading-10">
            🔴 Breaking: Global Leaders Discuss AI Regulations,
            Cybersecurity Threats & Economic Stability During Emergency Summit
          </h2>
        </div>

      </section>


      {/* FEATURED STORIES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="flex justify-between items-center mb-14">
          <h2 className="text-5xl font-bold">
            Featured Stories
          </h2>

          <Link href="/blog" className="text-gray-400 hover:text-white transition">
            View All Articles →
          </Link>
        </div>


        <div className="grid lg:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <article className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300 hover:-translate-y-1 shadow-xl">

            <img
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
              alt="Economy"
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">
                Economy
              </span>

              <h3 className="text-3xl font-bold mt-4 mb-5 leading-tight">
                Pakistan Economic Reforms 2026
              </h3>

              <p className="text-gray-400 leading-8 mb-8">
                New economic reforms aim to stabilize inflation,
                attract foreign investment, and strengthen the
                country's financial future.
              </p>

              <Link
                href="/blog"
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Read Article
              </Link>

            </div>
          </article>


          {/* CARD 2 */}
          <article className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300 hover:-translate-y-1 shadow-xl">

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Artificial Intelligence"
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">
                Artificial Intelligence
              </span>

              <h3 className="text-3xl font-bold mt-4 mb-5 leading-tight">
                AI Revolution Around The World
              </h3>

              <p className="text-gray-400 leading-8 mb-8">
                AI is transforming healthcare, education,
                cybersecurity, and global industries faster
                than ever before.
              </p>

              <Link
                href="/blog"
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Read Article
              </Link>

            </div>
          </article>


          {/* CARD 3 */}
          <article className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300 hover:-translate-y-1 shadow-xl">

            <img
              src="https://images.unsplash.com/photo-1547347298-4074fc3086f0"
              alt="Sports"
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <span className="text-green-400 text-sm font-bold uppercase tracking-wider">
                Sports
              </span>

              <h3 className="text-3xl font-bold mt-4 mb-5 leading-tight">
                International Sports Headlines
              </h3>

              <p className="text-gray-400 leading-8 mb-8">
                Football, cricket, Olympics, and global sports
                tournaments continue dominating worldwide headlines.
              </p>

              <Link
                href="/blog"
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Read Article
              </Link>

            </div>
          </article>

        </div>
      </section>


      {/* CATEGORIES */}
      <section className="bg-[#111827] py-24 border-y border-gray-800">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-5xl font-bold text-center mb-16">
            Explore Categories
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            <div className="bg-[#1e293b] p-10 rounded-3xl border border-gray-700 text-center hover:border-gray-500 transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold mb-4">Politics</h3>
              <p className="text-gray-400">Government, diplomacy, elections & policies</p>
            </div>

            <div className="bg-[#1e293b] p-10 rounded-3xl border border-gray-700 text-center hover:border-gray-500 transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold mb-4">Technology</h3>
              <p className="text-gray-400">AI, innovation, startups & digital future</p>
            </div>

            <div className="bg-[#1e293b] p-10 rounded-3xl border border-gray-700 text-center hover:border-gray-500 transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold mb-4">Economy</h3>
              <p className="text-gray-400">Finance, markets, trade & investments</p>
            </div>

            <div className="bg-[#1e293b] p-10 rounded-3xl border border-gray-700 text-center hover:border-gray-500 transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold mb-4">Sports</h3>
              <p className="text-gray-400">International matches & tournaments</p>
            </div>

          </div>
        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="bg-black py-24 px-6 border-b border-gray-800">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Subscribe For Daily Updates
          </h2>

          <p className="text-gray-400 text-xl leading-9 mb-12">
            Receive breaking news, global analysis,
            AI developments, and major current affairs
            directly in your inbox.
          </p>

          <div className="flex flex-col md:flex-row gap-5 justify-center">

            <input
              type="email"
              placeholder="Enter your email"
              className="bg-[#1e293b] border border-gray-700 rounded-2xl px-6 py-5 w-full md:w-[450px] outline-none focus:border-gray-500"
            />

            <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold hover:bg-gray-200 transition">
              Subscribe
            </button>

          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-14">

          <div>
            <h3 className="text-3xl font-bold mb-6">
              Global Insight
            </h3>

            <p className="text-gray-400 leading-9 text-lg">
              Trusted journalism and global reporting on politics,
              artificial intelligence, economy, world conflicts,
              technology, and international developments.
            </p>
          </div>


          <div>
            <h4 className="text-2xl font-bold mb-6">
              Quick Links
            </h4>

            <ul className="space-y-4 text-gray-400 text-lg">

              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>

            </ul>
          </div>


          <div>
            <h4 className="text-2xl font-bold mb-6">
              Follow Us
            </h4>

            <p className="text-gray-400 text-lg leading-9 mb-8">
              Stay connected for the latest global headlines,
              technology trends, AI developments, and current affairs.
            </p>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1e293b]"></div>
              <div className="w-12 h-12 rounded-full bg-[#1e293b]"></div>
              <div className="w-12 h-12 rounded-full bg-[#1e293b]"></div>
            </div>
          </div>

        </div>


        <div className="border-t border-gray-800 py-8 text-center text-gray-500 text-lg">
          © 2026 Global Insight. All rights reserved.
        </div>

      </footer>

    </main>
  );
}
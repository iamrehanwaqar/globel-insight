export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-10">
          Contact Us
        </h1>

        <p className="text-gray-300 text-xl mb-12">
          For business inquiries, collaborations, or news tips,
          feel free to contact Global Insight.
        </p>

        <form className="space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-6 py-4"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-6 py-4"
          />

          <textarea
            placeholder="Your Message"
            rows={6}
            className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-6 py-4"
          ></textarea>

          <button
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
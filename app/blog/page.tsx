import Link from "next/link";
import { client } from "@/lib/sanity";

async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(_createdAt desc) {
      title,
      slug
    }
  `);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">
          Latest Articles
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {posts.map((post: any) => (
            <div
              key={post.slug.current}
              className="bg-[#1e293b] rounded-3xl p-8 border border-gray-800"
            >
              <h2 className="text-3xl font-bold mb-6">
                {post.title}
              </h2>

              <Link
                href={`/blog/${post.slug.current}`}
                className="bg-white text-black px-6 py-3 rounded-xl inline-block"
              >
                Read Article
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
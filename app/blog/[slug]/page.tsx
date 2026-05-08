import { client } from "@/lib/sanity";

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    mainImage{
      asset->{
        url
      }
    },
    body
  }`;

  return await client.fetch(query, { slug });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Article Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-10 leading-tight">
          {post.title}
        </h1>

        {post.mainImage?.asset?.url && (
          <img
            src={post.mainImage.asset.url}
            alt={post.title}
            className="w-full h-[450px] object-cover rounded-3xl mb-12"
          />
        )}

        <div className="space-y-8 text-gray-300 text-lg leading-9">
          {post.body?.map((block: any) => {
            if (block._type === "block") {
              return (
                <p key={block._key}>
                  {block.children?.map((child: any) => child.text).join("")}
                </p>
              );
            }

            return null;
          })}
        </div>

      </div>
    </main>
  );
}
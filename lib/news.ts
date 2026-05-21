import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity";

export type NewsAuthor = {
  name?: string;
  role?: string;
  image?: SanityImageSource;
};

export type NewsArticle = {
  _id: string;
  title?: string | null;
  excerpt?: string | null;
  slug?: { current: string };
  mainImage?: SanityImageSource;
  imageUrl?: string | null;
  status?: "draft" | "published" | "archived" | null;
  category?: string;
  categories?: string[];
  tags?: string[];
  author?: NewsAuthor;
  publishedAt?: string;
  _createdAt?: string;
  body?: PortableBlock[];
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type PortableChild = { text?: string };
export type PortableBlock = {
  _key?: string;
  _type: string;
  style?: string;
  children?: PortableChild[];
};

export const fallbackArticles: NewsArticle[] = [
  {
    _id: "fallback-pakistan-economy",
    title: "Pakistan Economic Reforms 2026",
    excerpt:
      "New economic reforms aim to stabilize inflation, attract foreign investment, and strengthen long-term financial confidence.",
    slug: { current: "pakistan-economy-2026" },
    category: "Economy",
    categories: ["Economy"],
    tags: ["Markets", "Policy", "South Asia"],
    publishedAt: "2026-05-20T08:00:00.000Z",
    featured: true,
  },
  {
    _id: "fallback-ai-regulation",
    title: "Global Leaders Race To Shape AI Regulation",
    excerpt:
      "Governments are coordinating new rules for frontier AI systems as security, growth, and public trust collide.",
    slug: { current: "ai-regulation-global-summit" },
    category: "Technology",
    categories: ["Technology"],
    tags: ["AI", "Cybersecurity", "Policy"],
    publishedAt: "2026-05-19T10:30:00.000Z",
  },
  {
    _id: "fallback-geopolitics",
    title: "New Trade Alliances Redraw Global Power Lines",
    excerpt:
      "Emerging economies are building fresh partnerships across energy, chips, logistics, and food security.",
    slug: { current: "new-trade-alliances" },
    category: "World",
    categories: ["World"],
    tags: ["Diplomacy", "Trade", "Security"],
    publishedAt: "2026-05-18T14:00:00.000Z",
  },
  {
    _id: "fallback-sports",
    title: "International Sports Calendar Enters a Defining Summer",
    excerpt:
      "Cricket, football, and Olympic programs prepare for a packed season of tournaments and broadcast records.",
    slug: { current: "international-sports-summer" },
    category: "Sports",
    categories: ["Sports"],
    tags: ["Football", "Cricket", "Olympics"],
    publishedAt: "2026-05-17T11:00:00.000Z",
  },
];

const articleFields = `
  _id,
  title,
  "excerpt": coalesce(excerpt, description, seoDescription, pt::text(body)[0...180]),
  slug,
  mainImage,
  "imageUrl": coalesce(mainImage.asset->url, thumbnail, imageUrl),
  "status": coalesce(status, "published"),
  "category": coalesce(category->title, category, categories[0]->title, "Global"),
  "categories": categories[]->title,
  tags,
  author->{name, role, image},
  publishedAt,
  _createdAt,
  featured,
  seoTitle,
  seoDescription
`;

export const getArticles = cache(async () => {
  try {
    const posts = await client.fetch<NewsArticle[]>(
      `*[
        _type == "post" &&
        !(_id in path("drafts.**")) &&
        coalesce(status, "published") == "published" &&
        (!defined(publishedAt) || publishedAt <= now())
      ] | order(featured desc, publishedAt desc, _createdAt desc) { ${articleFields} }`,
      {},
      { next: { revalidate: 120 } },
    );
    return posts?.length ? posts : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
});

export const getArticle = cache(async (slug: string) => {
  try {
    const post = await client.fetch<NewsArticle | null>(
      `*[
        _type == "post" &&
        slug.current == $slug &&
        !(_id in path("drafts.**")) &&
        coalesce(status, "published") == "published" &&
        (!defined(publishedAt) || publishedAt <= now())
      ][0] { ${articleFields}, body }`,
      { slug },
      { next: { revalidate: 120 } },
    );
    return post ?? fallbackArticles.find((article) => article.slug?.current === slug) ?? null;
  } catch {
    return fallbackArticles.find((article) => article.slug?.current === slug) ?? null;
  }
});

export function getArticleDate(article: NewsArticle) {
  return article.publishedAt ?? article._createdAt ?? new Date().toISOString();
}

export function formatDate(value?: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value ? new Date(value) : new Date());
}

export function readingTime(body?: PortableBlock[] | null, fallbackText?: string | null) {
  const bodyText = Array.isArray(body)
    ? body
        .flatMap((block) =>
          Array.isArray(block?.children)
            ? block.children.map((child) => (typeof child?.text === "string" ? child.text : ""))
            : [],
        )
        .join(" ")
    : "";
  const safeText = typeof bodyText === "string" && bodyText.trim().length > 0
    ? bodyText
    : typeof fallbackText === "string"
      ? fallbackText
      : "";
  const wordCount = safeText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(wordCount / 220));
}

export function getCategories(articles: NewsArticle[]) {
  return Array.from(new Set(articles.flatMap((article) => article.categories?.length ? article.categories : [article.category ?? "Global"])));
}

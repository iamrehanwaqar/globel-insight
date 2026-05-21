import type { MetadataRoute } from "next";
import { getArticles, getArticleDate } from "@/lib/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalinsight.vercel.app";
  const articles = await getArticles();
  const staticRoutes = ["", "/blog", "/admin", "/login", "/profile", "/about", "/careers", "/contact", "/privacy-policy", "/terms-and-conditions", "/disclaimer"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug?.current}`,
      lastModified: new Date(getArticleDate(article)),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}

import { cache } from "react";

export type SourceArticle = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceDomain: string;
  title: string;
  description: string;
  content?: string;
  publishedAt: string;
  fetchedAt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
};

export type SourceFeed = {
  name: string;
  url: string;
  domain: string;
  category: string;
};

export const NEWS_FEEDS: SourceFeed[] = [
  {
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    domain: "bbc.co.uk",
    category: "World",
  },
  {
    name: "BBC News Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    domain: "bbc.co.uk",
    category: "Technology",
  },
  {
    name: "The Guardian World",
    url: "https://www.theguardian.com/world/rss",
    domain: "theguardian.com",
    category: "World",
  },
  {
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    domain: "aljazeera.com",
    category: "World",
  },
  {
    name: "NPR News",
    url: "https://feeds.npr.org/1004/rss.xml",
    domain: "npr.org",
    category: "World",
  },
  {
    name: "Reuters Business",
    url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
    domain: "reuters.com",
    category: "Business",
  },
  {
    name: "The Guardian Technology",
    url: "https://www.theguardian.com/technology/rss",
    domain: "theguardian.com",
    category: "Technology",
  },
  {
    name: "BBC News Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    domain: "bbc.co.uk",
    category: "Business",
  },
];

function parseRSSItem(xml: string): Partial<SourceArticle>[] {
  const items: Partial<SourceArticle>[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || xml.match(/<entry>([\s\S]*?)<\/entry>/gi) || [];

  for (const item of itemMatches) {
    const getTag = (tag: string): string => {
      const match = item.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
      return match ? match[1].trim().replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
    };

    const title = getTag("title").replace(/<[^>]*>/g, "").trim();
    const description = getTag("description").replace(/<[^>]*>/g, "").trim();
    const link = getTag("link").replace(/<[^>]*>/g, "").trim();
    const pubDate = getTag("pubDate") || getTag("published") || getTag("updated");

    let content = getTag("content:encoded") || getTag("content") || description;
    content = content.replace(/<[^>]*>/g, "").trim();

    if (title && link) {
      items.push({
        title,
        description: description || content.slice(0, 300),
        content: content.slice(0, 1500),
        sourceUrl: link,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }

  return items;
}

async function fetchFeed(feed: SourceFeed): Promise<SourceArticle[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GlobalInsight/1.0 (news aggregation)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return [];

    const xml = await response.text();
    const items = parseRSSItem(xml);

    return items.map((item) => ({
      id: `${feed.domain}-${Buffer.from(item.sourceUrl || item.title || "").toString("base64").slice(0, 16)}`,
      sourceName: feed.name,
      sourceUrl: item.sourceUrl || "",
      sourceDomain: feed.domain,
      title: item.title || "",
      description: item.description || "",
      content: item.content || item.description || "",
      publishedAt: item.publishedAt || new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      category: feed.category,
      tags: extractTags(item.title || "", item.description || ""),
      imageUrl: extractImageUrl(xml),
    }));
  } catch {
    return [];
  }
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tagMap: Record<string, string[]> = {
    AI: ["artificial intelligence", "ai ", "chatgpt", "openai", "machine learning", "deep learning", "neural"],
    Technology: ["tech", "software", "hardware", "startup", "digital", "cyber", "apple", "google", "microsoft", "amazon"],
    Economy: ["economy", "economic", "gdp", "inflation", "trade", "market", "stock", "financial", "banking"],
    Politics: ["election", "vote", "president", "minister", "parliament", "congress", "policy", "government", "political"],
    Climate: ["climate", "carbon", "emission", "environment", "renewable", "sustainability", "green energy"],
    Health: ["health", "medical", "vaccine", "disease", "hospital", "who", "pandemic", "virus"],
    Conflict: ["war", "conflict", "military", "troops", "strike", "attack", "ukraine", "gaza", "nato"],
    Space: ["space", "nasa", "spacex", "rocket", "satellite", "mars", "orbit"],
  };

  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      tags.push(tag);
    }
  }
  return tags.length > 0 ? tags : ["General"];
}

function extractImageUrl(xml: string): string | undefined {
  const mediaMatch = xml.match(/<media:content[^>]*url="([^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];

  const enclosureMatch = xml.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (enclosureMatch) return enclosureMatch[1];

  return undefined;
}

export const getAllSourceArticles = cache(async (): Promise<SourceArticle[]> => {
  const results = await Promise.allSettled(NEWS_FEEDS.map(fetchFeed));
  const articles = results
    .filter((r): r is PromiseFulfilledResult<SourceArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  return articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return a.title.length > 10;
  });
});

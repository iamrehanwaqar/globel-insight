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
  videoUrl?: string;
};

export type SourceFeed = {
  name: string;
  url: string;
  domain: string;
  category: string;
};

export const NEWS_FEEDS: SourceFeed[] = [
  // ── World News ──
  {
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    domain: "bbc.co.uk",
    category: "World",
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
  // ── Technology & AI ──
  {
    name: "BBC News Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    domain: "bbc.co.uk",
    category: "Technology",
  },
  {
    name: "The Guardian Technology",
    url: "https://www.theguardian.com/technology/rss",
    domain: "theguardian.com",
    category: "Technology",
  },
  // ── Business ──
  {
    name: "BBC News Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    domain: "bbc.co.uk",
    category: "Business",
  },
  {
    name: "Reuters Business",
    url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
    domain: "reuters.com",
    category: "Business",
  },
  // ── Science & Environment ──
  {
    name: "BBC News Science",
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    domain: "bbc.co.uk",
    category: "Science",
  },
  // ── Entertainment ──
  {
    name: "BBC News Entertainment",
    url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    domain: "bbc.co.uk",
    category: "Entertainment",
  },
  {
    name: "The Guardian Culture",
    url: "https://www.theguardian.com/music/rss",
    domain: "theguardian.com",
    category: "Culture",
  },
  // ── Sports ──
  {
    name: "BBC Sport",
    url: "https://feeds.bbci.co.uk/sport/rss.xml",
    domain: "bbc.co.uk",
    category: "Sports",
  },
  {
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    domain: "espn.com",
    category: "Sports",
  },
];

function parseRSSItem(xml: string): Partial<SourceArticle>[] {
  const items: Partial<SourceArticle>[] = [];
  const itemMatches =
    xml.match(/<item>([\s\S]*?)<\/item>/gi) ||
    xml.match(/<entry>([\s\S]*?)<\/entry>/gi) ||
    [];

  for (const item of itemMatches) {
    const getTag = (tag: string): string => {
      const match = item.match(
        new RegExp(
          `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
          "i"
        )
      );
      return match
        ? match[1].trim().replace(/<!\[CDATA\[|\]\]>/g, "").trim()
        : "";
    };

    const title = getTag("title").replace(/<[^>]*>/g, "").trim();
    const description = getTag("description").replace(/<[^>]*>/g, "").trim();
    const link = getTag("link").replace(/<[^>]*>/g, "").trim();
    const pubDate =
      getTag("pubDate") || getTag("published") || getTag("updated");

    let content =
      getTag("content:encoded") || getTag("content") || description;
    content = content.replace(/<[^>]*>/g, "").trim();

    if (title && link) {
      const media = extractMedia(item);
      items.push({
        title,
        description: description || content.slice(0, 300),
        content: content.slice(0, 1500),
        sourceUrl: link,
        publishedAt: pubDate
          ? new Date(pubDate).toISOString()
          : new Date().toISOString(),
        imageUrl: media.image,
        videoUrl: media.video,
      });
    }
  }

  return items;
}

function extractMedia(itemXml: string): {
  image?: string;
  video?: string;
} {
  let image: string | undefined;
  let video: string | undefined;

  const mediaVideoMatch = itemXml.match(
    /<media:content[^>]*medium=["']video["'][^>]*url=["']([^"']+)["']/i
  );
  if (mediaVideoMatch) {
    video = mediaVideoMatch[1];
  }

  if (!video) {
    const ytMatch = itemXml.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      video = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
  }

  const mediaImageMatch = itemXml.match(
    /<media:content[^>]*medium=["']image["'][^>]*url=["']([^"']+)["']/i
  );
  if (mediaImageMatch) {
    image = mediaImageMatch[1];
  }

  if (!image) {
    const mediaContentUrl = itemXml.match(
      /<media:content[^>]*url=["']([^"']+)["']/i
    );
    if (mediaContentUrl && !video) {
      image = mediaContentUrl[1];
    }
  }

  if (!image) {
    const thumbnailMatch = itemXml.match(
      /<media:thumbnail[^>]*url=["']([^"']+)["']/i
    );
    if (thumbnailMatch) image = thumbnailMatch[1];
  }

  if (!image) {
    const enclosureMatch = itemXml.match(
      /<enclosure[^>]*type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["']/i
    );
    if (enclosureMatch) image = enclosureMatch[1];
  }

  if (!image) {
    const enclosureAny = itemXml.match(
      /<enclosure[^>]*url=["']([^"']+\.(jpg|jpeg|png|webp|gif))["']/i
    );
    if (enclosureAny) image = enclosureAny[1];
  }

  if (!image) {
    const itunesImage = itemXml.match(
      /<itunes:image[^>]*href=["']([^"']+)["']/i
    );
    if (itunesImage) image = itunesImage[1];
  }

  if (!image) {
    const imageTag = itemXml.match(/<image>[\s\S]*?<\/image>/i);
    if (imageTag) {
      const urlInImage = imageTag[0].match(/<url>([^<]+)<\/url>/i);
      if (urlInImage) image = urlInImage[1];
    }
  }

  if (!image) {
    const imgTag = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
    if (imgTag && /\.(jpg|jpeg|png|webp|gif)/i.test(imgTag[1])) {
      image = imgTag[1];
    }
  }

  if (!image) {
    const srcsetMatch = itemXml.match(/srcset=["']([^"']+)/i);
    if (srcsetMatch) {
      const firstUrl = srcsetMatch[1].split(",")[0]?.trim().split(/\s+/)[0];
      if (firstUrl && firstUrl.startsWith("http") && /\.(jpg|jpeg|png|webp|gif)/i.test(firstUrl)) {
        image = firstUrl;
      }
    }
  }

  return { image, video };
}

function extractVideoFromDescription(text: string): string | undefined {
  const ytMatch = text.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = text.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return undefined;
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

    return items.map((item) => {
      const videoUrl =
        item.videoUrl ||
        extractVideoFromDescription(item.content || item.description || "");

      return {
        id: `${feed.domain}-${Buffer.from(item.sourceUrl || item.title || "")
          .toString("base64")
          .slice(0, 16)}`,
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
        imageUrl: item.imageUrl,
        videoUrl,
      };
    });
  } catch {
    return [];
  }
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tagMap: Record<string, string[]> = {
    AI: [
      "artificial intelligence",
      "ai ",
      "chatgpt",
      "openai",
      "machine learning",
      "deep learning",
      "neural network",
      "large language model",
      "generative ai",
    ],
    Technology: [
      "software",
      "hardware",
      "startup",
      "digital",
      "cyber",
      "apple",
      "google",
      "microsoft",
      "amazon",
      "meta ",
      "tiktok",
      "social media",
      "data breach",
    ],
    Economy: [
      "economy",
      "economic",
      "gdp",
      "inflation",
      "trade",
      "market",
      "stock",
      "financial",
      "banking",
      "recession",
      "interest rate",
    ],
    Politics: [
      "election",
      "vote",
      "president",
      "minister",
      "parliament",
      "congress",
      "political",
      "diplomacy",
      "sanctions",
    ],
    Climate: [
      "climate",
      "carbon",
      "emission",
      "environment",
      "renewable",
      "sustainability",
      "green energy",
      "global warming",
    ],
    Health: [
      "medical",
      "vaccine",
      "disease",
      "hospital",
      "pandemic",
      "virus",
      "outbreak",
      "drug",
    ],
    Conflict: [
      "war",
      "conflict",
      "military",
      "troops",
      "nato",
      "ceasefire",
      "invasion",
    ],
    Space: [
      "nasa",
      "spacex",
      "rocket",
      "satellite",
      "mars",
      "orbit",
      "spacecraft",
    ],
    Business: [
      "earnings",
      "revenue",
      "acquisition",
      "merger",
      "ipo",
      "profit",
      "quarterly",
      "shareholder",
    ],
    Science: [
      "scientists",
      "research",
      "discovery",
      "study",
      "experiment",
      "journal",
      "breakthrough",
    ],
    Movies: [
      "movie",
      "film",
      "cinema",
      "trailer",
      "box office",
      "director",
      "screenplay",
      "franchise",
      "sequel",
    ],
    TV: [
      "series",
      "season",
      "streaming",
      "netflix",
      "hulu",
      "disney+",
      "episode",
      "showrunner",
    ],
    Anime: [
      "anime",
      "manga",
      "studio ghibli",
      "crunchyroll",
      "otaku",
    ],
    Music: [
      "album",
      "single",
      "concert",
      "tour",
      "artist",
      "billboard",
      "spotify",
      "grammy",
    ],
    Sports: [
      "football",
      "soccer",
      "basketball",
      "cricket",
      "tennis",
      "f1",
      "formula 1",
      "olympics",
      "world cup",
      "championship",
      "premier league",
      "nfl",
      "nba",
      "mlb",
      "transfer",
    ],
    Culture: [
      "trend",
      "viral",
      "meme",
      "internet",
      "social",
      "digital culture",
    ],
  };

  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      tags.push(tag);
    }
  }
  return tags.length > 0 ? tags : ["General"];
}

export const getAllSourceArticles = cache(
  async (): Promise<SourceArticle[]> => {
    const results = await Promise.allSettled(NEWS_FEEDS.map(fetchFeed));
    const articles = results
      .filter(
        (r): r is PromiseFulfilledResult<SourceArticle[]> =>
          r.status === "fulfilled"
      )
      .flatMap((r) => r.value);

    // Deduplicate: same title from multiple sources = keep only first
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();
    return articles.filter((a) => {
      // Skip very short titles
      if (a.title.length < 10) return false;

      // Exact URL dedup
      if (seenUrls.has(a.sourceUrl)) return false;
      seenUrls.add(a.sourceUrl);

      // Normalize title for dedup: lowercase, remove punctuation, take first 8 words
      const normalizedTitle = a.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .slice(0, 8)
        .join(" ");

      if (seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);
      return true;
    });
  }
);

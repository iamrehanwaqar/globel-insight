import { cache } from "react";
import { getArticles } from "./news";
import { getAllSourceArticles, SourceArticle } from "./sources";

export type StoryTimelineEvent = {
  date: string;
  headline: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
};

export type StoryMedia = {
  type: "image" | "video";
  url: string;
  sourceName: string;
  sourceUrl: string;
  alt: string;
  caption?: string;
};

export type Story = {
  id: string;
  slug: string;
  headline: string;
  category: string;
  summary: string;
  lastUpdated: string;
  createdAt: string;

  whatHappened: string;
  keyFacts: { fact: string; sources: string[] }[];
  whyItMatters: string;
  outlook: string;

  agreements: string[];
  differences: { point: string; perspectives: { source: string; angle: string }[] }[];

  whatChanged?: string;

  timeline: StoryTimelineEvent[];
  sources: SourceArticle[];
  sourceCount: number;
  sourceNames: string[];

  heroImage?: string;
  heroImageSource?: string;
  heroImageCaption?: string;
  media: StoryMedia[];
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "as", "is", "are", "was", "were", "be", "been",
  "will", "would", "can", "could", "may", "might", "shall", "should",
  "has", "have", "had", "do", "does", "did", "that", "this", "these",
  "those", "it", "its", "from", "than", "not", "no", "nor", "so",
  "if", "then", "else", "about", "into", "through", "during", "before",
  "after", "above", "below", "between", "under", "over", "new", "says",
  "said", "also", "more", "some", "than", "very", "just", "like",
  "been", "being", "their", "them", "they", "you", "your", "all",
  "each", "every", "both", "few", "most", "other", "what", "which",
  "who", "whom", "when", "where", "how", "any", "only", "own", "same",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function bigrams(text: string): string[] {
  const words = extractKeywords(text);
  const result: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    result.push(`${words[i]} ${words[i + 1]}`);
  }
  return result;
}

function cosineSimilarity(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const freqA = new Map<string, number>();
  const freqB = new Map<string, number>();
  for (const w of a) freqA.set(w, (freqA.get(w) || 0) + 1);
  for (const w of b) freqB.set(w, (freqB.get(w) || 0) + 1);
  const allWords = new Set([...freqA.keys(), ...freqB.keys()]);
  let dot = 0, magA = 0, magB = 0;
  for (const w of allWords) {
    const va = freqA.get(w) || 0;
    const vb = freqB.get(w) || 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

function tagOverlap(a: string[], b: string[]): number {
  const setA = new Set(a.map((t) => t.toLowerCase()));
  const setB = new Set(b.map((t) => t.toLowerCase()));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / (union.size || 1);
}

function clusterSourceArticles(articles: SourceArticle[]): SourceArticle[][] {
  const clusters: SourceArticle[][] = [];

  for (const article of articles) {
    const articleKw = [
      ...extractKeywords(article.title),
      ...bigrams(article.title),
      ...extractKeywords(article.description).slice(0, 10),
    ];

    let bestCluster = -1;
    let bestScore = 0;

    for (let i = 0; i < clusters.length; i++) {
      const clusterKw = [
        ...extractKeywords(clusters[i][0].title),
        ...bigrams(clusters[i][0].title),
        ...extractKeywords(clusters[i][0].description).slice(0, 10),
      ];

      const kwSim = cosineSimilarity(articleKw, clusterKw);
      const tagSim = tagOverlap(article.tags, clusters[i][0].tags);

      const score = kwSim * 0.6 + tagSim * 0.4;

      if (score > bestScore) {
        bestScore = score;
        bestCluster = i;
      }
    }

    const THRESHOLD = 0.08;
    if (bestCluster >= 0 && bestScore > THRESHOLD) {
      clusters[bestCluster].push(article);
    } else {
      clusters.push([article]);
    }
  }

  return clusters;
}

function generateStoryId(cluster: SourceArticle[]): string {
  const slugBase = cluster[0].title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return `story-${slugBase}`;
}

function synthesizeStory(cluster: SourceArticle[]): Story {
  const sorted = [...cluster].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const oldest = sorted[sorted.length - 1];
  const newest = sorted[0];

  const slug = generateStoryId(cluster);
  const sourceNames = [...new Set(cluster.map((a) => a.sourceName))];
  const category = mostCommon(cluster.map((a) => a.category));

  const headline = generateHeadline(cluster);
  const summary = generateSummary(cluster);
  const whatHappened = generateWhatHappened(cluster);
  const keyFacts = generateKeyFacts(cluster);
  const whyItMatters = generateWhyItMatters(cluster, category);
  const outlook = generateOutlook(cluster, category);
  const agreements = generateAgreements(cluster);
  const differences = generateDifferences(cluster);
  const whatChanged = generateWhatChanged(cluster);
  const timeline = generateTimeline(sorted);

  const { heroImage, heroImageSource, heroImageCaption, media } = aggregateMedia(sorted);

  return {
    id: slug,
    slug,
    headline,
    category,
    summary,
    lastUpdated: newest.publishedAt,
    createdAt: oldest.publishedAt,
    whatHappened,
    keyFacts,
    whyItMatters,
    outlook,
    agreements,
    differences,
    whatChanged,
    timeline,
    sources: sorted,
    sourceCount: sorted.length,
    sourceNames,
    heroImage,
    heroImageSource,
    heroImageCaption,
    media,
  };
}

function mostCommon(arr: string[]): string {
  const freq = new Map<string, number>();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  let best = arr[0] || "Global";
  let bestCount = 0;
  for (const [item, count] of freq) {
    if (count > bestCount) {
      bestCount = count;
      best = item;
    }
  }
  return best;
}

function generateHeadline(cluster: SourceArticle[]): string {
  if (cluster.length === 1) return cluster[0].title;

  const allWords = cluster
    .map((a) => extractKeywords(a.title))
    .flat();
  const freq = new Map<string, number>();
  for (const w of allWords) freq.set(w, (freq.get(w) || 0) + 1);

  const sharedTerms = [...freq.entries()]
    .filter(([, count]) => count >= Math.ceil(cluster.length * 0.3))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([word]) => word);

  if (sharedTerms.length >= 2) {
    return sharedTerms.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  const bestTitle = cluster.reduce((best, a) =>
    a.title.length > best.title.length ? a : best
  );
  return bestTitle.title;
}

function generateSummary(cluster: SourceArticle[]): string {
  if (cluster.length === 1) {
    return cluster[0].description || cluster[0].title;
  }
  const uniqueSources = [...new Set(cluster.map((a) => a.sourceName))];
  const descriptions = cluster
    .slice(0, 5)
    .map((a) => a.description)
    .filter((d) => d.length > 20);

  const combined = descriptions.slice(0, 3).join(" ");
  const sentences = combined.match(/[^.!?]+[.!?]+/g) || [combined];
  const uniqueSentences = [...new Set(sentences.map((s) => s.trim()))];

  const lead = uniqueSentences.slice(0, 2).join(" ");
  const sourceNote = `Coverage spans ${uniqueSources.length} source${uniqueSources.length > 1 ? "s" : ""}: ${uniqueSources.slice(0, 3).join(", ")}${uniqueSources.length > 3 ? " and others" : ""}.`;

  return `${lead} ${sourceNote}`.slice(0, 500);
}

function generateWhatHappened(cluster: SourceArticle[]): string {
  if (cluster.length === 1) {
    return cluster[0].description || cluster[0].title;
  }

  const parts: string[] = [];

  const earliest = cluster.reduce((min, a) =>
    new Date(a.publishedAt) < new Date(min.publishedAt) ? a : min
  );
  parts.push(`Initial reports from ${earliest.sourceName}: "${earliest.description.slice(0, 150)}..."`);

  if (cluster.length > 2) {
    const middle = cluster.slice(1, -1);
    parts.push(`Subsequent coverage from ${[...new Set(middle.map((a) => a.sourceName))].join(", ")} expanded on the developing story.`);
  }

  const latest = cluster.reduce((max, a) =>
    new Date(a.publishedAt) > new Date(max.publishedAt) ? a : max
  );
  if (latest !== earliest) {
    parts.push(`The latest update from ${latest.sourceName} reports: "${latest.description.slice(0, 150)}..."`);
  }

  return parts.join(" ");
}

function generateKeyFacts(cluster: SourceArticle[]): { fact: string; sources: string[] }[] {
  const facts: { fact: string; sources: string[] }[] = [];
  const usedDescriptions = new Set<string>();

  for (const article of cluster) {
    const desc = article.description.trim();
    if (desc.length < 20 || usedDescriptions.has(desc.slice(0, 50))) continue;
    usedDescriptions.add(desc.slice(0, 50));

    const sources = cluster
      .filter((a) => {
        const sim = cosineSimilarity(
          extractKeywords(a.description),
          extractKeywords(desc)
        );
        return sim > 0.3;
      })
      .map((a) => a.sourceName);

    const uniqueSources = [...new Set(sources)];
    facts.push({
      fact: desc.slice(0, 200),
      sources: uniqueSources.length > 0 ? uniqueSources : [article.sourceName],
    });
  }

  return facts.slice(0, 8);
}

function generateWhyItMatters(cluster: SourceArticle[], category: string): string {
  const tags = [...new Set(cluster.flatMap((a) => a.tags))];
  const uniqueSources = [...new Set(cluster.map((a) => a.sourceName))];

  const significanceMap: Record<string, string> = {
    AI: "The rapid development of artificial intelligence continues to reshape industries, raise regulatory questions, and spark debate about its societal impact.",
    Technology: "Technology sector developments have wide-reaching implications for consumers, businesses, and global competitiveness.",
    Economy: "Economic developments affect policy decisions, market behavior, and the financial outlook for individuals and institutions.",
    Politics: "Political developments influence governance, international relations, and policy direction across multiple sectors.",
    Climate: "Climate-related developments have long-term implications for environmental policy, industry practices, and global sustainability goals.",
    Health: "Health-related developments impact public health policy, healthcare systems, and individual well-being.",
    Conflict: "Geopolitical conflicts have far-reaching implications for regional stability, international relations, and humanitarian conditions.",
    Space: "Space developments represent milestones in scientific achievement and have implications for technology, defense, and commercial interests.",
    Business: "Business developments affect market dynamics, employment, and economic outlook across sectors.",
    General: "This developing story has implications across multiple sectors and regions.",
  };

  const primaryTag = tags[0] || category;
  const base = significanceMap[primaryTag] || significanceMap["General"];

  const multiSourceNote = uniqueSources.length > 1
    ? ` The fact that ${uniqueSources.length} independent sources are covering this development underscores its significance.`
    : "";

  return `${base}${multiSourceNote}`;
}

function generateOutlook(cluster: SourceArticle[], category: string): string {
  const uniqueSources = [...new Set(cluster.map((a) => a.sourceName))];
  return `As this story develops across ${uniqueSources.length} source${uniqueSources.length > 1 ? "s" : ""}, further updates are expected. The ${category.toLowerCase()} sector will continue to be monitored for additional developments and reactions.`;
}

function generateAgreements(cluster: SourceArticle[]): string[] {
  if (cluster.length < 2) return ["Single source coverage."];

  const agreements: string[] = [];
  const uniqueSources = [...new Set(cluster.map((a) => a.sourceName))];

  if (uniqueSources.length >= 2) {
    agreements.push(`Multiple sources (${uniqueSources.join(", ")}) confirm the core facts of this story.`);
  }

  const allTitles = cluster.map((a) => a.title.toLowerCase());
  const commonWords = new Map<string, number>();
  for (const title of allTitles) {
    for (const kw of extractKeywords(title)) {
      commonWords.set(kw, (commonWords.get(kw) || 0) + 1);
    }
  }
  const sharedKeywords = [...commonWords.entries()]
    .filter(([, count]) => count >= Math.ceil(cluster.length * 0.5))
    .map(([word]) => word);

  if (sharedKeywords.length > 0) {
    agreements.push(`Sources share common focus on: ${sharedKeywords.slice(0, 4).join(", ")}.`);
  }

  return agreements;
}

function generateDifferences(cluster: SourceArticle[]): { point: string; perspectives: { source: string; angle: string }[] }[] {
  if (cluster.length < 2) return [];

  const differences: { point: string; perspectives: { source: string; angle: string }[] }[] = [];
  const uniqueSources = [...new Set(cluster.map((a) => a.sourceName))];

  if (uniqueSources.length >= 2) {
    const bySource = new Map<string, SourceArticle[]>();
    for (const a of cluster) {
      const arr = bySource.get(a.sourceName) || [];
      arr.push(a);
      bySource.set(a.sourceName, arr);
    }

    const perspectives = [...bySource.entries()].map(([name, articles]) => ({
      source: name,
      angle: articles[0].description.slice(0, 120),
    }));

    differences.push({
      point: "Coverage emphasis and framing",
      perspectives,
    });
  }

  return differences;
}

function generateWhatChanged(cluster: SourceArticle[]): string | undefined {
  if (cluster.length < 2) return undefined;

  const sorted = [...cluster].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const latest = sorted[0];
  const previous = sorted[1];

  const timeDiff = new Date(latest.publishedAt).getTime() - new Date(previous.publishedAt).getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff > 48) return undefined;

  return `Latest update from ${latest.sourceName} (${hoursDiff < 1 ? "recently" : `${Math.round(hoursDiff)}h ago`}): "${latest.description.slice(0, 150)}..."`;
}

function aggregateMedia(sources: SourceArticle[]): {
  heroImage?: string;
  heroImageSource?: string;
  heroImageCaption?: string;
  media: StoryMedia[];
} {
  const media: StoryMedia[] = [];
  const seenImages = new Set<string>();
  const seenVideos = new Set<string>();

  for (const source of sources) {
    if (source.imageUrl && !seenImages.has(source.imageUrl)) {
      seenImages.add(source.imageUrl);
      media.push({
        type: "image",
        url: source.imageUrl,
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        alt: source.title,
        caption: `${source.title} — ${source.sourceName}`,
      });
    }

    if (source.videoUrl && !seenVideos.has(source.videoUrl)) {
      seenVideos.add(source.videoUrl);
      media.push({
        type: "video",
        url: source.videoUrl,
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        alt: source.title,
        caption: `${source.title} — ${source.sourceName}`,
      });
    }
  }

  const heroMedia = media.find((m) => m.type === "image");

  return {
    heroImage: heroMedia?.url,
    heroImageSource: heroMedia?.sourceName,
    heroImageCaption: heroMedia?.caption,
    media,
  };
}

function generateTimeline(sorted: SourceArticle[]): StoryTimelineEvent[] {
  return sorted.map((a) => ({
    date: a.publishedAt,
    headline: a.title,
    sourceName: a.sourceName,
    sourceUrl: a.sourceUrl,
    imageUrl: a.imageUrl,
  }));
}

export const getStories = cache(async (): Promise<Story[]> => {
  const [sanityArticles, rssArticles] = await Promise.all([
    getArticles(),
    getAllSourceArticles(),
  ]);

  const allSources: SourceArticle[] = [];

  for (const article of sanityArticles) {
    if (article.title) {
      allSources.push({
        id: article._id,
        sourceName: "Global Insight",
        sourceUrl: `https://globalinsight.vercel.app/blog/${article.slug?.current || article._id}`,
        sourceDomain: "globalinsight.vercel.app",
        title: article.title,
        description: article.excerpt || "",
        content: article.excerpt || "",
        publishedAt: article.publishedAt || article._createdAt || new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        category: article.category || "Global",
        tags: article.tags || [],
        imageUrl: article.imageUrl || undefined,
      });
    }
  }

  allSources.push(...rssArticles);

  if (allSources.length === 0) {
    return [];
  }

  const clusters = clusterSourceArticles(allSources);
  const stories = clusters
    .filter((c) => c.length >= 1)
    .map(synthesizeStory);

  stories.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  return stories;
});

export const getStory = cache(async (slug: string): Promise<Story | null> => {
  const stories = await getStories();
  return stories.find((s) => s.slug === slug) || null;
});

export const searchStories = cache(async (query: string): Promise<Story[]> => {
  const stories = await getStories();
  if (!query) return stories;

  const lowerQuery = query.toLowerCase();
  return stories.filter(
    (s) =>
      s.headline.toLowerCase().includes(lowerQuery) ||
      s.summary.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.sourceNames.some((name) => name.toLowerCase().includes(lowerQuery)) ||
      s.sources.some((src) => src.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
  );
});

export const getPersonalizedBriefing = cache(async (followedTopics: string[]): Promise<Story[]> => {
  const stories = await getStories();

  if (!followedTopics || followedTopics.length === 0) {
    return stories.slice(0, 5);
  }

  const lowerFollowed = followedTopics.map((t) => t.toLowerCase());
  const personalizedStories = stories.filter((s) =>
    lowerFollowed.some(
      (t) =>
        s.category.toLowerCase() === t ||
        s.sourceNames.some((name) => name.toLowerCase().includes(t)) ||
        s.headline.toLowerCase().includes(t)
    )
  );

  const topGlobal = stories.filter((s) => !personalizedStories.includes(s)).slice(0, 2);

  const briefing = [...personalizedStories.slice(0, 3), ...topGlobal];
  return briefing.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
});

export const getEntityData = cache(async (type: string, slug: string): Promise<{
  name: string;
  type: string;
  overview: string;
  relatedStories: Story[];
} | null> => {
  const stories = await getStories();
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");

  const relatedStories = stories.filter((s) => {
    const isTopicMatch = type === "topic" && s.category.toLowerCase() === decodedSlug.toLowerCase();
    const isTagMatch = s.sources.some((src) =>
      src.tags?.some((tag) => tag.toLowerCase() === decodedSlug.toLowerCase())
    );
    const isHeadlineMatch = s.headline.toLowerCase().includes(decodedSlug.toLowerCase());
    return isTopicMatch || isTagMatch || isHeadlineMatch;
  });

  if (relatedStories.length === 0 && type !== "topic") return null;

  return {
    name: decodedSlug
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    type,
    overview: `This entity is tracked across ${relatedStories.length} story clusters in our intelligence database. Coverage includes ${relatedStories.slice(0, 2).map((s) => `"${s.headline}"`).join(" and ")}.`,
    relatedStories,
  };
});

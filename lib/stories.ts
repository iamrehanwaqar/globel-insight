import { cache } from "react";
import { getArticles, NewsArticle } from "./news";

export type StoryTimelineEvent = {
  date: string;
  headline: string;
  articleSlug: string;
};

export type Story = {
  id: string;
  slug: string;
  headline: string;
  category: string;
  lastUpdated: string;
  
  // AI Generated Sections
  whatHappened: string;
  keyPoints: string[];
  whyItMatters: string;
  
  // Analysis
  agreements: string[];
  disagreements: string[];
  
  timeline: StoryTimelineEvent[];
  sources: NewsArticle[];
  sourceCount: number;
};

// A simple utility to extract keywords from titles for clustering
function extractKeywords(text: string): string[] {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "as", "is", "are", "was", "were", "be", "been", "will", "would", "can", "could"]);
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
}

// Calculate similarity between two arrays
function jaccardSimilarity(arr1: string[], arr2: string[]): number {
  if (!arr1.length && !arr2.length) return 0;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / (union.size || 1);
}

// Group articles into stories based on tag and keyword similarity
function clusterArticles(articles: NewsArticle[]): NewsArticle[][] {
  const clusters: NewsArticle[][] = [];
  
  for (const article of articles) {
    let addedToCluster = false;
    const articleKeywords = extractKeywords(article.title || "");
    const articleTags = article.tags?.map(t => t.toLowerCase()) || [];

    for (const cluster of clusters) {
      const clusterKeywords = extractKeywords(cluster[0].title || "");
      const clusterTags = cluster[0].tags?.map(t => t.toLowerCase()) || [];
      
      const keywordSim = jaccardSimilarity(articleKeywords, clusterKeywords);
      const tagSim = jaccardSimilarity(articleTags, clusterTags);
      
      // If similarity is high enough or they share a prominent tag, group them
      // Alternatively, group by category for broader stories if we don't have many articles
      if (keywordSim > 0.1 || tagSim > 0.2 || (article.category === cluster[0].category && articles.length < 10)) {
        cluster.push(article);
        addedToCluster = true;
        break;
      }
    }
    
    if (!addedToCluster) {
      clusters.push([article]);
    }
  }
  
  return clusters;
}

// Synthesize story content from clustered articles
// In a production AI pipeline, this would call an LLM. Here we simulate it using the source data.
function synthesizeStory(cluster: NewsArticle[]): Story {
  // Sort articles by date descending
  const sortedArticles = cluster.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a._createdAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b._createdAt || 0).getTime();
    return dateB - dateA;
  });

  const latest = sortedArticles[0];
  const oldest = sortedArticles[sortedArticles.length - 1];

  const category = latest.category || "Global";
  const slug = `story-${latest.slug?.current || latest._id}`;
  
  // Create a better headline
  const headline = cluster.length > 1 
    ? `The Global Context: ${latest.title}` 
    : latest.title || "Untitled Story";
  
  // Synthesize AI summaries from the excerpts
  const whatHappened = cluster.length > 1
    ? `According to multiple sources, ${latest.excerpt?.toLowerCase() || "new developments have occurred."} The situation began with reports that ${oldest.excerpt?.toLowerCase() || "events were unfolding."}`
    : `According to ${latest.author?.name || "reporting"}, ${latest.excerpt || "events are unfolding."}`;
  
  const keyPoints = cluster.slice(0, 3).map(a => `${a.title}: ${a.excerpt}`);
  if (keyPoints.length === 0) keyPoints.push("Significant developments are ongoing.");
  
  const whyItMatters = `This matters because it affects ${category.toLowerCase()} policies globally, signaling a shift in how stakeholders approach ${latest.tags?.[0] || "these issues"}.`;

  const timeline = sortedArticles.map(a => ({
    date: a.publishedAt || a._createdAt || new Date().toISOString(),
    headline: a.title || "Update",
    articleSlug: a.slug?.current || a._id
  })).reverse(); // chronological order

  // Simulate source comparison (agreement/disagreement)
  const agreements = [
    "Most sources confirm the primary timeline of events.",
    "There is consensus on the economic/political impact of this development."
  ];
  const disagreements = cluster.length > 1 ? [
    "Sources differ on the long-term motivations behind these actions.",
    "Regional publications emphasize different regional impacts."
  ] : [];

  return {
    id: `story-${latest._id}`,
    slug,
    headline,
    category,
    lastUpdated: latest.publishedAt || latest._createdAt || new Date().toISOString(),
    whatHappened,
    keyPoints,
    whyItMatters,
    agreements,
    disagreements,
    timeline,
    sources: sortedArticles,
    sourceCount: sortedArticles.length
  };
}

export const getStories = cache(async (): Promise<Story[]> => {
  const articles = await getArticles();
  
  const clusters = clusterArticles(articles);
  const stories = clusters.map(synthesizeStory);
  
  // Sort stories by last updated
  return stories.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
});

export const getStory = cache(async (slug: string): Promise<Story | null> => {
  const stories = await getStories();
  return stories.find(s => s.slug === slug) || null;
});

export const searchStories = cache(async (query: string): Promise<Story[]> => {
  const stories = await getStories();
  if (!query) return stories;
  
  const lowerQuery = query.toLowerCase();
  return stories.filter(s => 
    s.headline.toLowerCase().includes(lowerQuery) ||
    s.whatHappened.toLowerCase().includes(lowerQuery) ||
    s.category.toLowerCase().includes(lowerQuery) ||
    s.sources.some(src => src.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
});

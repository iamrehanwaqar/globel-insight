import { cookies } from "next/headers";

export type UserPreferences = {
  followedTopics: string[];
  savedStorySlugs: string[];
};

export const defaultPreferences: UserPreferences = {
  followedTopics: [],
  savedStorySlugs: [],
};

export async function getServerPreferences(): Promise<UserPreferences> {
  const cookieStore = await cookies();
  const prefsCookie = cookieStore.get("global_insight_prefs");
  
  if (prefsCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(prefsCookie.value));
      return {
        followedTopics: Array.isArray(parsed.followedTopics) ? parsed.followedTopics : [],
        savedStorySlugs: Array.isArray(parsed.savedStorySlugs) ? parsed.savedStorySlugs : [],
      };
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
}

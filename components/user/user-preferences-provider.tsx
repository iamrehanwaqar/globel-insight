"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { UserPreferences } from "@/lib/preferences";
import { defaultPreferences } from "@/lib/preferences";

type PreferencesContextType = UserPreferences & {
  toggleTopic: (topic: string) => void;
  toggleSavedStory: (slug: string) => void;
  isTopicFollowed: (topic: string) => boolean;
  isStorySaved: (slug: string) => boolean;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children, initialPreferences }: { children: ReactNode, initialPreferences: UserPreferences }) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);

  // Sync to cookie whenever preferences change
  useEffect(() => {
    // Skip on initial mount if unchanged to avoid unnecessary cookie writes
    if (JSON.stringify(preferences) === JSON.stringify(initialPreferences)) return;
    
    document.cookie = `global_insight_prefs=${encodeURIComponent(JSON.stringify(preferences))}; path=/; max-age=31536000; SameSite=Lax`;
  }, [preferences, initialPreferences]);

  const toggleTopic = (topic: string) => {
    setPreferences(prev => {
      const followedTopics = prev.followedTopics.includes(topic)
        ? prev.followedTopics.filter(t => t !== topic)
        : [...prev.followedTopics, topic];
      return { ...prev, followedTopics };
    });
  };

  const toggleSavedStory = (slug: string) => {
    setPreferences(prev => {
      const savedStorySlugs = prev.savedStorySlugs.includes(slug)
        ? prev.savedStorySlugs.filter(s => s !== slug)
        : [...prev.savedStorySlugs, slug];
      return { ...prev, savedStorySlugs };
    });
  };

  const isTopicFollowed = (topic: string) => preferences.followedTopics.includes(topic);
  const isStorySaved = (slug: string) => preferences.savedStorySlugs.includes(slug);

  return (
    <PreferencesContext.Provider value={{ ...preferences, toggleTopic, toggleSavedStory, isTopicFollowed, isStorySaved }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

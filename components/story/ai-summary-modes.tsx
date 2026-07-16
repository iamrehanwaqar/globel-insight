"use client";

import { useState } from "react";
import type { Story } from "@/lib/stories";

type SummaryMode = "30-second" | "key-points" | "detailed" | "why-it-matters";

export function AiSummaryModes({ story }: { story: Story }) {
  const [mode, setMode] = useState<SummaryMode>("30-second");

  return (
    <div className="rounded border border-emerald-900/30 bg-[#0A0F1A]/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 text-emerald-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-xs font-black uppercase tracking-widest">AI Intelligence Briefing</span>
      </div>
      
      <div className="mb-6 flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "30-second", label: "30-Second Summary" },
          { id: "key-points", label: "Key Points" },
          { id: "why-it-matters", label: "Why It Matters" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as SummaryMode)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              mode === tab.id
                ? "border-b-2 border-emerald-400 text-emerald-400"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[120px] text-white/80">
        {mode === "30-second" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="leading-relaxed">{story.whatHappened}</p>
          </div>
        )}
        
        {mode === "key-points" && (
          <ul className="animate-in fade-in slide-in-from-bottom-2 space-y-3 duration-300">
            {story.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {mode === "why-it-matters" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="leading-relaxed">{story.whyItMatters}</p>
          </div>
        )}
      </div>
    </div>
  );
}

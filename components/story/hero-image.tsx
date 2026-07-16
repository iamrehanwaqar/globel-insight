"use client";

import Image from "next/image";
import { useState } from "react";

const CATEGORY_GRADIENTS: Record<string, string> = {
  World:         "from-blue-600 via-cyan-700 to-slate-900",
  Technology:    "from-violet-600 via-indigo-700 to-slate-900",
  AI:            "from-purple-600 via-fuchsia-700 to-slate-900",
  Business:      "from-emerald-600 via-teal-700 to-slate-900",
  Politics:      "from-red-600 via-orange-700 to-slate-900",
  Science:       "from-cyan-600 via-blue-700 to-slate-900",
  Health:        "from-pink-600 via-rose-700 to-slate-900",
  Climate:       "from-green-600 via-emerald-700 to-slate-900",
  Sports:        "from-orange-600 via-amber-700 to-slate-900",
  Entertainment: "from-fuchsia-600 via-purple-700 to-slate-900",
  Movies:        "from-rose-600 via-red-700 to-slate-900",
  TV:            "from-indigo-600 via-violet-700 to-slate-900",
  Anime:         "from-pink-600 via-fuchsia-700 to-slate-900",
  Music:         "from-amber-600 via-yellow-700 to-slate-900",
  Culture:       "from-teal-600 via-cyan-700 to-slate-900",
  Space:         "from-slate-500 via-blue-700 to-slate-900",
  Conflict:      "from-red-700 via-red-600 to-slate-900",
};

export function HeroImage({
  src,
  alt,
  category,
}: {
  src?: string;
  alt: string;
  category: string;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );

  const gradient = CATEGORY_GRADIENTS[category] || "from-emerald-600 via-teal-700 to-slate-900";

  return (
    <>
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)] animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${state === "loaded" ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          quality={85}
        />
      )}

      {state === "error" && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const mainNavItems = [
  ["Home", "/"],
  ["Blog", "/blog"],
  ["About", "/about"],
  ["Profile", "/profile"],
  ["Contact", "/contact"],
];

const categoryItems = [
  ["World", "/category/World"],
  ["Technology", "/category/Technology"],
  ["AI", "/category/AI"],
  ["Sports", "/category/Sports"],
  ["Entertainment", "/category/Entertainment"],
  ["Movies", "/category/Movies"],
  ["Anime", "/category/Anime"],
  ["Music", "/category/Music"],
  ["Science", "/category/Science"],
  ["Business", "/category/Business"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded bg-white text-sm font-black text-black transition group-hover:bg-emerald-300">
            GI
          </span>
          <span>
            <span className="block text-lg font-black uppercase tracking-wide">Global Insight</span>
            <span className="hidden text-xs uppercase tracking-[0.28em] text-white/45 sm:block">World briefing desk</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-white/70 lg:flex">
          {mainNavItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-1 transition hover:text-white"
            >
              Categories
              <svg className={`h-3 w-3 transition ${showCategories ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategories && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-[#0d1117] p-2 shadow-2xl">
                {categoryItems.map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setShowCategories(false)} className="block rounded px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <form action="/blog" className="ml-auto hidden w-56 items-center rounded border border-white/10 bg-white/[0.06] px-3 py-2 xl:flex">
          <input name="q" aria-label="Search articles" placeholder="Search briefings" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
        </form>

        <button
          aria-label="Toggle color mode"
          onClick={() => setLight((value) => !value)}
          className="h-10 w-10 rounded border border-white/10 bg-white/[0.06] text-sm transition hover:bg-white/10"
        >
          {light ? "D" : "L"}
        </button>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="h-10 w-10 rounded border border-white/10 bg-white/[0.06] text-lg lg:hidden"
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#080b13] px-4 py-4 lg:hidden">
          <form action="/blog" className="mb-4 rounded border border-white/10 bg-white/[0.06] px-3 py-3">
            <input name="q" aria-label="Search articles" placeholder="Search articles" className="w-full bg-transparent text-sm outline-none" />
          </form>
          <nav className="grid gap-1">
            {mainNavItems.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded px-3 py-3 text-white/75 hover:bg-white/10 hover:text-white">
                {label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2">
              <span className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/30">Categories</span>
              {categoryItems.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

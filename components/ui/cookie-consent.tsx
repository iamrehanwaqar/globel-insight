"use client";

import { useEffect, useState } from "react";

const consentStorageKey = "gi_cookie_ok";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setMounted(true);
      setVisible(localStorage.getItem(consentStorageKey) !== "yes");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted || !visible) return null;

  function acceptConsent() {
    localStorage.setItem(consentStorageKey, "yes");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded border border-white/10 bg-[#0b0f19]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:gap-5">
      <p className="text-sm leading-6 text-white/65">
        Global Insight uses cookies for analytics, personalization, and advertising readiness. You can continue with essential and measurement cookies enabled.
      </p>
      <button
        onClick={acceptConsent}
        className="mt-4 shrink-0 rounded bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300 sm:mt-0"
      >
        Accept
      </button>
    </div>
  );
}

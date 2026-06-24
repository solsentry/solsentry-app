"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, LANG_STORAGE_KEY, detectLang, type Lang } from "./i18n-landing";

/**
 * useLang — resolve the active UI language on the client.
 *
 * Returns DEFAULT_LANG on the server / first paint (avoids hydration
 * mismatch), then after mount resolves the real language: a saved
 * preference wins, otherwise navigator.language (pt-* → PT).
 *
 * The SiteTopbar toggle persists + reloads, so a returned value is stable
 * for the lifetime of the page render — no live-change listener needed.
 */
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    try {
      setLang(detectLang(localStorage.getItem(LANG_STORAGE_KEY)));
    } catch {
      /* localStorage unavailable — default stands */
    }
  }, []);
  return lang;
}

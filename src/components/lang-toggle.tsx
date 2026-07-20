"use client";

import { useLang } from "@/lib/lang-context";

export function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      className="flex h-9 items-center rounded-full border border-surface-border px-3 text-xs font-medium text-text-secondary hover:text-text-primary"
    >
      {lang === "en" ? "FA" : "EN"}
    </button>
  );
}

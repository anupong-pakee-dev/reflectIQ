"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { TRANSLATIONS, type Lang, type Translations } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "th-jp",
  setLang: () => {},
  t: TRANSLATIONS["th-jp"],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th-jp");

  useEffect(() => {
    const saved = localStorage.getItem("reflectiq-lang") as Lang | null;
    if (saved && saved in TRANSLATIONS) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("reflectiq-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

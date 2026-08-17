"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, DEFAULT_LOCALE, getTranslation, TranslationKey, formatIDR } from "./index";

interface I18nContextType {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  formatPrice: (num) => formatIDR(num),
});

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale = DEFAULT_LOCALE,
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Check saved cookie or localStorage
    const savedCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("plot_locale="))
      ?.split("=")[1] as Locale | undefined;

    if (savedCookie === "en" || savedCookie === "id") {
      setLocaleState(savedCookie);
    } else {
      // Detect browser language
      const browserLang = navigator.language?.toLowerCase() || "";
      const detected: Locale = browserLang.startsWith("id") ? "id" : "en";
      setLocaleState(detected);
      document.cookie = `plot_locale=${detected}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.cookie = `plot_locale=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Optionally sync with user profile if logged in
    fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLocale: nextLocale }),
    }).catch(() => {});
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(locale, key, params);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatPrice: formatIDR }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { locale, setLocale } = useI18n();

  return (
    <div className={`inline-flex items-center rounded-2xl bg-zinc-900/90 border border-white/10 p-1 ${className}`}>
      <button
        onClick={() => setLocale("id")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
          locale === "id"
            ? "bg-rose-600 text-white shadow"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="Bahasa Indonesia"
      >
        <span>🇮🇩</span>
        <span className="hidden sm:inline">ID</span>
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
          locale === "en"
            ? "bg-rose-600 text-white shadow"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
};

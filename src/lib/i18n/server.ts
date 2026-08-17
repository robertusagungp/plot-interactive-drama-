import { cookies, headers } from "next/headers";
import { Locale, DEFAULT_LOCALE, getTranslation, TranslationKey } from "./index";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("plot_locale")?.value as Locale | undefined;

    if (cookieLocale === "en" || cookieLocale === "id") {
      return cookieLocale;
    }

    const headerStore = await headers();
    const acceptLang = headerStore.get("accept-language")?.toLowerCase() || "";
    if (acceptLang.includes("id")) {
      return "id";
    }

    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function getServerTranslations() {
  const locale = await getServerLocale();
  return {
    locale,
    t: (key: TranslationKey, params?: Record<string, string | number>) =>
      getTranslation(locale, key, params),
  };
}

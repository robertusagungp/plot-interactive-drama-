"use client";

import React, { useEffect, createContext, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  extractAttributionFromParams,
  MarketingAttribution,
  ATTRIBUTION_COOKIE_FIRST,
  ATTRIBUTION_COOKIE_LAST,
  ANONYMOUS_SESSION_COOKIE,
} from "@/lib/analytics/attribution";

interface AttributionContextValue {
  anonymousSessionId: string;
  firstTouch: MarketingAttribution | null;
  lastTouch: MarketingAttribution | null;
}

const AttributionContext = createContext<AttributionContextValue>({
  anonymousSessionId: "",
  firstTouch: null,
  lastTouch: null,
});

export const useAttribution = () => useContext(AttributionContext);

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function AttributionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [anonymousSessionId, setAnonymousSessionId] = useState<string>("");
  const [firstTouch, setFirstTouch] = useState<MarketingAttribution | null>(null);
  const [lastTouch, setLastTouch] = useState<MarketingAttribution | null>(null);

  useEffect(() => {
    // 1. Resolve or initialize Anonymous Session ID
    let anonId = localStorage.getItem(ANONYMOUS_SESSION_COOKIE) || getCookie(ANONYMOUS_SESSION_COOKIE);
    if (!anonId) {
      anonId = "anon_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
      localStorage.setItem(ANONYMOUS_SESSION_COOKIE, anonId);
      setCookie(ANONYMOUS_SESSION_COOKIE, anonId, 90);
    }
    setAnonymousSessionId(anonId);

    // 2. Extract UTMs from current URL
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const currentAttr = extractAttributionFromParams(searchParams, pathname, referrer);

    // 3. First-Touch Attribution
    let first = null;
    const storedFirst = localStorage.getItem(ATTRIBUTION_COOKIE_FIRST) || getCookie(ATTRIBUTION_COOKIE_FIRST);
    if (storedFirst) {
      try {
        first = JSON.parse(storedFirst);
      } catch {}
    }

    if (!first && currentAttr) {
      first = currentAttr;
      const str = JSON.stringify(first);
      localStorage.setItem(ATTRIBUTION_COOKIE_FIRST, str);
      setCookie(ATTRIBUTION_COOKIE_FIRST, str, 90);
    }
    setFirstTouch(first);

    // 4. Last-Touch Attribution
    let last = null;
    if (currentAttr) {
      last = currentAttr;
      const str = JSON.stringify(last);
      localStorage.setItem(ATTRIBUTION_COOKIE_LAST, str);
      setCookie(ATTRIBUTION_COOKIE_LAST, str, 30);
      setLastTouch(last);
    } else {
      const storedLast = localStorage.getItem(ATTRIBUTION_COOKIE_LAST) || getCookie(ATTRIBUTION_COOKIE_LAST);
      if (storedLast) {
        try {
          last = JSON.parse(storedLast);
          setLastTouch(last);
        } catch {}
      }
    }
  }, [pathname, searchParams]);

  return (
    <AttributionContext.Provider value={{ anonymousSessionId, firstTouch, lastTouch }}>
      {children}
    </AttributionContext.Provider>
  );
}

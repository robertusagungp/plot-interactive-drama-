import { db } from "@/lib/db";

export interface MarketingAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPath?: string;
  referrer?: string;
  seenAt?: string;
}

export interface AttributionBundle {
  anonymousSessionId: string;
  firstTouch: MarketingAttribution;
  lastTouch: MarketingAttribution;
}

export const ATTRIBUTION_COOKIE_FIRST = "plot_attr_first";
export const ATTRIBUTION_COOKIE_LAST = "plot_attr_last";
export const ANONYMOUS_SESSION_COOKIE = "plot_anon_session";

/**
 * Parses UTM and marketing tracking parameters from URL search params or headers.
 */
export function extractAttributionFromParams(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams,
  pathname: string = "/",
  referrer: string = ""
): MarketingAttribution | null {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0];
    return val || undefined;
  };

  const source = getParam("utm_source") || (referrer.includes("tiktok.com") ? "tiktok" : undefined);
  const medium = getParam("utm_medium") || (source === "tiktok" ? "organic" : undefined);
  const campaign = getParam("utm_campaign");
  const content = getParam("utm_content");
  const term = getParam("utm_term");

  if (!source && !medium && !campaign && !content && !term && !referrer) {
    return null;
  }

  return {
    source: source || (referrer ? new URL(referrer, "https://plot.id").hostname : "direct"),
    medium: medium || "none",
    campaign: campaign || "none",
    content: content || "none",
    term: term || "none",
    landingPath: pathname,
    referrer: referrer || "direct",
    seenAt: new Date().toISOString(),
  };
}

/**
 * Persists attribution bundle to user database upon registration or login.
 */
export async function saveUserAttribution(
  userId: string,
  attribution: {
    anonymousSessionId?: string;
    firstTouch?: MarketingAttribution;
    lastTouch?: MarketingAttribution;
  }
) {
  try {
    const first = attribution.firstTouch;
    const last = attribution.lastTouch || attribution.firstTouch;

    await db.userAttribution.upsert({
      where: { userId },
      create: {
        userId,
        anonymousSessionId: attribution.anonymousSessionId || null,
        firstTouchSource: first?.source || "direct",
        firstTouchMedium: first?.medium || "none",
        firstTouchCampaign: first?.campaign || "none",
        firstTouchContent: first?.content || "none",
        firstTouchTerm: first?.term || "none",
        firstTouchLandingPath: first?.landingPath || "/",
        firstTouchReferrer: first?.referrer || "direct",
        firstSeenAt: first?.seenAt ? new Date(first.seenAt) : new Date(),
        lastTouchSource: last?.source || "direct",
        lastTouchMedium: last?.medium || "none",
        lastTouchCampaign: last?.campaign || "none",
        lastTouchContent: last?.content || "none",
        lastTouchTerm: last?.term || "none",
        lastTouchLandingPath: last?.landingPath || "/",
        lastTouchReferrer: last?.referrer || "direct",
        lastSeenAt: last?.seenAt ? new Date(last.seenAt) : new Date(),
      },
      update: {
        anonymousSessionId: attribution.anonymousSessionId || undefined,
        lastTouchSource: last?.source || "direct",
        lastTouchMedium: last?.medium || "none",
        lastTouchCampaign: last?.campaign || "none",
        lastTouchContent: last?.content || "none",
        lastTouchTerm: last?.term || "none",
        lastTouchLandingPath: last?.landingPath || "/",
        lastTouchReferrer: last?.referrer || "direct",
        lastSeenAt: new Date(),
      },
    });
  } catch (err) {
    // Fail-safe: attribution tracking failure must never block auth flow
    console.error("[Attribution Error]", err);
  }
}

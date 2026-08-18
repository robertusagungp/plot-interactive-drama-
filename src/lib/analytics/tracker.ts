import { trackTikTokClientEvent } from "@/components/analytics/TikTokPixel";

export type AnalyticsEventType =
  | "landing_view"
  | "story_view"
  | "story_start"
  | "episode_start"
  | "choice_selected"
  | "episode_complete"
  | "story_complete"
  | "ending_unlocked"
  | "registration_started"
  | "registration_completed"
  | "paywall_view"
  | "checkout_started"
  | "subscription_started"
  | "purchase_completed";

export interface AnalyticsPayload {
  storyId?: string;
  storySlug?: string;
  episodeId?: string;
  episodeNumber?: number;
  endingId?: string;
  nodeId?: string;
  choiceOptionId?: string;
  diamondCost?: number;
  coinCost?: number;
  packageId?: string;
  priceIDR?: number;
  paymentMethod?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  anonymousSessionId?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Universal client-side event tracking dispatcher.
 * Dispatches to internal database telemetry and marketing pixel securely.
 */
export async function trackAppEvent(
  eventName: AnalyticsEventType,
  properties: AnalyticsPayload = {},
  eventId?: string
) {
  if (typeof window === "undefined") return;

  const generatedEventId = eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // 1. Scrub sensitive choice dialogue text before any analytics dispatch
  const cleanProperties: Record<string, any> = {
    ...properties,
    timestamp: new Date().toISOString(),
  };
  delete cleanProperties.dialogueText;
  delete cleanProperties.choiceText;
  delete cleanProperties.password;

  // 2. Dispatch to internal analytics database endpoint
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        properties: cleanProperties,
        eventId: generatedEventId,
      }),
    }).catch(() => {});
  } catch {}

  // 3. Map to TikTok Pixel Standard Events
  try {
    switch (eventName) {
      case "story_view":
      case "landing_view":
        trackTikTokClientEvent(
          "ViewContent",
          {
            content_id: properties.storySlug || properties.storyId,
            content_type: "interactive_drama",
            content_name: properties.storySlug,
          },
          generatedEventId
        );
        break;

      case "registration_completed":
        trackTikTokClientEvent(
          "CompleteRegistration",
          {
            status: "success",
          },
          generatedEventId
        );
        break;

      case "checkout_started":
        trackTikTokClientEvent(
          "InitiateCheckout",
          {
            value: properties.priceIDR || 0,
            currency: "IDR",
            content_id: properties.packageId,
          },
          generatedEventId
        );
        break;

      case "subscription_started":
        trackTikTokClientEvent(
          "Subscribe",
          {
            value: properties.priceIDR || 0,
            currency: "IDR",
          },
          generatedEventId
        );
        break;

      // Note: Purchase is tracked authoritatively via server-side CAPI after payment approval!
      default:
        // Internal events stay internal without firing noisy ad pixels
        break;
    }
  } catch (err) {
    console.debug("[Marketing Pixel Dispatch Error]", err);
  }
}

import crypto from "crypto";

export interface TikTokServerEventData {
  eventName: "ViewContent" | "CompleteRegistration" | "Subscribe" | "Purchase" | "InitiateCheckout";
  eventId?: string;
  timestamp?: number;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  currency?: string;
  value?: number;
  contentId?: string;
  contentType?: string;
  contentName?: string;
  properties?: Record<string, any>;
}

function sha256(str: string): string {
  return crypto.createHash("sha256").update(str.trim().toLowerCase()).digest("hex");
}

/**
 * Dispatches authoritative server-to-server event to TikTok Events API (CAPI).
 */
export async function sendTikTokServerEvent(eventData: TikTokServerEventData): Promise<{
  success: boolean;
  status: string;
  message?: string;
}> {
  const pixelId = process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    // Configuration absent - dry run mode for development / unconfigured environments
    return {
      success: true,
      status: "SKIPPED_UNCONFIGURED",
      message: "TikTok Events API credentials not configured (dry run).",
    };
  }

  try {
    const eventId = eventData.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const eventTimestamp = eventData.timestamp || Math.floor(Date.now() / 1000);

    const payload = {
      event_source: "web",
      event_source_id: pixelId,
      data: [
        {
          event: eventData.eventName,
          event_time: eventTimestamp,
          event_id: eventId,
          user: {
            external_id: eventData.userId ? sha256(eventData.userId) : undefined,
            email: eventData.userEmail ? sha256(eventData.userEmail) : undefined,
            ip: eventData.ipAddress || undefined,
            user_agent: eventData.userAgent || undefined,
          },
          properties: {
            currency: eventData.currency || "IDR",
            value: eventData.value || undefined,
            contents: eventData.contentId
              ? [
                  {
                    content_id: eventData.contentId,
                    content_type: eventData.contentType || "product",
                    content_name: eventData.contentName || undefined,
                    price: eventData.value || undefined,
                  },
                ]
              : undefined,
            ...eventData.properties,
          },
        },
      ],
    };

    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.code === 0) {
      return { success: true, status: "DELIVERED" };
    } else {
      console.warn("[TikTok CAPI Warning]", result.message || result);
      return { success: false, status: "API_ERROR", message: result.message };
    }
  } catch (err: any) {
    console.error("[TikTok CAPI Exception]", err?.message || err);
    return { success: false, status: "NETWORK_ERROR", message: err?.message };
  }
}

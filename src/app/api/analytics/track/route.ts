import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { trackEvent } from "@/lib/services/analytics";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { eventName, properties, eventId } = body;

    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ error: "Invalid eventName" }, { status: 400 });
    }

    // Record internal telemetry event
    await trackEvent(eventName, { ...properties, eventId }, user?.id);

    // Increment high-level story counters asynchronously
    if (properties?.storySlug || properties?.storyId) {
      try {
        const whereClause = properties.storyId
          ? { id: properties.storyId }
          : { slug: properties.storySlug };

        if (eventName === "story_view" || eventName === "landing_view") {
          await db.story.updateMany({
            where: whereClause,
            data: { viewCount: { increment: 1 } },
          });
        } else if (eventName === "story_start" || eventName === "episode_start") {
          await db.story.updateMany({
            where: whereClause,
            data: { startCount: { increment: 1 } },
          });
        } else if (eventName === "story_complete") {
          await db.story.updateMany({
            where: whereClause,
            data: { completionCount: { increment: 1 } },
          });
        }
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Fail-open: telemetry errors must never crash client
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}

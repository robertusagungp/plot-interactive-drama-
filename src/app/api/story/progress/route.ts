import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUserStoryProgress } from "@/lib/services/story";
import { z } from "zod";

const ProgressSchema = z.object({
  storyId: z.string(),
  episodeId: z.string(),
  episodeNumber: z.number(),
  lastNodeId: z.string().optional(),
  isCompleted: z.boolean().optional(),
  endingSlug: z.string().optional(),
  stats: z.record(z.string(), z.number()).optional(),
  relationships: z.record(z.string(), z.any()).optional(),
  choicesMade: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      // Guest progress: return ok so client keeps in local storage
      return NextResponse.json({ success: true, guest: true });
    }

    const body = await req.json();
    const parsed = ProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
    }

    await saveUserStoryProgress({
      userId: user.id,
      ...parsed.data,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save progress" }, { status: 500 });
  }
}

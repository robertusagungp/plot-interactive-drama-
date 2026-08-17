import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { unlockEpisodeForUser } from "@/lib/services/wallet";
import { z } from "zod";

const UnlockSchema = z.object({
  episodeId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to unlock episodes" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UnlockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid episode ID" }, { status: 400 });
    }

    const result = await unlockEpisodeForUser(user.id, parsed.data.episodeId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to unlock episode" }, { status: 400 });
    }

    return NextResponse.json({ success: true, remainingCoins: result.remainingCoins });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

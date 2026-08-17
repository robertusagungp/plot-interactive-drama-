import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordUserChoice, getChoiceAggregation } from "@/lib/services/analytics";
import { z } from "zod";

const ChoiceSchema = z.object({
  storyId: z.string(),
  episodeId: z.string(),
  nodeId: z.string(),
  choiceOptionId: z.string(),
  choiceOptionText: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = ChoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid choice payload" }, { status: 400 });
    }

    if (user) {
      await recordUserChoice({
        userId: user.id,
        ...parsed.data,
      });
    }

    // Fetch aggregate statistics for this node
    const percentages = await getChoiceAggregation(parsed.data.nodeId);

    return NextResponse.json({ success: true, percentages });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record choice" }, { status: 500 });
  }
}

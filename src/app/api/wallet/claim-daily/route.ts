import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { claimDailyReward, getDailyRewardStatus } from "@/lib/services/rewards";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const result = await claimDailyReward(user.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const newStatus = await getDailyRewardStatus(user.id);

    return NextResponse.json({
      success: true,
      claimedReward: result.claimedReward,
      status: newStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to claim daily reward" }, { status: 500 });
  }
}

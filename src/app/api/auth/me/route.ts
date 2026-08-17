import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateUserWallet } from "@/lib/services/wallet";
import { getDailyRewardStatus } from "@/lib/services/rewards";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const [wallet, rewardStatus, profile] = await Promise.all([
    getOrCreateUserWallet(user.id),
    getDailyRewardStatus(user.id),
    db.profile.findUnique({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({
    user: {
      ...user,
      profile,
      wallet: {
        coins: wallet.coins,
        diamonds: wallet.diamonds,
      },
      dailyReward: rewardStatus,
    },
  });
}

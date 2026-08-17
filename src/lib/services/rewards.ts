import { db } from "@/lib/db";
import { grantCurrency } from "./wallet";

export const DAILY_REWARD_SCHEDULE = [
  { day: 1, coins: 10, diamonds: 0 },
  { day: 2, coins: 10, diamonds: 0 },
  { day: 3, coins: 15, diamonds: 1 },
  { day: 4, coins: 15, diamonds: 0 },
  { day: 5, coins: 20, diamonds: 2 },
  { day: 6, coins: 20, diamonds: 0 },
  { day: 7, coins: 50, diamonds: 5 },
];

export async function getDailyRewardStatus(userId: string) {
  let rewardState = await db.dailyRewardState.findUnique({
    where: { userId },
  });

  if (!rewardState) {
    rewardState = await db.dailyRewardState.create({
      data: {
        userId,
        streak: 0,
        currentDayIndex: 1,
        totalClaimed: 0,
      },
    });
  }

  const now = new Date();
  let isClaimable = true;
  let nextDayIndex = rewardState.currentDayIndex;

  if (rewardState.lastClaimedAt) {
    const lastClaim = new Date(rewardState.lastClaimedAt);
    const diffHours = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

    const isSameDay =
      lastClaim.getFullYear() === now.getFullYear() &&
      lastClaim.getMonth() === now.getMonth() &&
      lastClaim.getDate() === now.getDate();

    if (isSameDay) {
      isClaimable = false;
    } else if (diffHours > 48) {
      // Streak broken
      nextDayIndex = 1;
    } else {
      // Next day in streak
      nextDayIndex = rewardState.currentDayIndex > 7 ? 1 : rewardState.currentDayIndex;
    }
  }

  return {
    state: rewardState,
    isClaimable,
    currentDay: nextDayIndex,
    streak: rewardState.streak,
    schedule: DAILY_REWARD_SCHEDULE,
  };
}

export async function claimDailyReward(userId: string) {
  const status = await getDailyRewardStatus(userId);
  if (!status.isClaimable) {
    return { success: false, error: "Daily reward already claimed today. Come back tomorrow!" };
  }

  const reward = DAILY_REWARD_SCHEDULE[status.currentDay - 1] || DAILY_REWARD_SCHEDULE[0];

  // Grant currency
  if (reward.coins > 0) {
    await grantCurrency(userId, "COINS", reward.coins, "DAILY_REWARD", `Day ${status.currentDay} reward`);
  }
  if (reward.diamonds > 0) {
    await grantCurrency(userId, "DIAMONDS", reward.diamonds, "DAILY_REWARD", `Day ${status.currentDay} reward`);
  }

  // Update State
  const nextDay = status.currentDay >= 7 ? 1 : status.currentDay + 1;
  const updatedState = await db.dailyRewardState.update({
    where: { userId },
    data: {
      lastClaimedAt: new Date(),
      streak: { increment: 1 },
      currentDayIndex: nextDay,
      totalClaimed: { increment: 1 },
    },
  });

  return {
    success: true,
    claimedReward: reward,
    newStreak: updatedState.streak,
    nextDayIndex: nextDay,
  };
}

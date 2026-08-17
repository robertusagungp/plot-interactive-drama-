import { db } from "@/lib/db";
import { grantCurrency } from "./wallet";

export const DEFAULT_ACHIEVEMENTS = [
  {
    code: "FIRST_CHOICE",
    title: "Taking the Reins",
    description: "Make your very first story choice in PLOT.",
    icon: "sparkles",
    coinReward: 10,
    diamondReward: 1,
    category: "STORY",
  },
  {
    code: "FIRST_EPISODE",
    title: "Hooked",
    description: "Complete your first dramatic episode.",
    icon: "book-open",
    coinReward: 15,
    diamondReward: 2,
    category: "STORY",
  },
  {
    code: "FIRST_STORY_COMPLETE",
    title: "The Final Curtain",
    description: "Reach an ending in any interactive visual story.",
    icon: "trophy",
    coinReward: 30,
    diamondReward: 5,
    category: "STORY",
  },
  {
    code: "HOPELESS_ROMANTIC",
    title: "Hopeless Romantic",
    description: "Reach 80+ Love with Adrian Hartono.",
    icon: "heart",
    coinReward: 25,
    diamondReward: 4,
    category: "RELATIONSHIP",
  },
  {
    code: "HEARTBREAKER",
    title: "Cold Reckoning",
    description: "Reach 80+ Revenge against your rivals.",
    icon: "zap",
    coinReward: 25,
    diamondReward: 4,
    category: "RELATIONSHIP",
  },
  {
    code: "SECRET_ENDING",
    title: "The Puppet Master",
    description: "Discover a secret alternative storyline ending.",
    icon: "crown",
    coinReward: 40,
    diamondReward: 10,
    category: "SECRET",
  },
  {
    code: "COMPLETIONIST",
    title: "Master of Destiny",
    description: "Unlock all endings for I Married My Enemy.",
    icon: "award",
    coinReward: 50,
    diamondReward: 15,
    category: "GENERAL",
  },
];

export async function unlockAchievementForUser(userId: string, achievementCode: string) {
  try {
    const achievement = await db.achievement.findUnique({
      where: { code: achievementCode },
    });

    if (!achievement) return { unlocked: false };

    // Check if user already unlocked
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (existing) return { unlocked: false };

    await db.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });

    // Grant rewards
    if (achievement.coinReward > 0) {
      await grantCurrency(
        userId,
        "COINS",
        achievement.coinReward,
        "MISSION_REWARD",
        `Achievement: ${achievement.title}`
      );
    }
    if (achievement.diamondReward > 0) {
      await grantCurrency(
        userId,
        "DIAMONDS",
        achievement.diamondReward,
        "MISSION_REWARD",
        `Achievement: ${achievement.title}`
      );
    }

    return {
      unlocked: true,
      achievement,
    };
  } catch {
    return { unlocked: false };
  }
}

export async function getUserAchievements(userId: string) {
  const allAchievements = await db.achievement.findMany({
    orderBy: { createdAt: "asc" },
  });

  const unlocked = await db.userAchievement.findMany({
    where: { userId },
  });

  const unlockedMap = new Set(unlocked.map((u) => u.achievementId));

  return allAchievements.map((ach) => ({
    ...ach,
    isUnlocked: unlockedMap.has(ach.id),
    unlockedAt: unlocked.find((u) => u.achievementId === ach.id)?.unlockedAt,
  }));
}

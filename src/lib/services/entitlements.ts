import { db } from "@/lib/db";

export interface UserEntitlements {
  hasActiveSubscription: boolean;
  subscriptionTier?: "PLUS" | "VIP";
  subscriptionExpiresAt?: Date;
  maxTimelineSlots: number;
  canAccessBonusPOV: boolean;
  canAccessEarlyEpisodes: boolean;
  isAdFree: boolean;
  premiumSceneDiscount: number; // percentage e.g. 0 or 20
}

export async function getUserEntitlements(userId?: string | null): Promise<UserEntitlements> {
  if (!userId) {
    return {
      hasActiveSubscription: false,
      maxTimelineSlots: 1,
      canAccessBonusPOV: false,
      canAccessEarlyEpisodes: false,
      isAdFree: false,
      premiumSceneDiscount: 0,
    };
  }

  const sub = await db.userSubscription.findUnique({
    where: { userId },
  });

  const now = new Date();
  const isActive = !!sub && sub.status === "ACTIVE" && sub.expiresAt > now;

  if (isActive) {
    const isVip = sub.tier === "VIP";
    return {
      hasActiveSubscription: true,
      subscriptionTier: isVip ? "VIP" : "PLUS",
      subscriptionExpiresAt: sub.expiresAt,
      maxTimelineSlots: isVip ? 5 : 3,
      canAccessBonusPOV: true,
      canAccessEarlyEpisodes: true,
      isAdFree: true,
      premiumSceneDiscount: isVip ? 50 : 20,
    };
  }

  return {
    hasActiveSubscription: false,
    maxTimelineSlots: 1,
    canAccessBonusPOV: false,
    canAccessEarlyEpisodes: false,
    isAdFree: false,
    premiumSceneDiscount: 0,
  };
}

export async function verifyEpisodeAccess(
  userId: string | null,
  episodeId: string
): Promise<{ canAccess: boolean; reason?: string }> {
  const episode = await db.episode.findUnique({
    where: { id: episodeId },
    select: { id: true, number: true, unlockType: true, coinPrice: true, diamondPrice: true },
  });

  if (!episode) {
    return { canAccess: false, reason: "Episode not found" };
  }

  // Free episodes (Ep 1-3 or 0 price) are always accessible
  if (episode.unlockType === "FREE" || (episode.coinPrice === 0 && episode.diamondPrice === 0)) {
    return { canAccess: true };
  }

  if (!userId) {
    return { canAccess: false, reason: "Login required to unlock paid episode" };
  }

  // Check active subscription
  const entitlements = await getUserEntitlements(userId);
  if (entitlements.hasActiveSubscription) {
    return { canAccess: true };
  }

  // Check specific episode unlock purchase
  const unlock = await db.episodeUnlock.findUnique({
    where: {
      userId_episodeId: {
        userId,
        episodeId,
      },
    },
  });

  if (unlock) {
    return { canAccess: true };
  }

  return { canAccess: false, reason: "Episode is locked. Unlock with Coins or subscribe to PLOT+." };
}

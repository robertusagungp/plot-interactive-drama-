import { db } from "@/lib/db";

export interface WalletBalance {
  coins: number;
  diamonds: number;
}

export async function getOrCreateUserWallet(userId: string) {
  let wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    wallet = await db.wallet.create({
      data: {
        userId,
        coins: 100, // Seed welcome bonus
        diamonds: 20,
      },
    });

    // Record welcome bonus transaction
    await db.walletTransaction.createMany({
      data: [
        {
          walletId: wallet.id,
          currency: "COINS",
          amount: 100,
          type: "SIGNUP_BONUS",
          balanceAfter: 100,
          description: "Welcome gift: 100 coins",
        },
        {
          walletId: wallet.id,
          currency: "DIAMONDS",
          amount: 20,
          type: "SIGNUP_BONUS",
          balanceAfter: 20,
          description: "Welcome gift: 20 diamonds",
        },
      ],
    });
  }

  return wallet;
}

export async function unlockEpisodeForUser(
  userId: string,
  episodeId: string
): Promise<{ success: boolean; error?: string; remainingCoins?: number }> {
  const episode = await db.episode.findUnique({
    where: { id: episodeId },
  });

  if (!episode) {
    return { success: false, error: "Episode not found" };
  }

  // If already free, allow access
  if (episode.unlockType === "FREE" || episode.coinPrice === 0) {
    return { success: true };
  }

  // Check if user already unlocked
  const existingUnlock = await db.episodeUnlock.findUnique({
    where: {
      userId_episodeId: {
        userId,
        episodeId,
      },
    },
  });

  if (existingUnlock) {
    return { success: true }; // Already unlocked, no charge
  }

  // Deduct coins atomically via transaction
  try {
    return await db.$transaction(async (tx) => {
      let wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId, coins: 100, diamonds: 20 },
        });
      }

      if (wallet.coins < episode.coinPrice) {
        return { success: false, error: "Insufficient coins" };
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          coins: { decrement: episode.coinPrice },
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          currency: "COINS",
          amount: -episode.coinPrice,
          type: "EPISODE_UNLOCK",
          referenceId: episode.id,
          balanceAfter: updatedWallet.coins,
          description: `Unlocked Episode ${episode.number}: ${episode.title}`,
        },
      });

      await tx.episodeUnlock.create({
        data: {
          userId,
          episodeId,
          coinSpent: episode.coinPrice,
          diamondSpent: 0,
        },
      });

      return {
        success: true,
        remainingCoins: updatedWallet.coins,
      };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to unlock episode" };
  }
}

export async function spendCurrency(
  userId: string,
  currency: "COINS" | "DIAMONDS",
  amount: number,
  type: string,
  description?: string,
  referenceId?: string
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  if (amount <= 0) return { success: true };

  try {
    return await db.$transaction(async (tx) => {
      let wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId, coins: 100, diamonds: 20 },
        });
      }

      const currentBalance = currency === "COINS" ? wallet.coins : wallet.diamonds;
      if (currentBalance < amount) {
        return { success: false, error: `Insufficient ${currency.toLowerCase()}` };
      }

      const updateData =
        currency === "COINS"
          ? { coins: { decrement: amount } }
          : { diamonds: { decrement: amount } };

      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: updateData,
      });

      const newBalance = currency === "COINS" ? updated.coins : updated.diamonds;

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          currency,
          amount: -amount,
          type,
          referenceId,
          balanceAfter: newBalance,
          description: description || `Spent ${amount} ${currency.toLowerCase()}`,
        },
      });

      return { success: true, newBalance };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to process currency spending" };
  }
}

export async function grantCurrency(
  userId: string,
  currency: "COINS" | "DIAMONDS",
  amount: number,
  type: string,
  description?: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance?: number }> {
  if (amount <= 0) return { success: true };

  return await db.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { userId, coins: 100, diamonds: 20 },
      });
    }

    const updateData =
      currency === "COINS"
        ? { coins: { increment: amount } }
        : { diamonds: { increment: amount } };

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: updateData,
    });

    const newBalance = currency === "COINS" ? updated.coins : updated.diamonds;

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        currency,
        amount,
        type,
        referenceId,
        balanceAfter: newBalance,
        description: description || `Granted ${amount} ${currency.toLowerCase()}`,
      },
    });

    return { success: true, newBalance };
  });
}

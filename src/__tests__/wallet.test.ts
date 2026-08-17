import { test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../lib/db";
import { spendCurrency, unlockEpisodeForUser } from "../lib/services/wallet";

test("Wallet - Coin & Diamond Deductions with Authoritative Server Balance", async () => {
  // 1. Create temporary test user with 100 coins and 50 diamonds
  const testUser = await db.user.create({
    data: {
      email: `test_wallet_${Date.now()}@plot.test`,
      name: "Wallet Tester",
      role: "USER",
      wallet: {
        create: {
          coins: 100,
          diamonds: 50,
        },
      },
    },
    include: { wallet: true },
  });

  const story = await db.story.findFirst();
  if (!story) throw new Error("No stories found in database");

  const epNum1 = Math.floor(Math.random() * 900000) + 10000;
  const epNum2 = epNum1 + 1;

  const testEpisode = await db.episode.create({
    data: {
      storyId: story.id,
      number: epNum1,
      title: "Test Episode 15 Coins",
      unlockType: "COIN_LOCKED",
      coinPrice: 15,
      status: "PUBLISHED",
    },
  });

  const secondEpisode = await db.episode.create({
    data: {
      storyId: story.id,
      number: epNum2,
      title: "Test Episode 2",
      unlockType: "COIN_LOCKED",
      coinPrice: 15,
      status: "PUBLISHED",
    },
  });

  try {
    // 2. Test Diamond Spending: 50 - 15 = 35
    const diamondResult = await spendCurrency(
      testUser.id,
      "DIAMONDS",
      15,
      "PREMIUM_CHOICE",
      "Selected premium choice in test"
    );

    assert.equal(diamondResult.success, true);
    assert.equal(diamondResult.newBalance, 35, "Diamonds balance must be exactly 35 after spending 15");

    // 3. Test Insufficient Diamonds: Attempt to spend 40 diamonds when balance is 35
    const overspendDiamond = await spendCurrency(
      testUser.id,
      "DIAMONDS",
      40,
      "PREMIUM_CHOICE",
      "Overspending diamonds"
    );
    assert.equal(overspendDiamond.success, false);
    assert.ok(overspendDiamond.error?.includes("Insufficient"), "Must fail when diamonds balance < required");

    // 4. Test Episode Coin Unlock: 100 - 15 = 85
    const unlockResult = await unlockEpisodeForUser(testUser.id, testEpisode.id);
    assert.equal(unlockResult.success, true);
    assert.equal(unlockResult.remainingCoins, 85, "Coins balance must be exactly 85 after unlocking 15-coin episode");

    // 5. Test Duplicate Unlock Prevention
    const duplicateResult = await unlockEpisodeForUser(testUser.id, testEpisode.id);
    assert.equal(duplicateResult.success, true);
    assert.equal(duplicateResult.remainingCoins, 85, "Coins must NOT be deducted on duplicate unlock");

    // 6. Test Insufficient Coins
    // Drain user coins to 5
    await db.wallet.update({
      where: { userId: testUser.id },
      data: { coins: 5 },
    });

    const insufficientCoinResult = await unlockEpisodeForUser(testUser.id, secondEpisode.id);
    assert.equal(insufficientCoinResult.success, false);
    assert.ok(insufficientCoinResult.error?.includes("Insufficient"), "Must fail when coins < coinPrice");
  } finally {
    // Clean up test user & wallet & episodes
    await db.walletTransaction.deleteMany({ where: { wallet: { userId: testUser.id } } });
    await db.episodeUnlock.deleteMany({ where: { userId: testUser.id } });
    await db.episode.deleteMany({ where: { id: { in: [testEpisode.id, secondEpisode.id] } } });
    await db.wallet.deleteMany({ where: { userId: testUser.id } });
    await db.user.delete({ where: { id: testUser.id } });
  }
});

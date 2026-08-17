import { test } from "node:test";
import assert from "node:assert/strict";
import { DAILY_REWARD_SCHEDULE } from "../lib/services/rewards";
import { COIN_PACKAGES, DIAMOND_PACKAGES } from "../lib/services/payments";

test("Daily Reward Schedule - 7-Day Cycle", () => {
  assert.equal(DAILY_REWARD_SCHEDULE.length, 7);
  assert.equal(DAILY_REWARD_SCHEDULE[0].day, 1);
  assert.equal(DAILY_REWARD_SCHEDULE[0].coins, 10);
  assert.equal(DAILY_REWARD_SCHEDULE[6].day, 7);
  assert.equal(DAILY_REWARD_SCHEDULE[6].coins, 50);
  assert.equal(DAILY_REWARD_SCHEDULE[6].diamonds, 5);
});

test("Payment Packages Definition - Currency Integrity", () => {
  COIN_PACKAGES.forEach((pkg) => {
    assert.equal(pkg.currency, "COINS");
    assert.ok(pkg.amount > 0);
    assert.ok(pkg.priceUsd > 0);
  });

  DIAMOND_PACKAGES.forEach((pkg) => {
    assert.equal(pkg.currency, "DIAMONDS");
    assert.ok(pkg.amount > 0);
    assert.ok(pkg.priceUsd > 0);
  });
});

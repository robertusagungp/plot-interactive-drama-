import { grantCurrency } from "./wallet";

export interface CurrencyPackage {
  id: string;
  currency: "COINS" | "DIAMONDS";
  amount: number;
  bonusAmount: number;
  priceUsd: number;
  title: string;
  badge?: string;
}

export const COIN_PACKAGES: CurrencyPackage[] = [
  {
    id: "coins_starter",
    currency: "COINS",
    amount: 100,
    bonusAmount: 0,
    priceUsd: 1.99,
    title: "Pocket Pouch",
  },
  {
    id: "coins_popular",
    currency: "COINS",
    amount: 300,
    bonusAmount: 50,
    priceUsd: 4.99,
    title: "Reader's Chest",
    badge: "MOST POPULAR",
  },
  {
    id: "coins_vault",
    currency: "COINS",
    amount: 750,
    bonusAmount: 150,
    priceUsd: 9.99,
    title: "Grand Vault",
    badge: "BEST VALUE",
  },
];

export const DIAMOND_PACKAGES: CurrencyPackage[] = [
  {
    id: "diamonds_spark",
    currency: "DIAMONDS",
    amount: 25,
    bonusAmount: 0,
    priceUsd: 2.99,
    title: "Crystal Spark",
  },
  {
    id: "diamonds_cache",
    currency: "DIAMONDS",
    amount: 65,
    bonusAmount: 15,
    priceUsd: 6.99,
    title: "Jeweled Cache",
    badge: "POPULAR",
  },
  {
    id: "diamonds_treasury",
    currency: "DIAMONDS",
    amount: 150,
    bonusAmount: 40,
    priceUsd: 14.99,
    title: "Royal Treasury",
    badge: "MAX VALUE",
  },
];

export interface PaymentWebhookPayload {
  provider: "stripe" | "apple_iap" | "google_play" | "mock";
  externalTransactionId: string;
  packageId: string;
  userId: string;
  amountCents: number;
  status: "COMPLETED" | "FAILED" | "PENDING";
}

export class PaymentService {
  /**
   * Mock/Dev top-up purchase for testing wallet mechanics in development
   */
  static async executeDevMockPurchase(
    userId: string,
    pkg: CurrencyPackage
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ENABLE_DEMO_PURCHASES !== "true") {
      return { success: false, error: "Mock purchases are disabled in production" };
    }

    const totalGranted = pkg.amount + pkg.bonusAmount;
    const result = await grantCurrency(
      userId,
      pkg.currency,
      totalGranted,
      "PURCHASE",
      `Purchased package: ${pkg.title} (+${totalGranted} ${pkg.currency.toLowerCase()})`,
      `mock_${Date.now()}`
    );

    return { success: true, newBalance: result.newBalance };
  }
}

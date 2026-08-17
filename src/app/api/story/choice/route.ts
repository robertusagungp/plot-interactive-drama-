import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordUserChoice, getChoiceAggregation } from "@/lib/services/analytics";
import { spendCurrency, getOrCreateUserWallet } from "@/lib/services/wallet";
import { z } from "zod";

const ChoiceSchema = z.object({
  storyId: z.string(),
  episodeId: z.string(),
  nodeId: z.string(),
  choiceOptionId: z.string(),
  choiceOptionText: z.string(),
  coinCost: z.number().optional().default(0),
  diamondCost: z.number().optional().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = ChoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid choice payload" }, { status: 400 });
    }

    const { storyId, episodeId, nodeId, choiceOptionId, choiceOptionText, coinCost, diamondCost } =
      parsed.data;

    let updatedWalletBalance: { coins?: number; diamonds?: number } = {};

    if (user) {
      const wallet = await getOrCreateUserWallet(user.id);

      // Validate and deduct Diamonds for premium choice
      if (diamondCost > 0) {
        if (wallet.diamonds < diamondCost) {
          return NextResponse.json(
            { error: "INSUFFICIENT_DIAMONDS", message: "You don't have enough diamonds." },
            { status: 400 }
          );
        }

        const spendResult = await spendCurrency(
          user.id,
          "DIAMONDS",
          diamondCost,
          "PREMIUM_CHOICE",
          `Premium Choice in Episode: ${choiceOptionText.substring(0, 40)}`,
          `${episodeId}_${nodeId}_${choiceOptionId}`
        );

        if (!spendResult.success) {
          return NextResponse.json({ error: spendResult.error }, { status: 400 });
        }
        updatedWalletBalance.diamonds = spendResult.newBalance;
      }

      // Validate and deduct Coins if choice costs coins
      if (coinCost > 0) {
        if (wallet.coins < coinCost) {
          return NextResponse.json(
            { error: "INSUFFICIENT_COINS", message: "You don't have enough coins." },
            { status: 400 }
          );
        }

        const spendResult = await spendCurrency(
          user.id,
          "COINS",
          coinCost,
          "PREMIUM_CHOICE",
          `Choice in Episode: ${choiceOptionText.substring(0, 40)}`,
          `${episodeId}_${nodeId}_${choiceOptionId}`
        );

        if (!spendResult.success) {
          return NextResponse.json({ error: spendResult.error }, { status: 400 });
        }
        updatedWalletBalance.coins = spendResult.newBalance;
      }

      await recordUserChoice({
        userId: user.id,
        storyId,
        episodeId,
        nodeId,
        choiceOptionId,
        choiceOptionText,
      });
    }

    // Fetch aggregate statistics for this node
    const percentages = await getChoiceAggregation(nodeId);

    return NextResponse.json({
      success: true,
      percentages,
      wallet: updatedWalletBalance,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record choice" }, { status: 500 });
  }
}

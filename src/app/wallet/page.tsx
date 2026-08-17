import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateUserWallet } from "@/lib/services/wallet";
import { getDailyRewardStatus } from "@/lib/services/rewards";
import { COIN_PACKAGES, DIAMOND_PACKAGES } from "@/lib/services/payments";
import Link from "next/link";
import { Coins, Gem, Gift, History, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { TopupClient } from "@/components/wallet/TopupClient";

export default async function WalletPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <Coins className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-black text-white">PLOT Wallet</h1>
        <p className="text-xs text-zinc-400">
          Sign in to access your Coins, Diamonds, daily rewards, and unlocked episodes.
        </p>
        <Link
          href="/login"
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs transition shadow-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const [wallet, transactions, dailyStatus] = await Promise.all([
    getOrCreateUserWallet(user.id),
    db.walletTransaction.findMany({
      where: { wallet: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    getDailyRewardStatus(user.id),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Vault & Balances</h1>
        <p className="text-xs text-zinc-400">
          Manage your virtual currencies and view complete transaction history.
        </p>
      </div>

      {/* Balances Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Coins className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">
                Coins Balance
              </span>
              <h2 className="text-3xl font-black text-amber-300">
                {wallet.coins}
              </h2>
            </div>
          </div>
          <span className="text-xs text-zinc-500">Unlocks Episodes</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/30 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Gem className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">
                Diamonds Balance
              </span>
              <h2 className="text-3xl font-black text-purple-300">
                {wallet.diamonds}
              </h2>
            </div>
          </div>
          <span className="text-xs text-zinc-500">Spicy Choices</span>
        </div>
      </div>

      {/* Interactive Topup & Packages Section */}
      <TopupClient />

      {/* Transaction History Ledger */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-bold text-white">Transaction History</h3>
        </div>

        {transactions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-200">
                      {tx.description || tx.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString()} at{" "}
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black ${
                        isCredit ? "text-emerald-400" : "text-zinc-400"
                      }`}
                    >
                      {isCredit ? `+${tx.amount}` : tx.amount}{" "}
                      {tx.currency === "COINS" ? "Coins" : "Diamonds"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-zinc-950/60 text-center text-xs text-zinc-500">
            No transactions yet.
          </div>
        )}
      </section>
    </div>
  );
}

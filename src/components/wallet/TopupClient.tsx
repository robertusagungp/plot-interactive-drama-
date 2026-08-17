"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gem, Sparkles, Plus } from "lucide-react";
import { COIN_PACKAGES, DIAMOND_PACKAGES } from "@/lib/services/payments";

export const TopupClient: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"coins" | "diamonds">("coins");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const handleBuy = async (pkgId: string) => {
    setLoadingId(pkgId);
    setMsg(null);
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkgId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Added ${data.package.title} to your vault!`);
        router.refresh();
      } else {
        setMsg(data.error || "Purchase failed");
      }
    } catch {
      setMsg("Connection failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-zinc-950 border border-white/10 p-6 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white">Get More Currency</h3>
          <p className="text-xs text-zinc-400">
            Instant top-up for unlocking locked chapters and premium story paths.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-zinc-900 p-1 border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab("coins")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "coins"
                ? "bg-amber-500 text-zinc-950 shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Coins
          </button>
          <button
            onClick={() => setActiveTab("diamonds")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "diamonds"
                ? "bg-purple-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Diamonds
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
          {msg}
        </div>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(activeTab === "coins" ? COIN_PACKAGES : DIAMOND_PACKAGES).map((pkg) => (
          <div
            key={pkg.id}
            className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between hover:border-white/20 transition group relative"
          >
            {pkg.badge && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {pkg.badge}
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                {activeTab === "coins" ? (
                  <Coins className="w-5 h-5 text-amber-400" />
                ) : (
                  <Gem className="w-5 h-5 text-purple-400" />
                )}
                <span className="font-extrabold text-sm text-white">
                  {pkg.title}
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black text-white">
                  {pkg.amount}
                </span>
                {pkg.bonusAmount > 0 && (
                  <span className="text-xs font-bold text-emerald-400">
                    +{pkg.bonusAmount} Bonus
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleBuy(pkg.id)}
              disabled={loadingId !== null}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                activeTab === "coins"
                  ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              {loadingId === pkg.id ? "Processing..." : `Get for $${pkg.priceUsd}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

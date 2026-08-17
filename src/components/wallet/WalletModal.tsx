"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, Gem, Sparkles, Check, ArrowRight } from "lucide-react";
import { COIN_PACKAGES, DIAMOND_PACKAGES } from "@/lib/services/payments";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  diamonds: number;
  onSuccess?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  coins,
  diamonds,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"coins" | "diamonds">("coins");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handlePurchase = async (pkgId: string) => {
    setPurchasingId(pkgId);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkgId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Successfully added ${data.package.title}!`);
        if (onSuccess) onSuccess();
      } else {
        setStatusMsg(data.error || "Purchase failed");
      }
    } catch {
      setStatusMsg("Failed to connect to checkout service");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Balance */}
            <div className="mb-4">
              <h3 className="text-xl font-black text-white">PLOT Vault</h3>
              <p className="text-xs text-zinc-400">
                Unlock episodes with Coins and choose spicy premium paths with Diamonds.
              </p>
            </div>

            {/* Current Balance Bar */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Coins
                  </span>
                  <span className="text-base font-extrabold text-amber-300">
                    {coins}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <Gem className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Diamonds
                  </span>
                  <span className="text-base font-extrabold text-purple-300">
                    {diamonds}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-2xl bg-zinc-800/80 p-1 mb-4 border border-white/5">
              <button
                onClick={() => setActiveTab("coins")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "coins"
                    ? "bg-amber-500 text-zinc-950 shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                Coin Packs
              </button>
              <button
                onClick={() => setActiveTab("diamonds")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "diamonds"
                    ? "bg-purple-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                Diamond Packs
              </button>
            </div>

            {statusMsg && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
                {statusMsg}
              </div>
            )}

            {/* Package Cards */}
            <div className="flex flex-col gap-2.5">
              {(activeTab === "coins" ? COIN_PACKAGES : DIAMOND_PACKAGES).map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/60 border border-white/5 hover:border-white/20 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeTab === "coins"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {activeTab === "coins" ? (
                        <Coins className="w-5 h-5" />
                      ) : (
                        <Gem className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-100">
                          {pkg.title}
                        </span>
                        {pkg.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {pkg.amount}{" "}
                        {pkg.bonusAmount > 0 ? `+ ${pkg.bonusAmount} Free Bonus` : ""}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasingId !== null}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                      activeTab === "coins"
                        ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                        : "bg-purple-600 hover:bg-purple-500 text-white"
                    }`}
                  >
                    {purchasingId === pkg.id ? "Adding..." : `$${pkg.priceUsd}`}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500 text-center">
              💡 Dev Mode Active: Instant top-up testing enabled.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

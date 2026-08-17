"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, Gem, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEEDED_COIN_PACKAGES, SEEDED_DIAMOND_PACKAGES } from "@/lib/services/payments";
import { useI18n } from "@/lib/i18n/context";

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
  const { t, locale, formatPrice } = useI18n();
  const [activeTab, setActiveTab] = useState<"coins" | "diamonds">("coins");

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
              <h3 className="text-xl font-black text-white">{t("navWallet")}</h3>
              <p className="text-xs text-zinc-400">
                {t("topupSubtitle")}
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
                    {t("coins")}
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
                    {t("diamonds")}
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
                <span>{t("coinShop")}</span>
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
                <span>{t("diamondShop")}</span>
              </button>
            </div>

            {/* Package Cards */}
            <div className="flex flex-col gap-2.5">
              {(activeTab === "coins" ? SEEDED_COIN_PACKAGES : SEEDED_DIAMOND_PACKAGES).map((pkg) => {
                const label = locale === "id" && pkg.labelId ? pkg.labelId : pkg.label;

                return (
                  <Link
                    key={pkg.id}
                    href="/wallet"
                    onClick={onClose}
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
                            {pkg.amount} {activeTab === "coins" ? t("coins") : t("diamonds")}
                          </span>
                          {label && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {label}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-400">
                          {pkg.code} • GoPay / OVO
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                        activeTab === "coins"
                          ? "bg-amber-500 group-hover:bg-amber-400 text-zinc-950"
                          : "bg-purple-600 group-hover:bg-purple-500 text-white"
                      }`}
                    >
                      {formatPrice(pkg.priceIDR)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>GoPay & OVO E-Wallet</span>
              <Link
                href="/wallet"
                onClick={onClose}
                className="text-rose-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>{t("topupTitle")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

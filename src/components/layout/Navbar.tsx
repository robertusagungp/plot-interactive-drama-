"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Coins,
  Gem,
  Gift,
  Search,
  Compass,
  BookOpen,
  User,
  ShieldAlert,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { DailyRewardModal } from "../wallet/DailyRewardModal";
import { WalletModal } from "../wallet/WalletModal";
import { useI18n, LanguageSwitcher } from "@/lib/i18n/context";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();
  const [userData, setUserData] = useState<any>(null);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUserData(data.user);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  // Hide on story player route for immersive full screen
  if (pathname.includes("/episode/")) {
    return null;
  }

  const coins = userData?.wallet?.coins ?? 100;
  const diamonds = userData?.wallet?.diamonds ?? 20;
  const isAdmin = userData?.role === "ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white">
                  PLOT
                </span>
                <span className="text-[9px] uppercase tracking-widest text-rose-400 font-semibold -mt-1">
                  Interactive Drama
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition hover:text-white ${
                  pathname === "/" ? "text-rose-400 font-bold" : "text-zinc-400"
                }`}
              >
                {t("navHome")}
              </Link>
              <Link
                href="/discover"
                className={`transition hover:text-white ${
                  pathname === "/discover" ? "text-rose-400 font-bold" : "text-zinc-400"
                }`}
              >
                {t("navDiscover")}
              </Link>
              <Link
                href="/library"
                className={`transition hover:text-white ${
                  pathname === "/library" ? "text-rose-400 font-bold" : "text-zinc-400"
                }`}
              >
                {t("navLibrary")}
              </Link>
              <Link
                href="/achievements"
                className={`transition hover:text-white ${
                  pathname === "/achievements" ? "text-rose-400 font-bold" : "text-zinc-400"
                }`}
              >
                {t("navAchievements")}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-900 text-xs font-bold flex items-center gap-1 transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {t("navAdmin")}
                </Link>
              )}
            </nav>
          </div>

          {/* Right Utilities & Wallet Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search shortcut */}
            <Link
              href="/search"
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-white/10 transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Daily Reward Streak Button */}
            <button
              onClick={() => setIsRewardOpen(true)}
              className="relative p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition group"
              aria-label="Daily Reward"
            >
              <Gift className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            </button>

            {/* Currency Pill / Wallet Opener */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-xs font-bold hover:border-white/20 transition shadow-inner"
            >
              <div className="flex items-center gap-1 text-amber-400">
                <Coins className="w-3.5 h-3.5" />
                <span>{coins}</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-1 text-purple-400">
                <Gem className="w-3.5 h-3.5" />
                <span>{diamonds}</span>
              </div>
            </button>

            {/* Profile / Login */}
            {userData ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 transition"
              >
                <div className="w-5 h-5 rounded-full bg-rose-600/40 border border-rose-500/50 flex items-center justify-center text-[10px] text-rose-200">
                  {userData.name?.[0] || "U"}
                </div>
                <span>{userData.profile?.displayName || userData.name || t("navProfile")}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-950/40"
              >
                {t("navLogin")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <DailyRewardModal
        isOpen={isRewardOpen}
        onClose={() => setIsRewardOpen(false)}
        onClaimSuccess={fetchUser}
      />
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        coins={coins}
        diamonds={diamonds}
        onSuccess={fetchUser}
      />
    </>
  );
};

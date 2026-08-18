"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("plot_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("plot_consent", "granted");
    document.cookie = "plot_consent=granted; path=/; max-age=31536000; SameSite=Lax";
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("plot_consent", "declined");
    document.cookie = "plot_consent=declined; path=/; max-age=31536000; SameSite=Lax";
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-white flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-zinc-300 leading-relaxed">
          <p className="font-bold text-white mb-0.5">Privasi & Pengalaman Bermain</p>
          Kami menggunakan analitik anonim untuk menyimpan progres cerita, rekomendasi episode, dan mengoptimalkan performa membaca drama Anda.
        </div>
        <button
          onClick={handleDecline}
          className="text-zinc-400 hover:text-white transition p-1"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition active:scale-95 text-center shadow-lg shadow-rose-950/50"
        >
          Terima Semua
        </button>
        <button
          onClick={handleDecline}
          className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition active:scale-95 text-center"
        >
          Esensial Saja
        </button>
      </div>
    </div>
  );
}

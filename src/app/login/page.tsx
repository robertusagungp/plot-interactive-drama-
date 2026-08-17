"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Shield, User, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.refresh();
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(data.error || "Authentication failed");
      }
    } catch {
      setErrorMsg("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(data.error || "Demo login failed");
      }
    } catch {
      setErrorMsg("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 max-w-md mx-auto">
      <div className="w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {isRegister ? "Create Your PLOT Account" : "Welcome Back to PLOT"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {isRegister
              ? "Save your choices, unlock episodes, and claim daily rewards."
              : "Your story. Your choice."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-zinc-900 p-1 mb-5 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              !isRegister
                ? "bg-rose-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              isRegister
                ? "bg-rose-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-300">Display Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SarahWijaya99"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-extrabold text-white text-sm shadow-lg shadow-rose-950/50 mt-2 transition"
          >
            {loading
              ? "Processing..."
              : isRegister
              ? "Create Free Account (+100 Coins)"
              : "Sign In"}
          </button>
        </form>

        {/* Demo Test Accounts */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 text-center">
            Instant Dev / Demo Logins
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("reader@plot.drama", "reader123")}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Reader Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin@plot.drama", "admin123")}
              className="py-2.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5 transition"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Guest Continue Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition"
          >
            Continue as Guest (No login required for Free Episodes)
          </Link>
        </div>
      </div>
    </div>
  );
}

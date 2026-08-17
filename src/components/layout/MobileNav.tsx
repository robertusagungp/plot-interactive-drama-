"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User } from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  // Hide mobile bottom nav during immersive story playback
  if (pathname.includes("/episode/")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Library", href: "/library", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 border-t border-white/10 backdrop-blur-2xl pb-safe">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition ${
                isActive ? "text-rose-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" />
                )}
              </div>
              <span className="text-[10px] tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

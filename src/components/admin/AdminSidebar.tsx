"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Image,
  BarChart3,
  UserCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "E-Wallet Payments", href: "/admin/payments", icon: BarChart3 },
    { label: "Stories", href: "/admin/stories", icon: BookOpen },
    { label: "Characters", href: "/admin/characters", icon: Users },
    { label: "Asset Storage", href: "/admin/assets", icon: Image },
    { label: "Analytics & Funnel", href: "/admin/analytics", icon: BarChart3 },
    { label: "Users & Roles", href: "/admin/users", icon: UserCheck },
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-950 border-r border-white/10 p-4 md:p-6 flex flex-col justify-between flex-shrink-0">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">PLOT Studio</h2>
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
              Admin CMS
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition px-2 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Site</span>
        </Link>
      </div>
    </aside>
  );
};

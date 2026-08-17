"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User } from "lucide-react";

export const UserRoleToggle: React.FC<{ userId: string; initialRole: string }> = ({
  userId,
  initialRole,
}) => {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const toggleRole = async () => {
    const nextRole = role === "ADMIN" ? "USER" : "ADMIN";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      const data = await res.json();
      if (data.success) {
        setRole(nextRole);
        router.refresh();
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleRole}
      disabled={loading}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
        role === "ADMIN"
          ? "bg-purple-950 text-purple-300 border border-purple-500/40 hover:bg-purple-900"
          : "bg-zinc-800 text-zinc-400 border border-white/10 hover:text-white"
      }`}
    >
      {role === "ADMIN" ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>ADMIN</span>
        </>
      ) : (
        <>
          <User className="w-3.5 h-3.5" />
          <span>USER</span>
        </>
      )}
    </button>
  );
};

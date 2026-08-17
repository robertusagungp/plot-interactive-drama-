"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Check,
  X,
  Coins,
  Gem,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { formatIDR } from "@/lib/i18n";

interface PaymentOrderWithRelations {
  id: string;
  orderId: string;
  userId: string;
  currencyType: string;
  currencyAmount: number;
  priceIDR: number;
  paymentMethod: string;
  paymentNumber: string;
  status: string;
  proofImageUrl?: string | null;
  proofUploadedAt?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  adminNote?: string | null;
  createdAt: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  package?: {
    code: string;
    amount: number;
    currencyType: string;
  };
  auditLogs?: {
    id: string;
    action: string;
    performedBy: string;
    createdAt: string;
    note?: string | null;
  }[];
}

export const AdminPaymentOrders: React.FC<{
  initialOrders: PaymentOrderWithRelations[];
  counts: Record<string, number>;
}> = ({ initialOrders, counts }) => {
  const router = useRouter();

  const [orders, setOrders] = useState<PaymentOrderWithRelations[]>(initialOrders);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrderWithRelations | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Transfer nominal did not match order amount");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const handleApprove = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          action: "APPROVE",
          note: adminNote || "Approved by Admin",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        setIsApproveOpen(false);
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: "APPROVED", reviewedAt: new Date().toISOString() } : o
          )
        );
        setSelectedOrder(null);
        router.refresh();
      } else {
        setActionMsg(data.error || "Approval failed");
      }
    } catch {
      setActionMsg("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          action: "REJECT",
          reason: rejectReason,
          note: adminNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        setIsRejectOpen(false);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, status: "REJECTED", rejectionReason: rejectReason }
              : o
          )
        );
        setSelectedOrder(null);
        router.refresh();
      } else {
        setActionMsg(data.error || "Rejection failed");
      }
    } catch {
      setActionMsg("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "ALL", label: "All Orders", count: orders.length },
          { id: "PROOF_SUBMITTED", label: "Proof Submitted", count: counts["PROOF_SUBMITTED"] || 0 },
          { id: "AWAITING_PAYMENT", label: "Awaiting Transfer", count: counts["AWAITING_PAYMENT"] || 0 },
          { id: "APPROVED", label: "Approved", count: counts["APPROVED"] || 0 },
          { id: "REJECTED", label: "Rejected", count: counts["REJECTED"] || 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              filter === tab.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {actionMsg && (
        <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-bold">
          {actionMsg}
        </div>
      )}

      {/* Orders List */}
      <div className="rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No orders found in this filter category.
            </div>
          ) : (
            filtered.map((ord) => {
              const isApproved = ord.status === "APPROVED";
              const isRejected = ord.status === "REJECTED";
              const isProof = ord.status === "PROOF_SUBMITTED";

              return (
                <div
                  key={ord.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-300">
                      {ord.paymentMethod === "GOPAY" ? "GP" : "OV"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {ord.orderId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            isApproved
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                              : isRejected
                              ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                              : isProof
                              ? "bg-purple-950 text-purple-300 border border-purple-500/30"
                              : "bg-amber-950 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="font-semibold text-zinc-200">
                          {ord.user.name || "Reader"} ({ord.user.email})
                        </span>
                        <span>•</span>
                        <span className="text-amber-300 font-bold">
                          +{ord.currencyAmount} {ord.currencyType}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{formatIDR(ord.priceIDR)}</span>
                      </div>

                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>

                    {!isApproved && !isRejected && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsApproveOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsRejectOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrder && !isApproveOpen && !isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/15 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                Payment Order Verification
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {selectedOrder.orderId}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>User:</span>
                <span className="text-white font-bold">
                  {selectedOrder.user.name} ({selectedOrder.user.email})
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Package:</span>
                <span className="text-white font-bold">
                  {selectedOrder.package?.code || "Custom"} ({selectedOrder.currencyAmount}{" "}
                  {selectedOrder.currencyType})
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Expected Amount:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {formatIDR(selectedOrder.priceIDR)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Method:</span>
                <span className="text-white font-bold">
                  {selectedOrder.paymentMethod} (Dest: {selectedOrder.paymentNumber})
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Status:</span>
                <span className="font-bold text-purple-300">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Proof Image */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-300">
                Transfer Receipt Screenshot:
              </span>
              {selectedOrder.proofImageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-black p-2 max-h-72 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedOrder.proofImageUrl}
                    alt="Payment Proof"
                    className="max-h-64 object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center text-xs text-zinc-500">
                  No payment proof uploaded yet by user.
                </div>
              )}
            </div>

            {/* Action Bar */}
            {selectedOrder.status !== "APPROVED" && selectedOrder.status !== "REJECTED" && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={() => setIsApproveOpen(true)}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white text-xs shadow-lg transition"
                >
                  Approve Order
                </button>
                <button
                  onClick={() => setIsRejectOpen(true)}
                  className="py-3 rounded-2xl bg-rose-950 hover:bg-rose-900 border border-rose-500/40 font-extrabold text-rose-300 text-xs transition"
                >
                  Reject Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog: APPROVE */}
      {isApproveOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-emerald-500/40 p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-black text-white">Confirm Payment Approval</h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Approve this payment and atomically credit{" "}
                <span className="font-bold text-amber-300">
                  +{selectedOrder.currencyAmount} {selectedOrder.currencyType}
                </span>{" "}
                to <span className="font-bold text-white">{selectedOrder.user.email}</span>?
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-white text-xs shadow-lg transition"
              >
                {loading
                  ? "Processing Transaction..."
                  : `Confirm Approval (+${selectedOrder.currencyAmount} ${selectedOrder.currencyType})`}
              </button>
              <button
                onClick={() => setIsApproveOpen(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: REJECT */}
      {isRejectOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-rose-500/40 p-6 shadow-2xl flex flex-col gap-4">
            <h4 className="text-lg font-black text-white text-center">Reject Payment Order</h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300">Rejection Reason</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white outline-none"
              >
                <option value="Transfer nominal did not match order amount">
                  Nominal did not match order amount
                </option>
                <option value="Receipt image is blurry or unreadable">
                  Receipt image is blurry or unreadable
                </option>
                <option value="Duplicate transaction receipt submitted">
                  Duplicate transaction receipt
                </option>
                <option value="Transfer destination number was incorrect">
                  Transfer sent to incorrect number
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleReject}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-black text-white text-xs shadow-lg transition"
              >
                {loading ? "Processing..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => setIsRejectOpen(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

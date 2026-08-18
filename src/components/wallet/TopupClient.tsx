"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Coins,
  Gem,
  Sparkles,
  Copy,
  Check,
  UploadCloud,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  CreditCard,
} from "lucide-react";
import {
  SEEDED_COIN_PACKAGES,
  SEEDED_DIAMOND_PACKAGES,
  PAYMENT_EWALLET_PHONE,
  PackageDefinition,
} from "@/lib/services/payments";
import { useI18n } from "@/lib/i18n/context";
import { trackAppEvent } from "@/lib/analytics/tracker";

interface PaymentOrderData {
  id: string;
  orderId: string;
  currencyType: string;
  currencyAmount: number;
  priceIDR: number;
  paymentMethod: string;
  paymentNumber: string;
  status: string;
  proofImageUrl?: string | null;
  createdAt: string;
  package?: {
    code: string;
    amount: number;
    currencyType: string;
  };
}

export const TopupClient: React.FC = () => {
  const router = useRouter();
  const { t, locale, formatPrice } = useI18n();

  const [activeTab, setActiveTab] = useState<"coins" | "diamonds">("coins");
  const [selectedPkg, setSelectedPkg] = useState<PackageDefinition | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"GOPAY" | "OVO">("GOPAY");
  const [activeOrder, setActiveOrder] = useState<PaymentOrderData | null>(null);
  const [orders, setOrders] = useState<PaymentOrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch orders history
  useEffect(() => {
    fetch("/api/wallet/payment-orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateOrder = async (pkg: PackageDefinition, method: "GOPAY" | "OVO") => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/wallet/payment-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageCodeOrId: pkg.code,
          paymentMethod: method,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setOrders((prev) => [data.order, ...prev.filter((o) => o.id !== data.order.id)]);
        trackAppEvent("checkout_started", {
          packageId: pkg.code,
          priceIDR: pkg.priceIDR,
          paymentMethod: method,
          currencyType: pkg.currencyType,
          currencyAmount: pkg.amount,
        });
      } else {
        setMsg(data.error || "Failed to create order");
      }
    } catch {
      setMsg("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !proofFile) return;

    setUploadingProof(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("orderId", activeOrder.orderId);
    formData.append("file", proofFile);

    try {
      const res = await fetch("/api/wallet/payment-proof", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMsg(t("paymentCreatedSuccess"));
        setActiveOrder(data.order);
        setOrders((prev) => [data.order, ...prev.filter((o) => o.id !== data.order.id)]);
        setProofFile(null);
        router.refresh();
      } else {
        setMsg(data.error || "Failed to upload proof");
      }
    } catch {
      setMsg("Upload connection failed");
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Section: Store Shelf */}
      <div className="rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-white">{t("topupTitle")}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                GoPay & OVO
              </span>
            </div>
            <p className="text-xs text-zinc-400">{t("topupSubtitle")}</p>
          </div>

          {/* Currency Toggle */}
          <div className="flex rounded-2xl bg-zinc-900 p-1 border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab("coins")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "coins"
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{t("coinShop")}</span>
            </button>
            <button
              onClick={() => setActiveTab("diamonds")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "diamonds"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              <span>{t("diamondShop")}</span>
            </button>
          </div>
        </div>

        {msg && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
            {msg}
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeTab === "coins" ? SEEDED_COIN_PACKAGES : SEEDED_DIAMOND_PACKAGES).map((pkg) => {
            const labelBadge = locale === "id" && pkg.labelId ? pkg.labelId : pkg.label;

            return (
              <div
                key={pkg.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 group relative ${
                  pkg.featured
                    ? "bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-rose-500/50 shadow-lg shadow-rose-950/20"
                    : "bg-zinc-900/80 border-white/10 hover:border-white/20"
                }`}
              >
                {labelBadge && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-600 text-white shadow-md">
                    {labelBadge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {activeTab === "coins" ? (
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Coins className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Gem className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                        {pkg.code}
                      </span>
                      <h4 className="font-extrabold text-sm text-white">
                        {pkg.amount} {activeTab === "coins" ? t("coins") : t("diamonds")}
                      </h4>
                    </div>
                  </div>

                  <div className="my-3">
                    <span className="text-2xl font-black text-white">
                      {formatPrice(pkg.priceIDR)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPkg(pkg);
                    setActiveOrder(null);
                  }}
                  className={`w-full py-2.5 rounded-2xl text-xs font-black transition shadow flex items-center justify-center gap-1.5 ${
                    activeTab === "coins"
                      ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-950/40"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/40"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{formatPrice(pkg.priceIDR)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Payment Instruction & Proof Upload Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/15 p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedPkg(null);
                setActiveOrder(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                GoPay & OVO E-Wallet Transfer
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {t("paymentModalTitle", { method: paymentMethod })}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {selectedPkg.amount} {selectedPkg.currencyType === "COINS" ? t("coins") : t("diamonds")} •{" "}
                {formatPrice(selectedPkg.priceIDR)}
              </p>
            </div>

            {/* Step 1: Method Selector */}
            {!activeOrder && (
              <div className="flex flex-col gap-4">
                <label className="text-xs font-bold text-zinc-300">
                  {t("payWith", { method: "" })}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("GOPAY")}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                      paymentMethod === "GOPAY"
                        ? "bg-sky-950/60 border-sky-400 text-white"
                        : "bg-zinc-900/90 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-base font-black">GoPay</span>
                    <span className="text-[10px] text-zinc-400">Instant Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("OVO")}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                      paymentMethod === "OVO"
                        ? "bg-purple-950/60 border-purple-400 text-white"
                        : "bg-zinc-900/90 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-base font-black">OVO</span>
                    <span className="text-[10px] text-zinc-400">Instant Transfer</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleCreateOrder(selectedPkg, paymentMethod)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white text-xs shadow-lg transition mt-2"
                >
                  {loading ? t("submitting") : `Lanjut ke Pembayaran (${formatPrice(selectedPkg.priceIDR)})`}
                </button>
              </div>
            )}

            {/* Step 2: Instruction & Proof Upload */}
            {activeOrder && (
              <div className="flex flex-col gap-4">
                {/* Transfer Instruction Card */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex flex-col gap-3">
                  <p className="text-xs text-zinc-300 font-medium">
                    {t("transferInstruction", {
                      price: formatPrice(activeOrder.priceIDR),
                      method: activeOrder.paymentMethod,
                    })}
                  </p>

                  {/* Payment Number Copy Field */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">
                        {t("paymentNumberLabel")}
                      </span>
                      <span className="text-base font-mono font-black text-emerald-400 tracking-wider">
                        {PAYMENT_EWALLET_PHONE}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(PAYMENT_EWALLET_PHONE, "phone")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition"
                    >
                      {copiedField === "phone" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t("numberCopied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t("copyNumber")}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Order ID Copy Field */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">
                        {t("orderIdLabel")}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-200">
                        {activeOrder.orderId}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(activeOrder.orderId, "orderId")}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1 transition"
                    >
                      {copiedField === "orderId" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t("orderIdCopied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t("copyOrderId")}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rules */}
                  <ul className="text-[11px] text-zinc-400 space-y-1 list-disc list-inside">
                    <li>{t("orderRule1")}</li>
                    <li>{t("orderRule2")}</li>
                    <li>{t("orderRule3")}</li>
                  </ul>
                </div>

                {/* Upload Form */}
                {activeOrder.status === "AWAITING_PAYMENT" ? (
                  <form onSubmit={handleProofSubmit} className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-zinc-300">
                      {t("uploadProofTitle")}
                    </label>

                    <div className="p-4 rounded-2xl border border-dashed border-white/20 bg-zinc-900/60 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/50 transition">
                      <UploadCloud className="w-8 h-8 text-emerald-400" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        required
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
                      />
                      <span className="text-[10px] text-zinc-500">
                        {t("uploadProofDesc")}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingProof || !proofFile}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-extrabold text-white text-xs shadow-lg transition"
                    >
                      {uploadingProof ? t("submitting") : t("submitPayment")}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        {activeOrder.status === "APPROVED"
                          ? t("status_APPROVED")
                          : t("status_PROOF_SUBMITTED")}
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {t("paymentCreatedSuccess")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Section: Order History */}
      <div className="rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-extrabold text-white">
          {t("paymentHistoryTitle")}
        </h3>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500">{t("noPaymentsYet")}</p>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map((ord) => {
              const isApproved = ord.status === "APPROVED";
              const isRejected = ord.status === "REJECTED";
              const isReview = ord.status === "PROOF_SUBMITTED" || ord.status === "UNDER_REVIEW";

              return (
                <div
                  key={ord.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-mono text-xs text-zinc-300">
                      {ord.paymentMethod === "GOPAY" ? "GP" : "OV"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {ord.orderId}
                        </span>
                        <span className="text-xs text-zinc-400">
                          ({ord.currencyAmount} {ord.currencyType})
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(ord.createdAt).toLocaleString()} • {formatPrice(ord.priceIDR)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border ${
                        isApproved
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                          : isRejected
                          ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                          : isReview
                          ? "bg-purple-950/80 text-purple-300 border-purple-500/40"
                          : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {isApproved && <CheckCircle2 className="w-3 h-3" />}
                      {isRejected && <XCircle className="w-3 h-3" />}
                      {isReview && <Clock className="w-3 h-3" />}
                      {!isApproved && !isRejected && !isReview && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>
                        {(t as any)(`status_${ord.status}`) || ord.status}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

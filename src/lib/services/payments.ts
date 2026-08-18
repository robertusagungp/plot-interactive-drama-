import { db } from "@/lib/db";
import { getOrCreateUserWallet } from "./wallet";

export const PAYMENT_EWALLET_PHONE =
  process.env.PAYMENT_EWALLET_PHONE || "087797877931";

export interface PackageDefinition {
  id: string;
  code: string;
  currencyType: "COINS" | "DIAMONDS";
  amount: number;
  bonusAmount: number;
  priceIDR: number;
  label?: string;
  labelId?: string;
  featured?: boolean;
}

export const SEEDED_COIN_PACKAGES: PackageDefinition[] = [
  {
    id: "pkg_c1",
    code: "C1",
    currencyType: "COINS",
    amount: 100,
    bonusAmount: 0,
    priceIDR: 10000,
  },
  {
    id: "pkg_c2",
    code: "C2",
    currencyType: "COINS",
    amount: 300,
    bonusAmount: 0,
    priceIDR: 25000,
    label: "BEST STARTER",
    labelId: "BEST STARTER",
  },
  {
    id: "pkg_c3",
    code: "C3",
    currencyType: "COINS",
    amount: 700,
    bonusAmount: 0,
    priceIDR: 50000,
    label: "POPULAR",
    labelId: "POPULER",
    featured: true,
  },
  {
    id: "pkg_c4",
    code: "C4",
    currencyType: "COINS",
    amount: 1500,
    bonusAmount: 0,
    priceIDR: 100000,
    label: "BEST VALUE",
    labelId: "PALING HEMAT",
  },
];

export const SEEDED_DIAMOND_PACKAGES: PackageDefinition[] = [
  {
    id: "pkg_d1",
    code: "D1",
    currencyType: "DIAMONDS",
    amount: 50,
    bonusAmount: 0,
    priceIDR: 10000,
  },
  {
    id: "pkg_d2",
    code: "D2",
    currencyType: "DIAMONDS",
    amount: 150,
    bonusAmount: 0,
    priceIDR: 25000,
  },
  {
    id: "pkg_d3",
    code: "D3",
    currencyType: "DIAMONDS",
    amount: 350,
    bonusAmount: 0,
    priceIDR: 50000,
    label: "POPULAR",
    labelId: "POPULER",
    featured: true,
  },
  {
    id: "pkg_d4",
    code: "D4",
    currencyType: "DIAMONDS",
    amount: 800,
    bonusAmount: 0,
    priceIDR: 100000,
    label: "BEST VALUE",
    labelId: "PALING HEMAT",
  },
];

export async function getActiveCurrencyPackages(currencyType?: "COINS" | "DIAMONDS") {
  try {
    const packages = await db.currencyPackage.findMany({
      where: {
        active: true,
        ...(currencyType ? { currencyType } : {}),
      },
      orderBy: [{ currencyType: "asc" }, { sortOrder: "asc" }, { priceIDR: "asc" }],
    });

    if (packages.length > 0) return packages;
  } catch {}

  // Fallback to static packages
  const all = [...SEEDED_COIN_PACKAGES, ...SEEDED_DIAMOND_PACKAGES];
  return currencyType ? all.filter((p) => p.currencyType === currencyType) : all;
}

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PLOT-${dateStr}-${randomSuffix}`;
}

export async function createPaymentOrder(params: {
  userId: string;
  packageCodeOrId: string;
  paymentMethod: "GOPAY" | "OVO";
}) {
  const { userId, packageCodeOrId, paymentMethod } = params;

  // Find package in DB or fallback list
  let pkg = await db.currencyPackage.findFirst({
    where: {
      OR: [{ id: packageCodeOrId }, { code: packageCodeOrId.toUpperCase() }],
      active: true,
    },
  });

  if (!pkg) {
    const staticPkg = [...SEEDED_COIN_PACKAGES, ...SEEDED_DIAMOND_PACKAGES].find(
      (p) => p.id === packageCodeOrId || p.code === packageCodeOrId.toUpperCase()
    );
    if (!staticPkg) throw new Error("PACKAGE_NOT_FOUND");

    // Upsert package in DB
    pkg = await db.currencyPackage.upsert({
      where: { code: staticPkg.code },
      update: {},
      create: {
        id: staticPkg.id,
        code: staticPkg.code,
        currencyType: staticPkg.currencyType,
        amount: staticPkg.amount,
        bonusAmount: staticPkg.bonusAmount,
        priceIDR: staticPkg.priceIDR,
        label: staticPkg.label,
        labelId: staticPkg.labelId,
        featured: staticPkg.featured || false,
      },
    });
  }

  const orderId = generateOrderId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

  const order = await db.paymentOrder.create({
    data: {
      orderId,
      userId,
      packageId: pkg.id,
      currencyType: pkg.currencyType,
      currencyAmount: pkg.amount + pkg.bonusAmount,
      priceIDR: pkg.priceIDR,
      paymentMethod,
      paymentNumber: PAYMENT_EWALLET_PHONE,
      status: "AWAITING_PAYMENT",
      expiresAt,
    },
    include: { package: true },
  });

  // Log creation audit
  await db.paymentAuditLog.create({
    data: {
      paymentOrderId: order.id,
      action: "CREATED",
      previousStatus: null,
      newStatus: "AWAITING_PAYMENT",
      performedBy: userId,
      note: `Created manual transfer order for ${pkg.code} via ${paymentMethod}`,
    },
  });

  return order;
}

export async function submitPaymentProof(params: {
  orderId: string;
  userId: string;
  proofImageUrl: string;
}) {
  const { orderId, userId, proofImageUrl } = params;

  const order = await db.paymentOrder.findFirst({
    where: {
      OR: [{ id: orderId }, { orderId }],
      userId,
    },
  });

  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (order.status === "APPROVED") throw new Error("ORDER_ALREADY_APPROVED");

  const updated = await db.paymentOrder.update({
    where: { id: order.id },
    data: {
      status: "PROOF_SUBMITTED",
      proofImageUrl,
      proofUploadedAt: new Date(),
    },
    include: { package: true },
  });

  await db.paymentAuditLog.create({
    data: {
      paymentOrderId: order.id,
      action: "PROOF_SUBMITTED",
      previousStatus: order.status,
      newStatus: "PROOF_SUBMITTED",
      performedBy: userId,
      note: "User submitted receipt screenshot for verification",
    },
  });

  return updated;
}

/**
 * EXACTLY-ONCE PAYMENT APPROVAL WITH ATOMIC DATABASE TRANSACTION
 */
export async function approvePaymentOrder(params: {
  orderId: string;
  adminUserId: string;
  note?: string;
}) {
  const { orderId, adminUserId, note } = params;

  return await db.$transaction(
    async (tx) => {
      const order = await tx.paymentOrder.findFirst({
      where: { OR: [{ id: orderId }, { orderId }] },
      include: { package: true, walletTransaction: true },
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");

    // Idempotency: If already approved or transaction exists, prevent double credit
    if (order.status === "APPROVED" || order.walletTransaction) {
      throw new Error("PAYMENT_ALREADY_APPROVED");
    }

    // Update order status
    const updatedOrder = await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: "APPROVED",
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        adminNote: note || "Verified & Approved",
      },
    });

    // Ensure user wallet exists
    let wallet = await tx.wallet.findUnique({
      where: { userId: order.userId },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { userId: order.userId, coins: 100, diamonds: 20 },
      });
    }

    const isCoins = order.currencyType === "COINS";
    const newBalance = (isCoins ? wallet.coins : wallet.diamonds) + order.currencyAmount;

    // Update wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        coins: isCoins ? newBalance : wallet.coins,
        diamonds: !isCoins ? newBalance : wallet.diamonds,
      },
    });

    // Create immutable WalletTransaction ledger tied uniquely to paymentOrderId
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        currency: order.currencyType,
        amount: order.currencyAmount,
        type: "PAYMENT_PURCHASE",
        source: `Payment Order #${order.orderId}`,
        referenceId: order.orderId,
        paymentOrderId: order.id,
        balanceAfter: newBalance,
        description: `Purchased ${order.currencyAmount} ${order.currencyType} via ${order.paymentMethod}`,
      },
    });

    // Record audit log
    await tx.paymentAuditLog.create({
      data: {
        paymentOrderId: order.id,
        action: "APPROVED",
        previousStatus: order.status,
        newStatus: "APPROVED",
        performedBy: adminUserId,
        note: note || `Approved. Credited +${order.currencyAmount} ${order.currencyType}`,
      },
    });

      return {
        success: true,
        order: updatedOrder,
        creditedAmount: order.currencyAmount,
        currencyType: order.currencyType,
        newBalance,
      };
    },
    { timeout: 20000, maxWait: 10000 }
  );
}

/**
 * REJECT PAYMENT ORDER
 */
export async function rejectPaymentOrder(params: {
  orderId: string;
  adminUserId: string;
  reason?: string;
  note?: string;
}) {
  const { orderId, adminUserId, reason, note } = params;

  return await db.$transaction(
    async (tx) => {
      const order = await tx.paymentOrder.findFirst({
        where: { OR: [{ id: orderId }, { orderId }] },
      });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (order.status === "APPROVED") throw new Error("CANNOT_REJECT_APPROVED_ORDER");

    const updated = await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: "REJECTED",
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        rejectionReason: reason || "Payment receipt could not be verified",
        adminNote: note,
      },
    });

    await tx.paymentAuditLog.create({
      data: {
        paymentOrderId: order.id,
        action: "REJECTED",
        previousStatus: order.status,
        newStatus: "REJECTED",
        performedBy: adminUserId,
        note: reason || note || "Payment receipt rejected",
      },
    });

    return updated;
    },
    { timeout: 20000, maxWait: 10000 }
  );
}

// Aliases for compatibility
export const COIN_PACKAGES = SEEDED_COIN_PACKAGES;
export const DIAMOND_PACKAGES = SEEDED_DIAMOND_PACKAGES;

export const PaymentService = {
  createPaymentOrder,
  submitPaymentProof,
  approvePaymentOrder,
  rejectPaymentOrder,
  executeDevMockPurchase: async (userId: string, pkg: PackageDefinition) => {
    const wallet = await getOrCreateUserWallet(userId);
    const updateData =
      pkg.currencyType === "COINS"
        ? { coins: { increment: pkg.amount } }
        : { diamonds: { increment: pkg.amount } };

    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: updateData,
    });

    const newBalance = pkg.currencyType === "COINS" ? updated.coins : updated.diamonds;

    await db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        currency: pkg.currencyType,
        amount: pkg.amount,
        type: "TOPUP_PURCHASE",
        balanceAfter: newBalance,
        description: `Purchased ${pkg.code} (${pkg.amount} ${pkg.currencyType.toLowerCase()})`,
      },
    });

    return { success: true, newBalance };
  },
};

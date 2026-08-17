import { test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../lib/db";
import {
  createPaymentOrder,
  submitPaymentProof,
  approvePaymentOrder,
  rejectPaymentOrder,
  PAYMENT_EWALLET_PHONE,
  SEEDED_COIN_PACKAGES,
  SEEDED_DIAMOND_PACKAGES,
} from "../lib/services/payments";

test("E-Wallet Payment Packages - IDR Prices and Phone Config", () => {
  assert.equal(PAYMENT_EWALLET_PHONE, "087797877931");

  // Coin packages: C1=100 (10k), C2=300 (25k), C3=700 (50k), C4=1500 (100k)
  const c1 = SEEDED_COIN_PACKAGES.find((p) => p.code === "C1");
  const c2 = SEEDED_COIN_PACKAGES.find((p) => p.code === "C2");
  const c3 = SEEDED_COIN_PACKAGES.find((p) => p.code === "C3");
  const c4 = SEEDED_COIN_PACKAGES.find((p) => p.code === "C4");

  assert.ok(c1 && c1.amount === 100 && c1.priceIDR === 10000);
  assert.ok(c2 && c2.amount === 300 && c2.priceIDR === 25000);
  assert.ok(c3 && c3.amount === 700 && c3.priceIDR === 50000);
  assert.ok(c4 && c4.amount === 1500 && c4.priceIDR === 100000);

  // Diamond packages: D1=50 (10k), D2=150 (25k), D3=350 (50k), D4=800 (100k)
  const d1 = SEEDED_DIAMOND_PACKAGES.find((p) => p.code === "D1");
  const d2 = SEEDED_DIAMOND_PACKAGES.find((p) => p.code === "D2");
  const d3 = SEEDED_DIAMOND_PACKAGES.find((p) => p.code === "D3");
  const d4 = SEEDED_DIAMOND_PACKAGES.find((p) => p.code === "D4");

  assert.ok(d1 && d1.amount === 50 && d1.priceIDR === 10000);
  assert.ok(d2 && d2.amount === 150 && d2.priceIDR === 25000);
  assert.ok(d3 && d3.amount === 350 && d3.priceIDR === 50000);
  assert.ok(d4 && d4.amount === 800 && d4.priceIDR === 100000);
});

test("E-Wallet Payment Lifecycle - Create, Proof, Approve, Exactly-Once Crediting & Reject", async () => {
  // 1. Create test user & admin
  const testUser = await db.user.create({
    data: {
      email: `test_payment_user_${Date.now()}@plot.test`,
      name: "Payment Tester",
      role: "USER",
      wallet: {
        create: { coins: 50, diamonds: 10 },
      },
    },
  });

  const testAdmin = await db.user.create({
    data: {
      email: `test_payment_admin_${Date.now()}@plot.test`,
      name: "Payment Admin",
      role: "ADMIN",
    },
  });

  try {
    // 2. Create C3 Order (700 Coins, Rp50.000, GOPAY)
    const order = await createPaymentOrder({
      userId: testUser.id,
      packageCodeOrId: "C3",
      paymentMethod: "GOPAY",
    });

    assert.equal(order.status, "AWAITING_PAYMENT");
    assert.equal(order.currencyAmount, 700);
    assert.equal(order.priceIDR, 50000);
    assert.equal(order.paymentNumber, "087797877931");

    // 3. Submit Proof
    const withProof = await submitPaymentProof({
      orderId: order.orderId,
      userId: testUser.id,
      proofImageUrl: "/uploads/proofs/test_receipt.jpg",
    });

    assert.equal(withProof.status, "PROOF_SUBMITTED");
    assert.equal(withProof.proofImageUrl, "/uploads/proofs/test_receipt.jpg");

    // 4. Admin Approves Order -> User balance should increase: 50 + 700 = 750
    const approvalResult = await approvePaymentOrder({
      orderId: order.id,
      adminUserId: testAdmin.id,
      note: "Verified test transfer",
    });

    assert.equal(approvalResult.success, true);
    assert.equal(approvalResult.creditedAmount, 700);
    assert.equal(approvalResult.newBalance, 750, "User wallet must be exactly 750 coins after +700 credit");

    // Verify DB wallet balance
    const updatedWallet = await db.wallet.findUnique({ where: { userId: testUser.id } });
    assert.equal(updatedWallet?.coins, 750);

    // 5. Exactly-Once Safety: Attempt to approve the SAME order a second time
    await assert.rejects(
      async () => {
        await approvePaymentOrder({
          orderId: order.id,
          adminUserId: testAdmin.id,
          note: "Accidental double approval attempt",
        });
      },
      /PAYMENT_ALREADY_APPROVED/,
      "Must reject second approval to prevent duplicate wallet crediting"
    );

    // Balance must remain 750 (never 1450)
    const safeWallet = await db.wallet.findUnique({ where: { userId: testUser.id } });
    assert.equal(safeWallet?.coins, 750, "Balance must remain exactly 750 and NOT double-credit");

    // 6. Test Rejection Flow on another order
    const rejectOrder = await createPaymentOrder({
      userId: testUser.id,
      packageCodeOrId: "D2",
      paymentMethod: "OVO",
    });

    const rejected = await rejectPaymentOrder({
      orderId: rejectOrder.id,
      adminUserId: testAdmin.id,
      reason: "Blurry receipt",
      note: "Please re-upload clear screenshot",
    });

    assert.equal(rejected.status, "REJECTED");
    assert.equal(rejected.rejectionReason, "Blurry receipt");

    // Wallet diamonds must remain 10
    const finalWallet = await db.wallet.findUnique({ where: { userId: testUser.id } });
    assert.equal(finalWallet?.diamonds, 10, "Rejected order must not alter wallet diamonds");
  } finally {
    // Clean up
    await db.paymentAuditLog.deleteMany({
      where: { paymentOrder: { userId: testUser.id } },
    });
    await db.walletTransaction.deleteMany({
      where: { wallet: { userId: testUser.id } },
    });
    await db.paymentOrder.deleteMany({
      where: { userId: testUser.id },
    });
    await db.wallet.deleteMany({
      where: { userId: testUser.id },
    });
    await db.user.delete({ where: { id: testUser.id } });
    await db.user.delete({ where: { id: testAdmin.id } });
  }
});

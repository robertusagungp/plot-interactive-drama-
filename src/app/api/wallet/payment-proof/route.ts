import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { submitPaymentProof } from "@/lib/services/payments";
import { uploadAsset } from "@/lib/services/blob";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // Support either FormData upload or JSON payload with base64/url
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const orderId = formData.get("orderId") as string;
      const file = formData.get("file") as File;

      if (!orderId || !file) {
        return NextResponse.json({ error: "Missing orderId or proof file" }, { status: 400 });
      }

      // Validate MIME type
      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
      if (!allowedMimes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: "Invalid file format. Allowed: JPG, PNG, WEBP, PDF." },
          { status: 400 }
        );
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit." },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop() || "jpg";
      const uploadResult = await uploadAsset({
        name: `proof_${orderId}`,
        type: "AVATAR",
        file: file,
        filename: `proof_${orderId}_${Date.now()}.${ext}`,
      });

      const updated = await submitPaymentProof({
        orderId,
        userId: user.id,
        proofImageUrl: uploadResult.url,
      });

      return NextResponse.json({ success: true, order: updated });
    } else {
      const body = await req.json();
      const { orderId, proofImageUrl } = body;

      if (!orderId || !proofImageUrl) {
        return NextResponse.json({ error: "Missing orderId or proofImageUrl" }, { status: 400 });
      }

      const updated = await submitPaymentProof({
        orderId,
        userId: user.id,
        proofImageUrl,
      });

      return NextResponse.json({ success: true, order: updated });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to submit payment proof" }, { status: 500 });
  }
}

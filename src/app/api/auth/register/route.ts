import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { getOrCreateUserWallet } from "@/lib/services/wallet";
import { saveUserStoryProgress } from "@/lib/services/story";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  guestProgress: z
    .object({
      storyId: z.string().optional(),
      storySlug: z.string().optional(),
      episodeId: z.string().optional(),
      episodeNumber: z.number().optional(),
      stats: z.record(z.string(), z.number()).optional(),
      relationships: z.record(z.string(), z.any()).optional(),
      choicesMade: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
    }

    const { name, email, password, guestProgress } = parsed.data;

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
        profile: {
          create: {
            displayName: name,
            level: 1,
            exp: 50,
          },
        },
      },
      include: { profile: true },
    });

    // Initialize wallet with welcome bonus
    await getOrCreateUserWallet(user.id);

    // Merge guest progress if provided
    if (guestProgress && guestProgress.storyId && guestProgress.episodeId) {
      await saveUserStoryProgress({
        userId: user.id,
        storyId: guestProgress.storyId,
        episodeId: guestProgress.episodeId,
        episodeNumber: guestProgress.episodeNumber || 1,
        stats: guestProgress.stats,
        relationships: guestProgress.relationships,
        choicesMade: guestProgress.choicesMade,
      });
    }

    // Persist Attribution from Cookies / Headers
    try {
      const { saveUserAttribution, ATTRIBUTION_COOKIE_FIRST, ATTRIBUTION_COOKIE_LAST, ANONYMOUS_SESSION_COOKIE } =
        await import("@/lib/analytics/attribution");

      const cookieHeader = req.headers.get("cookie") || "";
      const getCookieVal = (name: string) => {
        const match = cookieHeader.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? decodeURIComponent(match[2]) : null;
      };

      const firstRaw = getCookieVal(ATTRIBUTION_COOKIE_FIRST);
      const lastRaw = getCookieVal(ATTRIBUTION_COOKIE_LAST);
      const anonId = getCookieVal(ANONYMOUS_SESSION_COOKIE);

      let firstTouch = undefined;
      let lastTouch = undefined;

      if (firstRaw) {
        try { firstTouch = JSON.parse(firstRaw); } catch {}
      }
      if (lastRaw) {
        try { lastTouch = JSON.parse(lastRaw); } catch {}
      }

      await saveUserAttribution(user.id, {
        anonymousSessionId: anonId || undefined,
        firstTouch,
        lastTouch,
      });
    } catch {}

    // Dispatch Server-side CompleteRegistration event to TikTok Events API
    try {
      const { sendTikTokServerEvent } = await import("@/lib/services/tiktok-events-api");
      await sendTikTokServerEvent({
        eventName: "CompleteRegistration",
        userId: user.id,
        userEmail: user.email || undefined,
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });
    } catch {}

    const sessionToken = await createSession(user.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });

    response.cookies.set("plot_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

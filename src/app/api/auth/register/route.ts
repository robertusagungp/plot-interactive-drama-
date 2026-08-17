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

    const sessionToken = await createSession(user.id);

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set("plot_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ? true : false,
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Registration failed" }, { status: 500 });
  }
}

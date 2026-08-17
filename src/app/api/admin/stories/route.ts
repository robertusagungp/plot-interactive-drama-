import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const StoryCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  author: z.string().default("PLOT Studio"),
  ageRating: z.string().default("16+"),
  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  coverImage: z.string().default("/assets/covers/default_cover.jpg"),
});

export async function GET() {
  try {
    await requireAdmin();
    const stories = await db.story.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        genres: { include: { genre: true } },
        _count: { select: { episodes: true, userProgress: true } },
      },
    });

    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = StoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid story data" }, { status: 400 });
    }

    const story = await db.story.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, story });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create story" }, { status: 500 });
  }
}

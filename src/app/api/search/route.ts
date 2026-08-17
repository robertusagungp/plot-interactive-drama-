import { NextRequest, NextResponse } from "next/server";
import { getPublishedStories } from "@/lib/services/story";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const stories = await getPublishedStories({
    search: q,
    limit: 20,
  });

  return NextResponse.json({ stories });
}

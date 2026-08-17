import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  const res = NextResponse.json({ success: true });
  res.cookies.delete("plot_session");
  return res;
}

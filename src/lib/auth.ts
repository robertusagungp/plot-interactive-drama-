import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "USER" | "ADMIN";
  image?: string | null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("plot_session")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, image: true },
        },
      },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user.role as "USER" | "ADMIN") || "USER",
      image: session.user.image,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED_ADMIN");
  }
  return user;
}

export async function createSession(userId: string): Promise<string> {
  const sessionToken = `plot_sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.session.create({
    data: {
      userId,
      sessionToken,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("plot_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ? true : false,
    sameSite: "lax",
    expires,
    path: "/",
  });

  return sessionToken;
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("plot_session")?.value;
    if (sessionToken) {
      await db.session.deleteMany({ where: { sessionToken } });
      cookieStore.delete("plot_session");
    }
  } catch {}
}

export async function authenticateCredentials(email: string, password: string): Promise<SessionUser | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role as "USER" | "ADMIN") || "USER",
    image: user.image,
  };
}

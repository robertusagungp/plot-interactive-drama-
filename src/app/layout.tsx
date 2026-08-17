import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "PLOT — Interactive Visual Drama",
  description:
    "Your story. Your choice. Experience premium vertical interactive visual novels with romance, suspense, and multiple endings.",
  openGraph: {
    title: "PLOT — Interactive Visual Drama",
    description: "Decide the destiny of Sarah Wijaya and Adrian Hartono in I Married My Enemy.",
    siteName: "PLOT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090A0F] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-rose-500/30 selection:text-rose-200">
        <Navbar />
        <main className="flex-1 w-full pb-20 md:pb-8">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}

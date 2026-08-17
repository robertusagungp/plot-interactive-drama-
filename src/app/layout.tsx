import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { I18nProvider } from "@/lib/i18n/context";
import { getServerLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "PLOT — Platform Drama Visual Interaktif",
  description:
    "Ceritamu. Pilihanmu. Mainkan visual novel romantis vertikal dengan pilihan bercabang dan ending mendebarkan.",
  openGraph: {
    title: "PLOT — Ceritamu. Pilihanmu.",
    description: "Platform drama visual interaktif vertikal pertama di Indonesia.",
    siteName: "PLOT",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className="dark">
      <body className="bg-[#090A0F] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-rose-500/30 selection:text-rose-200">
        <I18nProvider initialLocale={locale}>
          <Navbar />
          <main className="flex-1 w-full pb-20 md:pb-8">{children}</main>
          <MobileNav />
        </I18nProvider>
      </body>
    </html>
  );
}

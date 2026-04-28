import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/shared/MainNav";
import BackToTop from "@/components/shared/BackToTop";
import { HomepageProvider } from "@/context/HomepageContext";
import { AudioProvider } from "@/context/AudioContext";
import { Analytics } from "@vercel/analytics/react";
import PublicShell from "@/components/shared/PublicShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "WEI IN SIGHT — Jacky Ho",
  description: "The creative atlas of Jacky Ho. A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",
  icons: {
    icon: "/assets/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <PublicShell>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  );
}

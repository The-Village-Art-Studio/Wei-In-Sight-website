import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/shared/MainNav";
import BackToTop from "@/components/shared/BackToTop";
import { HomepageProvider } from "@/context/HomepageContext";
import { AudioProvider } from "@/context/AudioContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "WEI IN SIGHT — Jacky Ho",
  description: "The creative atlas of Jacky Ho. A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <HomepageProvider>
          <AudioProvider>
            <div className="site-wrapper">
              <header className="site-header">
                <MainNav />
              </header>
              <main className="site-main">
                {children}
                <Analytics />
              </main>
              <BackToTop />
            </div>
          </AudioProvider>
        </HomepageProvider>
      </body>
    </html>
  );
}

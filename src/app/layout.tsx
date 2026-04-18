import type { Metadata } from "next";
import "./globals.css";
import MainNav from "@/components/shared/MainNav";

export const metadata: Metadata = {
  title: "WEI IN SIGHT — Jacky Ho",
  description: "The cinematic universe of multidisciplinary artist Jacky Ho. Visual Arts, Music, Writing, and Storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <header className="site-header">
            <MainNav />
          </header>
          <main className="site-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

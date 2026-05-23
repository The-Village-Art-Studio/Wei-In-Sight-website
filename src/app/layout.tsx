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

/* ─────────────── SEO / AEO / GEO / SXO Metadata ─────────────── */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weiinsight.com";

export const metadata: Metadata = {
  /* ── Base ── */
  metadataBase: new URL(SITE_URL),

  /* ── Title (template lets child routes auto-suffix) ── */
  title: {
    default: "WEI IN SIGHT — Jacky Ho",
    template: "%s | WEI IN SIGHT",
  },

  description:
    "The creative atlas of Jacky Ho. A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",

  /* ── SEO Keywords ── */
  keywords: [
    "Jacky Ho",
    "Wei In Sight",
    "multidisciplinary artist",
    "visual arts",
    "contemporary art",
    "paintings",
    "sculpture",
    "mixed media",
    "photography",
    "music",
    "poetry",
    "lyrics",
    "fashion design",
    "watchmaking",
    "digital art",
    "art portfolio",
    "buy art online",
    "art commissions",
  ],

  /* ── Author / Creator ── */
  authors: [{ name: "Jacky Ho", url: SITE_URL }],
  creator: "Jacky Ho",
  publisher: "Jacky Ho",

  /* ── Canonical ── */
  alternates: {
    canonical: "/",
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Open Graph (Facebook, LinkedIn, Discord, iMessage, etc.) ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "WEI IN SIGHT",
    title: "WEI IN SIGHT — Jacky Ho",
    description:
      "The creative atlas of Jacky Ho. A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",
    images: [
      {
        url: "/assets/logo-white.png",
        width: 512,
        height: 512,
        alt: "WEI IN SIGHT — Logo",
      },
    ],
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: "summary_large_image",
    title: "WEI IN SIGHT — Jacky Ho",
    description:
      "Multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",
    images: ["/assets/logo-white.png"],
  },

  /* ── Icons (file-based icon.png takes priority, but explicit is good for Apple) ── */
  icons: {
    icon: "/assets/logo-white.png",
    apple: "/assets/logo-white.png",
  },

  /* ── Misc ── */
  category: "Art & Design",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

/* ─────────────── JSON-LD Structured Data (AEO / GEO / VSO) ─────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    /* Person (Artist) schema */
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Jacky Ho",
      alternateName: "Wei In Sight",
      url: SITE_URL,
      image: `${SITE_URL}/assets/logo-white.png`,
      description:
        "A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.",
      jobTitle: "Multidisciplinary Artist",
      knowsAbout: [
        "Visual Arts",
        "Painting",
        "Sculpture",
        "Photography",
        "Music Production",
        "Poetry",
        "Lyrics",
        "Mixed Media",
        "Fashion Design",
        "Watchmaking",
        "Digital Art",
        "Installation Art",
        "Mural Art",
      ],
      sameAs: [
        "https://www.instagram.com/weiinsight/",
        "https://www.tiktok.com/@weiinsight",
      ],
    },
    /* WebSite schema */
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "WEI IN SIGHT",
      description: "The creative atlas of Jacky Ho",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
    /* BreadcrumbList (home) */
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
  ],
};

/* ─────────────── Root Layout ─────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* JSON-LD structured data — server-rendered, invisible to users */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preload critical assets for better LCP */}
        <link
          rel="preload"
          href="/assets/logo-white.png"
          as="image"
          type="image/png"
        />
      </head>
      <body>
        <PublicShell>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  );
}

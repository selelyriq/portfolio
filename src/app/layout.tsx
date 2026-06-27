import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Lyriq Sele | Photography Portfolio",
  description: "Explore a curated collection of stunning photography. Dark, minimal aesthetic with immersive gallery experience.",
  keywords: ["photography", "portfolio", "gallery", "art"],
  authors: [{ name: "Lyriq Sele" }],
  creator: "Lyriq Sele",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lyriqsele.com",
    siteName: "Lyriq Sele Photography",
    title: "Lyriq Sele | Photography Portfolio",
    description: "Explore a curated collection of stunning photography",
    images: [
      {
        url: "https://lyriqsele.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lyriq Sele Photography Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyriq Sele | Photography Portfolio",
    description: "Explore a curated collection of stunning photography",
    creator: "@lyriqsele",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header />
        <main style={{ paddingTop: "64px" }}>{children}</main>
      </body>
    </html>
  );
}

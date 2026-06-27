import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description: "A unique collection of photographic work",
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

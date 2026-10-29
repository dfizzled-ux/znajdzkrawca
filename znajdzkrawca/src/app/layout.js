import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Umami (cookieless, so no consent banner). Off until NEXT_PUBLIC_UMAMI_WEBSITE_ID
// is set in Railway; it's read at build time, so a redeploy picks it up
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Resolves the relative canonical URLs set on each page
  metadataBase: new URL("https://znajdzkrawca.pl"),
  title: "Znajdź Krawca — Katalog krawców w Polsce",
  description:
    "Katalog krawców i pracowni krawieckich w Polsce. Znajdź krawca w swoim mieście.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
        {UMAMI_ID && <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />}
      </body>
    </html>
  );
}

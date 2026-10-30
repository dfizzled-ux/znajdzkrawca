import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Umami (cookieless, so no consent banner). The website id is public (it's in
// the page source); NEXT_PUBLIC_UMAMI_WEBSITE_ID overrides it at build time
// Also accepts the whole <script …> tag Umami shows, pasted as the variable
const fromTag = (v, attr) => v?.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? v?.trim();
const srcVar = fromTag(process.env.NEXT_PUBLIC_UMAMI_SRC, "src");
const UMAMI_SRC = srcVar?.startsWith("https://") ? srcVar : "https://cloud.umami.is/script.js";
const UMAMI_ID = fromTag(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID, "data-website-id") || "840ccf79-7d43-410a-837a-fd33674c3232";

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

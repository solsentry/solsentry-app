import type { Metadata } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google from the visitor.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const TITLE = "SolSentry — your phone verifies Solana";
const DESCRIPTION =
  "An Android app that reads public Solana transactions, signs what it saw with a key held in the phone's secure hardware, and earns points for every read the server can confirm. Built for Solana Seeker.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://solsentry.app"),
  openGraph: {
    type: "website",
    url: "https://solsentry.app",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SolSentry",
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/favicon-512.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#090A09",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SolSentry — Operator intelligence for Solana",
    template: "%s · SolSentry",
  },
  description:
    "Autonomous threat intelligence for Solana. Operator risk, rug pull detection, serial deployer tracking. Install via npx @solsentry/mcp or query api.solsentry.app.",
  metadataBase: new URL("https://solsentry.app"),
  openGraph: {
    type: "website",
    url: "https://solsentry.app",
    title: "SolSentry — Operator intelligence for Solana",
    description:
      "RugCheck tells you a fire is burning. SolSentry tells you who lit it. Operator-centric threat intelligence — live mainnet.",
    siteName: "SolSentry",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolSentry — Operator intelligence for Solana",
    description:
      "RugCheck tells you a fire is burning. SolSentry tells you who lit it.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  themeColor: "#100E0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

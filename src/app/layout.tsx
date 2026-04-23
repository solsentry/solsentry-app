import type { Metadata } from "next";
import { WalletProviders } from "@/components/WalletProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SolSentry — The security relay",
    template: "%s · SolSentry",
  },
  description:
    "Solana threat intelligence. Operator risk, rug pull detection, serial deployer tracking. Install via npx @solsentry/mcp or query api.solsentry.app.",
  metadataBase: new URL("https://solsentry.app"),
  openGraph: {
    type: "website",
    url: "https://solsentry.app",
    title: "SolSentry — The security relay",
    description:
      "What Pyth is to prices, SolSentry is to operator risk. Post-deploy threat intelligence for Solana.",
    siteName: "SolSentry",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolSentry — The security relay",
    description:
      "What Pyth is to prices, SolSentry is to operator risk. Post-deploy threat intelligence for Solana.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}

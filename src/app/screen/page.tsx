import { ScreenLoop } from "@/components/ScreenLoop";

export const metadata = {
  title: "SolSentry · Live screen (presentation mode)",
  description:
    "Fullscreen rotating panels for projection during pitch. Live data from api.solsentry.app.",
};

export default function ScreenPage() {
  return <ScreenLoop />;
}

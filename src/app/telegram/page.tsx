// /telegram — server wrapper: keeps EN metadata (SEO) + renders the bilingual
// client body (PT/EN resolved from saved pref or navigator.language; see
// useLang / B8.4a). Admin/internal commands are not exposed (B8.5).

import { TelegramClient } from "./TelegramClient";

export const metadata = {
  title: "Telegram Bot — full command reference, live",
  description:
    "SolSentry Telegram bot — /scan, /drain, /follow, /hunters. Paste a Solana wallet or mint, get operator history, risk scoring, drain trace, and ALife hunter assignment back in seconds.",
};

export default function TelegramPage() {
  return <TelegramClient />;
}

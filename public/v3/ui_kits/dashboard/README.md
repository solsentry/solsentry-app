# Dashboard UI Kit

High-fidelity recreation of the **target** SolSentry operator dashboard (Q3 2026 roadmap item — currently Telegram-only in production).

Informed by:
- The Telegram alert payload in `assets/alert-telegram-4kxscute.png` (flag vocabulary, risk scoring format, auto-scan structure)
- The `solsentry-docs` README metrics (scan count, accuracy, operator counts, RPC health)
- The four-pillar taxonomy (PREVENT / TRACK / EXPLAIN / EVOLVE)

## Components
- `TopBar.jsx` — brand, search, live status indicator
- `SideNav.jsx` — left rail with pillar navigation
- `MetricStrip.jsx` — top metrics row (scans, accuracy, runtime)
- `ScanResult.jsx` — single scan card with risk score + flags
- `OperatorRow.jsx` — serial deployer table row
- `HunterStatus.jsx` — live hunter indicator with pulse
- `FlagPill.jsx` — the snake_case flag chips
- `WalletAddress.jsx` — mono-styled wallet address display

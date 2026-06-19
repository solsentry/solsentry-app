# solsentry-app

> RugCheck tells you a fire is burning. SolSentry tells you who lit it.

Public web app for [SolSentry](https://solsentry.app) — Solana threat
intelligence. Landing, lookup, operator/token pages, live dashboards and
integration docs for the operator-risk intelligence layer.

Live product:

- App: `https://solsentry.app`
- API: `https://api.solsentry.app/v1/stats`
- Infra backing the API: `Contabo US-East (66.94.105.185)`, migrated from
  Hetzner on `2026-06-09`
- Frontend hosting: `Cloudflare/Vercel` (not on the VPS)

## What this app exposes

- landing page and positioning for SolSentry
- live operator lookup UI
- public install/docs entrypoint for REST and MCP
- links to the wider public SolSentry surface

## Stack

- Next.js 15.1 + React 19 + TypeScript 5.7
- App Router
- Static export where possible; SSR (edge runtime) for `/operator/[wallet]`
- Consumes the public REST API at https://api.solsentry.app
- Cloudflare Pages deployment

## Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Static/server | Landing with live stats-backed lookup entry |
| `/lookup` | Server | Universal wallet/mint lookup redirect |
| `/scan` | Server | Scan fallback for unknown wallet/mint inputs |
| `/operator/[wallet]` | Dynamic | Live operator risk profile |
| `/token/[mint]` | Dynamic | Live token risk profile and deployer context |
| `/network/[wallet]` | Dynamic | Operator graph view |
| `/drain/[wallet]` | Dynamic | Drain-trace view |
| `/share/operator/[wallet]` | Dynamic | Public read-only operator share card |
| `/dashboard`, `/live`, `/alerts` | Dynamic/client | Live network and alert surfaces |
| `/clusters`, `/clusters/[id]` | Dynamic | Bot-cluster registry and detail pages |
| `/top-operators`, `/operators`, `/tokens`, `/wallets` | Dynamic | Public directories |
| `/api`, `/docs`, `/mcp`, `/telegram`, `/x402` | Static/server | Integration and developer pages |
| `/pricing` | Static | Tiers and credit packs read live from `/v1/pricing` |
| `/lab/*`, `/screen`, `/dashboard/v3`, `/fun`, `/sidetrack` | Internal/noindex | Labs, presentation and experimental surfaces |

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run pages:build
```

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.solsentry.app` | REST API base URL |

## Notes

- Public claims should point back to `https://api.solsentry.app/v1/stats`.
- Precision is auditable per-mint at `/v1/predictions/{mint}` (live) — never
  publish a hardcoded accuracy/precision number or operator-level aggregate as
  a standing fact; re-verify live on the day.

## License

MIT

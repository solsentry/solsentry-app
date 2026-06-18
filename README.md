# solsentry-app

Public web app for [SolSentry](https://solsentry.app) — Solana threat
intelligence. Landing, lookup, operator/token pages, live dashboards and
integration docs.

Deployed continuously to https://solsentry.app via Cloudflare Pages.

## Stack

- Next.js 15.1 + React 19 + TypeScript 5.7
- App Router
- Static export where possible; SSR (edge runtime) for `/operator/[wallet]`
- Consumes the public REST API at https://api.solsentry.app

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
| `/pricing` | Static | Pricing shell; replace hardcoded values with live `/v1/pricing` when available |
| `/lab/*`, `/screen`, `/dashboard/v3`, `/fun`, `/sidetrack` | Internal/noindex | Labs, presentation and experimental surfaces |

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
```

## Build

```bash
npm run build          # standard Next.js production build
npm run pages:build    # Cloudflare Pages adapter build
```

## Deploy

Cloudflare Pages auto-deploys on push to `main`. Build command:

```
npx @cloudflare/next-on-pages
```

Output directory: `.vercel/output/static`

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.solsentry.app` | REST API base URL |

## License

MIT

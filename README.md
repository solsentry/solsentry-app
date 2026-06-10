# solsentry-app

> RugCheck tells you a fire is burning. SolSentry tells you who lit it.

Public web app for SolSentry. This repo serves the landing page, operator
lookup, and public docs surface for the operator-risk intelligence layer.

Live product:

- App: `https://solsentry.app`
- API: `https://api.solsentry.app/v1/stats`
- Infra backing the API: `Contabo US-East (66.94.105.185)`, migrated from
  Hetzner on `2026-06-09`
- Frontend hosting: `Cloudflare/Vercel` (not on the VPS)

## Canonical live snapshot

- `80,017` predictions tracked
- `91.2%` aggregate accuracy
- `97.9% CRITICAL precision - auditable per-mint`
- `95.3% HIGH precision`
- `94.4% MEDIUM precision`
- `10,112` operators profiled
- `7,004` serial ruggers identified
- `78.0%` dev wallet coverage
- `~1,367h` continuous runtime
- `v2.3.21`

## What this app exposes

- landing page and positioning for SolSentry
- live operator lookup UI
- public install/docs entrypoint for REST and MCP
- links to the wider public SolSentry surface

## Stack

- Next.js 15.1
- React 19
- TypeScript 5.7
- Cloudflare Pages deployment

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
- Use `97.9% CRITICAL precision - auditable per-mint` as the primary quality claim.

## License

MIT

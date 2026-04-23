# solsentry-app

Public web app for [SolSentry](https://solsentry.app) — Solana threat
intelligence. Landing, operator lookup, install/SDK/REST docs.

Deployed continuously to https://solsentry.app via Cloudflare Pages.

## Stack

- Next.js 15.1 + React 19 + TypeScript 5.7
- App Router
- Static export where possible; SSR (edge runtime) for `/operator/[wallet]`
- Consumes the public REST API at https://api.solsentry.app

## Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Static | Landing — hero + live network stats + 4kxscute case study |
| `/operator` | Static | Search form |
| `/operator/[wallet]` | Dynamic (edge) | Live operator risk profile |
| `/docs` | Static | Install MCP + SDK + REST docs |

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

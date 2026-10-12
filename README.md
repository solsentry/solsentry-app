# solsentry-app

The website at [solsentry.app](https://solsentry.app): one page about the SolSentry Android app, which turns a
phone into a verifier of public Solana data.

## What is served

- `/`: the landing page (`src/app/page.tsx`).
- `/.well-known/assetlinks.json`: Digital Asset Links for the Android app (`app.solsentry.mobile`), checked by
  wallets over Mobile Wallet Adapter.
- Any other path redirects to `/` (`src/middleware.ts`), so old shared links land on the page.

The previous site (all pages and branches) is kept in a separate private archive repository.

## Run

```bash
npm ci
npm run dev            # http://localhost:3000
npm run pages:build    # Cloudflare Workers bundle (OpenNext)
npx wrangler dev       # serve that bundle locally
```

Deployed on Cloudflare Workers from `main`.

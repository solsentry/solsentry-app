# SolSentry Site — Deployment Log
## feat/brand-v4-amber-cleanup

**Started:** 2026-05-09 ~05:00 BRT
**Goal:** Site funcional + brand âmbar v4 + /fun destaque + dashboard live, pronto pro Demo Day BR (12h)
**Constraint:** NÃO push pra main sem aprovação Crash

---

## Iteration 1 — Branch + brand v4 cores

**Status:** in progress

## ✅ Iteration 1 — Branch + brand v4 cores  COMPLETED

- Branch `feat/brand-v4-amber-cleanup` criada
- `globals.css` substituído por versão âmbar v4 (#C17D0E + Syne + DM Sans + JetBrains Mono)
- Fontes trocadas: Syne-Variable.ttf + DMSans-Variable.ttf (deletado SpaceGrotesk + Inter)
- Build limpo ✅

## ✅ Iteration 2 — Cleanup CRITICAL  COMPLETED

**Routes deletadas:** compare, partners, roadmap, submit, glossary, (pro), contact

**Components deletadas:**
- TokenSearchForm, DrainSearchForm, OperatorSearchForm
- MeProfile, RiskCard, LabelsManager, AskConsole, TokenCard
- WatchlistManager, WalletConnectButton, WalletProviders
- dashboard/ subdir (HunterStatus, MetricStrip, SideNav, TopBar)

**Public legacy deletadas:**
- index.html, index-v1.html, dashboard-legacy.html, docs.html, everything.html, explorer.html, colors_and_type.css
- /v5, /shared, /assets dirs (todos antigos)

**Mantido em /public:**
- favicon.svg, logo-shield.svg, logo-shield-reticle.svg
- alert-telegram-4kxscute.png
- /fonts (Syne, DMSans, JetBrainsMono)
- /references/solsentry-fun.html (usado pelo /fun)

**🔥 ROOT CAUSE do site quebrado:** `middleware.ts` reescrevia `/`, `/explorer`, `/everything`, `/docs` pra arquivos HTML estáticos legacy ao invés de servir páginas Next.js. **FIXADO** — middleware agora só faz redirect /v3 → root, deixa Next servir tudo dinamicamente.

**Components atualizados pra brand âmbar:**
- Nav.tsx — simplificado (5 links: Fun, MCP, Telegram, Docs + Live API ↗)
- Footer.tsx — 4 colunas (Product / API / Code / Talk)
- PillarGrid.tsx — 4 pillars com links pra rotas existentes ou API externa
- FeatureSurface.tsx — 8 features (4 internas + 4 externas pra api.solsentry.app)
- HeroScan.tsx — botões "Full JSON ↗" e "Trace drain ↗" apontam pra API externa
- layout.tsx — removido WalletProviders (não usado mais)

**Find/replace global:** `--brand-orange` → `--brand-amber` em todo src/

## ✅ Iteration 3 — Smoke test build + servidor  COMPLETED

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    45.5 kB         151 kB
├ ○ /_not-found                            990 B         103 kB
├ ○ /api                                   172 B         105 kB
├ ○ /docs                                  172 B         105 kB
├ ○ /fun                                   172 B         105 kB
├ ○ /mcp                                   172 B         105 kB
└ ○ /telegram                              172 B         105 kB
```

**HTTP smoke test (npm run start em localhost:3000):**
- GET / → 200 ✅
- GET /fun → 200 ✅
- GET /mcp → 200 ✅
- GET /telegram → 200 ✅
- GET /docs → 200 ✅
- GET /api → 200 ✅

Title + content validados via curl em todas as 6 rotas.

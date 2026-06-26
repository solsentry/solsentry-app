# AGENTS.md — solsentry-app (frontend SolSentry)

Site do SolSentry: **Next.js 15** (App Router, TS), deploy **Cloudflare Workers via GitHub Actions no merge p/ `main`**.
Backend = repo separado `solsentry` (NÃO está aqui). API pública = `https://api.solsentry.app` (free, sem auth).

## 📚 Contexto completo do site (LER conforme a tarefa)
Tudo consolidado em **`.agent/site-context/`** (gitignored — contexto local, não commitar):
- **`00_INDEX.md`** — começa aqui: estado ATUAL, o que já foi feito, o que falta, e a arquitetura do SCAN.
- `brand-voice/19_ANTI_POSITIONING.md` — **o gate de landmines (§2). LER antes de escrever qualquer copy.**
- `00_pack/` — design system v4 + voz + rotas + features de competidor (pack da tropa 21/06; punch-list parcialmente stale).
- `design-v0/` — ideias de design Vercel v0 + wireframe. `specs/` — sitemap + plano de rotas. `competitors/` — sitemaps.

## 🎯 Foco atual: arrumar o SCAN
Está fragmentado em várias superfícies. Referência correta = `quickEasyLookup()` em
`src/components/landing/LandingClient.tsx` (roteia operator→token→contract-analysis). Detalhe + endpoints em `.agent/site-context/00_INDEX.md §SCAN`.
Renderizar TODOS os campos reais que a API devolve (confere com `curl https://api.solsentry.app/v1/operator/<addr> | jq`); NÃO inventar campo inexistente.

## Comandos
```
npm run dev          # next dev :3000
npm run build        # next build
npm run lint         # eslint
npm run format       # prettier --write src
npm run format:check # prettier --check
```
Antes de fechar: `npm run build` verde + `git grep -niE "real.?time" src/` só com a negação aceitável do CaseStudy.

## 🚦 GATE de copy (resumo — autoridade `.agent/site-context/brand-voice/19_ANTI_POSITIONING.md §2)
NUNCA: "zero false positives" · "real-time" sem qualifier (→ "low-latency") · "AI-powered" (→ "ALife agents"/"operator graph") ·
mitologia (token #62 / 19min / 1.059) · agregados operator-level de SISTEMA (LOCK-01) · 4kxscute como pessoa nomeada (é wallet/cluster) ·
buzzword. SEMPRE: número só de `/v1/stats` live (nunca hardcodar) · "97.7% CRITICAL precision — auditable per-mint".

## Git
- `.agent/` é gitignored — nunca commitar (estratégia/competidor interna).
- Nunca commitar segredo. Deploy = automático no merge p/ `main` (cuidado: vai live na hora).
- i18n: detecção por `navigator.language` (pt-* → PT); dicionário em `src/lib/i18n-landing.ts`; render gated por locale.

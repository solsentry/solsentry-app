"use client";

import { useEffect, useState } from "react";

export interface SenaSubject {
  kind: "operator" | "token" | "drain";
  wallet?: string;
  mint?: string;
  symbol?: string | null;
  riskLevel?: string;
  riskScore?: number;
  confirmedRugs?: number;
  totalTokens?: number;
  rugRatePct?: number;
  tags?: string[];
  flags?: string[];
  hopCount?: number;
  totalSolDrained?: number;
  reachedCex?: boolean;
  reachedMixer?: boolean;
}

const TAG_TRANSLATIONS: Record<string, string> = {
  fast_deployer: "deploys rápidos (token novo a cada poucas horas)",
  serial_rugger: "rug em série (já queimou holders muitas vezes)",
  rebrand_artist: "rebrand artist (muda o nome do projeto pra esconder histórico)",
  bundle_launch: "launch coordenado em bundle (compras simuladas no minuto 0)",
  honeypot: "honeypot (você compra mas não consegue vender)",
  freeze_authority: "tem freeze authority — pode congelar sua wallet a qualquer momento",
  mint_authority: "tem mint authority — pode imprimir tokens infinitos",
  cex_exit: "cash-out via CEX detectado (Binance/Coinbase/etc)",
  mixer_exit: "lavagem via mixer detectada (Tornado/etc)",
  bot_cluster: "parte de cluster de bots coordenados",
  shill_network: "ligado a rede de shill no Twitter/Telegram",
  sniper_bot: "bot sniper — compra primeiro pra dumpar nos retail",
  insider_buy: "compra de insider antes do anúncio público",
};

function translateTag(tag: string): string {
  return TAG_TRANSLATIONS[tag] ?? tag.replace(/_/g, " ");
}

function buildExplanation(s: SenaSubject): string[] {
  const lines: string[] = [];
  if (s.kind === "operator") {
    if (s.confirmedRugs !== undefined && s.totalTokens !== undefined) {
      const rate = s.rugRatePct ?? 0;
      lines.push(
        `Esse operador deployou **${s.totalTokens.toLocaleString()} tokens** e **${s.confirmedRugs.toLocaleString()}** já viraram rug — taxa de **${rate.toFixed(1)}%**.`,
      );
      if (rate > 90) {
        lines.push(
          `**Quase tudo que ele lança é golpe.** Cada token novo é uma armadilha esperando comprador.`,
        );
      } else if (rate > 50) {
        lines.push(
          `Mais da metade dos lançamentos viram rug. Histórico sólido de fraude.`,
        );
      } else if (rate > 20) {
        lines.push(`Padrão misto — alguns projetos limpos, mas histórico tem múltiplos rugs.`);
      }
    }
    if (s.riskLevel === "CRITICAL") {
      lines.push(
        `Risk level: **CRITICAL ${s.riskScore ?? ""}**. SolSentry só marca CRITICAL com evidência forte — zero falso-positivos confirmados nessa categoria.`,
      );
    } else if (s.riskLevel === "HIGH") {
      lines.push(`Risk level: **HIGH ${s.riskScore ?? ""}**. Indicadores fortes de risco.`);
    }
  } else if (s.kind === "token") {
    if (s.symbol) {
      lines.push(`Token **${s.symbol}** (${s.mint ? s.mint.slice(0, 10) + "…" : ""}).`);
    }
    if (s.riskLevel === "CRITICAL") {
      lines.push(
        `**Risk CRITICAL ${s.riskScore ?? ""}/100.** Nossa convicção é alta: esse token tem padrão de rug ou já rugou.`,
      );
    } else if (s.riskLevel === "HIGH") {
      lines.push(`**Risk HIGH ${s.riskScore ?? ""}/100.** Múltiplos sinais de alerta.`);
    } else if (s.riskLevel === "SAFE") {
      lines.push(`Risk **SAFE ${s.riskScore ?? ""}/100**. Sem flags fortes detectadas até agora.`);
    } else {
      lines.push(`Risk **${s.riskLevel ?? "UNKNOWN"} ${s.riskScore ?? ""}/100**.`);
    }
  } else if (s.kind === "drain") {
    if (s.hopCount !== undefined && s.totalSolDrained !== undefined) {
      lines.push(
        `Trace de drain: **${s.hopCount} hops** seguidos, **${s.totalSolDrained.toFixed(2)} SOL** movimentados.`,
      );
    }
    if (s.reachedCex) {
      lines.push(`**Cash-out via CEX confirmado** — o dinheiro já saiu da blockchain.`);
    } else if (s.reachedMixer) {
      lines.push(`Lavagem via mixer detectada — rastro fica difícil daqui pra frente.`);
    }
  }

  const allTags = [...(s.tags ?? []), ...(s.flags ?? [])];
  if (allTags.length > 0) {
    lines.push(`**Tags detectadas:** ${allTags.slice(0, 6).map(translateTag).join(", ")}.`);
  }

  if (s.kind === "operator" && (s.rugRatePct ?? 0) > 50) {
    lines.push(
      `**Recomendação:** NÃO interagir com qualquer token desse deployer. Adiciona pra watchlist e a Telegram bot avisa quando ele lançar de novo.`,
    );
  } else if (s.kind === "token" && (s.riskScore ?? 0) >= 80) {
    lines.push(
      `**Recomendação:** NÃO comprar. Se tem posição, considere sair antes do liquidity pull.`,
    );
  } else if (s.kind === "drain") {
    lines.push(
      `Se foi você que perdeu o dinheiro, registra um caso com SolSentry — a gente faz dossiê forense pra grant nigeriano-style ou exchange recovery.`,
    );
  }

  return lines;
}

function renderInline(text: string): React.ReactNode {
  // Bold **x**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "var(--brand-amber)" }}>
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function SenaModal({ subject }: { subject: SenaSubject }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const lines = buildExplanation(subject);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 16px",
          background:
            "linear-gradient(135deg, var(--brand-amber) 0%, var(--brand-amber-400) 100%)",
          color: "var(--fg-on-brand)",
          border: 0,
          borderRadius: 6,
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "-0.01em",
          boxShadow: "0 2px 12px rgba(193, 125, 14, 0.3)",
        }}
      >
        🔥 Chamar Sena
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(16, 14, 10, 0.6)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 50,
              animation: "sena-fade 200ms ease",
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(440px, 92vw)",
              background: "var(--surface)",
              borderLeft: "1px solid var(--brand-amber-line)",
              zIndex: 51,
              padding: 24,
              overflowY: "auto",
              animation: "sena-slide 240ms ease",
              boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 30% 30%, var(--brand-amber-400), var(--brand-amber-600))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                    boxShadow: "0 0 24px var(--brand-amber-tint)",
                  }}
                >
                  ☀
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "var(--fg-1)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Sena explica
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    SolSentry · em português
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--fg-2)",
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                color: "var(--fg-1)",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {lines.length === 0 ? (
                <p style={{ color: "var(--fg-3)" }}>
                  Não tem dado suficiente pra fazer uma análise útil agora.
                </p>
              ) : (
                lines.map((l, i) => <p key={i} style={{ margin: 0 }}>{renderInline(l)}</p>)
              )}
            </div>

            <div
              style={{
                marginTop: 28,
                padding: 16,
                background: "var(--brand-amber-tint)",
                border: "1px solid var(--brand-amber-line)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--brand-amber)",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                QUER MONITORAR?
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--fg-1)", lineHeight: 1.6 }}>
                Adiciona pra Telegram bot{" "}
                <a
                  href="https://t.me/solsentryai"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--brand-amber)" }}
                >
                  @solsentryai
                </a>{" "}
                — recebe ping em tempo real toda vez que esse alvo movimentar.
              </p>
            </div>

            <div
              style={{
                marginTop: 16,
                fontSize: 11,
                color: "var(--fg-3)",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.6,
              }}
            >
              Sena é a explicação humanizada gerada com base nos dados que a SolSentry
              já coletou. Sem chamada de LLM, sem latência. Pressione Esc pra fechar.
            </div>
          </aside>
          <style>{`
            @keyframes sena-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes sena-fade { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </>
      )}
    </>
  );
}

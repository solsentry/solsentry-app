"use client";

// DossierClient — fetches /v1/dossier/{wallet} WITH the viewer's session cookie.
//
// The free /v1 mirror is tier-gated server-side: anonymous and Free callers get
// 403 {"error":"dossier_requires_pro","tier":"free","upgrade_url":"/pricing"},
// Pro gets 10 dossiers/month, B2B unlimited. So this cannot be a server
// component fetch (the site has no session there); it has to be the viewer's
// own credentials, and every gate state is shown as what it is.

import { useEffect, useState } from "react";
import Link from "next/link";
import { AddrLink } from "@/components/AddrLink";
import { RiskBadge } from "@/components/RiskBadge";
import { fetchWithSession, UnauthenticatedError } from "@/lib/api-session";
import type { Dossier } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "unauthenticated" }
  | { kind: "forbidden"; tier: string | null; upgradeUrl: string }
  | { kind: "error"; message: string }
  | { kind: "ready"; report: Dossier };

function fmtIso(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function fmtNum(v: number | null | undefined, suffix = ""): string {
  return v === null || v === undefined ? "—" : `${v.toLocaleString("en-US")}${suffix}`;
}

function KPI({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 140,
        padding: "10px 14px",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: 17,
          color: "var(--fg-1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ObjectRows({ obj }: { obj: Record<string, unknown> | null | undefined }) {
  const entries = obj
    ? Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
    : [];
  if (entries.length === 0) {
    return <div style={{ fontSize: 13, color: "var(--fg-3)" }}>No data in this report.</div>;
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gap: "6px 16px",
        fontSize: 13,
      }}
    >
      {entries.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <div style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {k}
          </div>
          <div
            style={{
              color: "var(--fg-1)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              wordBreak: "break-all",
            }}
          >
            {typeof v === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v) ? (
              <AddrLink addr={v} head={10} tail={6} />
            ) : typeof v === "object" ? (
              JSON.stringify(v)
            ) : (
              String(v)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 28 }}>
      <span className="eyebrow">{eyebrow}</span>
      {title && (
        <h2 className="section-title" style={{ marginTop: 4 }}>
          {title}
        </h2>
      )}
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

function Notice({
  children,
  tone = "warn",
}: {
  children: React.ReactNode;
  tone?: "warn" | "muted";
}) {
  return (
    <div
      style={{
        padding: "12px 16px",
        border: `1px solid ${tone === "warn" ? "var(--status-warning)" : "var(--border)"}`,
        borderRadius: 6,
        fontSize: 13,
        color: "var(--fg-2)",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH: "var(--brand-teal)",
  MEDIUM: "var(--brand-amber)",
  LOW: "var(--fg-3)",
};

export function DossierClient({ wallet }: { wallet: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchWithSession(`/v1/dossier/${encodeURIComponent(wallet)}`, {
          method: "GET",
        });
        if (cancelled) return;
        if (res.status === 403) {
          let tier: string | null = null;
          let upgradeUrl = "/pricing";
          try {
            const body = (await res.json()) as { tier?: string; upgrade_url?: string };
            tier = body.tier ?? null;
            if (body.upgrade_url) upgradeUrl = body.upgrade_url;
          } catch {
            /* body optional */
          }
          setState({ kind: "forbidden", tier, upgradeUrl });
          return;
        }
        if (!res.ok) {
          setState({ kind: "error", message: `API returned ${res.status}` });
          return;
        }
        const report = (await res.json()) as Dossier;
        setState({ kind: "ready", report });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof UnauthenticatedError) setState({ kind: "unauthenticated" });
        else
          setState({
            kind: "error",
            message: err instanceof Error ? err.message : "network error",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (state.kind === "loading") {
    return (
      <Notice tone="muted">
        Loading dossier… a first build for a wallet can take a minute or two.
      </Notice>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <Notice>
        Dossiers are served to signed-in accounts.{" "}
        <Link
          href={`/login?callback=/dossier/${wallet}`}
          className="btn-ghost"
          style={{ marginLeft: 8 }}
        >
          Sign in →
        </Link>
      </Notice>
    );
  }

  if (state.kind === "forbidden") {
    return (
      <Notice>
        Dossier is a Pro feature{state.tier ? ` (your tier: ${state.tier})` : ""}: 10 per month on
        Pro, unlimited on B2B.{" "}
        <Link href={state.upgradeUrl} className="btn-ghost" style={{ marginLeft: 8 }}>
          See pricing →
        </Link>
      </Notice>
    );
  }

  if (state.kind === "error") {
    return (
      <Notice>
        Dossier unavailable right now ({state.message}). A first build for a wallet can take a
        minute or two — reload shortly.
      </Notice>
    );
  }

  const { report } = state;
  const sources = report.sources ?? [];
  const errors = (report.errors ?? []).filter((e) => e !== "cache_hit");
  const signals = report.identity_signals ?? [];
  const cexExits = report.cex_exits ?? [];
  const siblings = report.timing_siblings ?? [];
  const isEmpty = sources.length === 0 && signals.length === 0 && !report.operator_id;
  const confidence = (report.confidence ?? "").toUpperCase();

  return (
    <>
      <Block eyebrow="Summary">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: "1px solid var(--border)",
            borderRadius: 6,
            background: "var(--bg-2)",
          }}
        >
          <KPI
            label="Risk"
            value={report.risk_level ? <RiskBadge level={report.risk_level} /> : "—"}
          />
          <KPI label="Rug rate" value={fmtNum(report.rug_rate_pct, "%")} />
          <KPI label="Tokens deployed" value={fmtNum(report.total_tokens)} />
          <KPI label="Confirmed rugs" value={fmtNum(report.confirmed_rugs)} />
          <KPI
            label="Confidence"
            value={
              <span style={{ color: CONFIDENCE_COLOR[confidence] ?? "var(--fg-2)" }}>
                {confidence || "—"}
              </span>
            }
          />
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "var(--fg-3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          built {fmtIso(report.built_at)} ·{" "}
          {report.cached ? "served from cache (≤ 7 d)" : "fresh build"} · sources:{" "}
          {sources.length > 0 ? sources.join(", ") : "none"}
          {report.operator_id ? (
            <>
              {" "}
              · operator <AddrLink addr={report.operator_id} head={8} tail={6} />
            </>
          ) : null}
        </div>
        {isEmpty && (
          <div style={{ marginTop: 12 }}>
            <Notice>
              This report is empty: no source answered and no operator is linked to the wallet. That
              is not a clean bill of health — it means SolSentry has no tracked history for it yet.
            </Notice>
          </div>
        )}
        {errors.length > 0 && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "var(--status-warning)",
              fontFamily: "var(--font-mono)",
            }}
          >
            errors: {errors.join(" · ")}
          </div>
        )}
      </Block>

      <Block eyebrow="Genesis" title="Where the first SOL came from">
        <ObjectRows obj={report.genesis} />
      </Block>

      <Block eyebrow="Funders" title="First and second funder">
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              first funder
            </div>
            <ObjectRows obj={report.first_funder} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              second funder
            </div>
            <ObjectRows obj={report.second_funder} />
          </div>
        </div>
      </Block>

      <Block
        eyebrow="Identity signals"
        title={`${signals.length} signal${signals.length === 1 ? "" : "s"}`}
      >
        {signals.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
            No identity signals in this report.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {signals.map((s, i) => (
              <div
                key={`${s.kind ?? "signal"}-${i}`}
                style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px" }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)" }}
                  >
                    {s.kind ?? "signal"}
                  </span>
                  {s.confidence && (
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        color: CONFIDENCE_COLOR[s.confidence.toUpperCase()] ?? "var(--fg-3)",
                      }}
                    >
                      {s.confidence}
                    </span>
                  )}
                </div>
                {s.description && (
                  <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 4 }}>
                    {s.description}
                  </div>
                )}
                {s.evidence && Object.keys(s.evidence).length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <ObjectRows obj={s.evidence} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Block>

      <Block
        eyebrow="CEX exits"
        title={`${cexExits.length} exit${cexExits.length === 1 ? "" : "s"}`}
      >
        {cexExits.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--fg-3)" }}>No CEX exits in this report.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {cexExits.map((exit, i) => (
              <div
                key={i}
                style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px" }}
              >
                <ObjectRows
                  obj={
                    typeof exit === "object" && exit !== null
                      ? (exit as Record<string, unknown>)
                      : { value: exit }
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Block>

      {siblings.length > 0 && (
        <Block
          eyebrow="Timing siblings"
          title={`${siblings.length} wallet${siblings.length === 1 ? "" : "s"} funded in the same window`}
        >
          <div style={{ display: "grid", gap: 8 }}>
            {siblings.map((sib, i) => (
              <div
                key={i}
                style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px" }}
              >
                <ObjectRows
                  obj={
                    typeof sib === "object" && sib !== null
                      ? (sib as Record<string, unknown>)
                      : { value: sib }
                  }
                />
              </div>
            ))}
          </div>
        </Block>
      )}
    </>
  );
}

import { ProShell } from "@/components/ProShell";
import { fetchBrainSkills } from "@/lib/api";

export const revalidate = 120;

export const metadata = {
  title: "Brain skills — TP/FP per detection",
  description:
    "SolSentry brain skills — true-positive vs false-positive ratios per detection signal. Live precision from outcome resolutions.",
};

interface SkillRow {
  name: string;
  description?: string;
  tp: number;
  fp: number;
  precision: number;
  fired: number;
}

function normalize(raw: Record<string, unknown>): SkillRow {
  const tpCandidate =
    (raw.tp as number | undefined) ??
    (raw.true_positives as number | undefined) ??
    (raw.true_positive as number | undefined) ??
    0;
  const fpCandidate =
    (raw.fp as number | undefined) ??
    (raw.false_positives as number | undefined) ??
    (raw.false_positive as number | undefined) ??
    0;
  const tp = Number.isFinite(tpCandidate) ? Number(tpCandidate) : 0;
  const fp = Number.isFinite(fpCandidate) ? Number(fpCandidate) : 0;
  const total = tp + fp;
  const precisionRaw =
    (raw.precision as number | undefined) ??
    (raw.precision_pct as number | undefined);
  let precision = total > 0 ? tp / total : 0;
  if (precisionRaw !== undefined && Number.isFinite(precisionRaw)) {
    precision = precisionRaw > 1 ? precisionRaw / 100 : precisionRaw;
  }
  return {
    name: String(raw.name ?? raw.invariant ?? raw.skill ?? "unknown"),
    description: raw.description ? String(raw.description) : undefined,
    tp,
    fp,
    precision,
    fired:
      (raw.fired as number | undefined) ??
      (raw.firings as number | undefined) ??
      total,
  };
}

export default async function SkillsPage() {
  const data = await fetchBrainSkills();
  const rawSkills = (data?.skills ?? []) as Record<string, unknown>[];

  const skills: SkillRow[] = rawSkills
    .map(normalize)
    .filter((s) => s.fired > 0 || s.tp + s.fp > 0)
    .sort((a, b) => b.precision - a.precision);

  return (
    <ProShell>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            BRAIN · SKILLS · sorted by precision
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            Detection skill audit
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 6 }}>
            Each skill is one detection signal the brain can fire. Ground-truth
            comes from token outcome resolutions — we count true positives
            against false positives per skill in production. Green = trustworthy
            (&gt;75%). Amber = monitored (40–75%). Red = under review (&lt;40%).
          </p>
        </header>

        {skills.length === 0 ? (
          <div
            style={{
              padding: 24,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Skills endpoint returned no data. Check{" "}
            <a
              href="https://api.solsentry.app/v1/brain/skills"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--brand-amber)" }}
            >
              /v1/brain/skills
            </a>
            .
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {skills.map((s) => {
              const pct = s.precision * 100;
              const color =
                pct >= 75
                  ? "var(--brand-teal)"
                  : pct >= 40
                    ? "var(--brand-amber)"
                    : "var(--status-critical)";
              const bg =
                pct >= 75
                  ? "var(--brand-teal-tint)"
                  : pct >= 40
                    ? "var(--brand-amber-tint)"
                    : "var(--status-critical-tint)";
              return (
                <li
                  key={s.name}
                  style={{
                    padding: 14,
                    background: "var(--surface)",
                    border: `1px solid var(--border)`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--fg-1)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 22,
                        color,
                        letterSpacing: "-0.01em",
                        background: bg,
                        padding: "2px 10px",
                        borderRadius: 4,
                      }}
                    >
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  {s.description && (
                    <p
                      style={{
                        margin: "4px 0 8px",
                        color: "var(--fg-2)",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      {s.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-3)",
                    }}
                  >
                    <span>
                      TP{" "}
                      <strong style={{ color: "var(--brand-teal)" }}>
                        {s.tp.toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      FP{" "}
                      <strong style={{ color: "var(--status-critical)" }}>
                        {s.fp.toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      Fired{" "}
                      <strong style={{ color: "var(--fg-1)" }}>
                        {s.fired.toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ProShell>
  );
}

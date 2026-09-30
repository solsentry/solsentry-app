import { ProShell } from "@/components/ProShell";
import { fetchBrainSkills } from "@/lib/api";

export const revalidate = 120;

export const metadata = {
  title: "Brain skills — detection signals",
  description:
    "SolSentry brain skills — the detection signals the brain can fire, with firing counts.",
};

interface SkillRow {
  name: string;
  description?: string;
  fired: number;
}

function normalize(raw: Record<string, unknown>): SkillRow {
  const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const outcomes =
    num(raw.tp ?? raw.true_positives ?? raw.true_positive) +
    num(raw.fp ?? raw.false_positives ?? raw.false_positive);
  return {
    name: String(raw.name ?? raw.invariant ?? raw.skill ?? "unknown"),
    description: raw.description ? String(raw.description) : undefined,
    fired: num(raw.fired ?? raw.firings) || outcomes,
  };
}

export default async function SkillsPage() {
  const data = await fetchBrainSkills();
  const rawSkills = (data?.skills ?? []) as Record<string, unknown>[];

  const skills: SkillRow[] = rawSkills
    .map(normalize)
    .filter((s) => s.fired > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

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
            BRAIN · SKILLS · sorted by name
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
            Each skill is one detection signal the brain can fire. Per-signal outcome statistics are
            paused until the next re-measurement; firing counts below are raw volume.
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
              return (
                <li
                  key={s.name}
                  style={{
                    padding: 14,
                    background: "var(--surface)",
                    border: `1px solid var(--border)`,
                    borderLeft: "3px solid var(--brand-amber)",
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
                      Fired{" "}
                      <strong style={{ color: "var(--fg-1)" }}>{s.fired.toLocaleString()}</strong>
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

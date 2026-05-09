import Link from "next/link";

export function FunCallout() {
  return (
    <section className="section-pad">
      <div className="container">
        <div
          style={{
            border: "2px solid var(--brand-amber)",
            borderRadius: "var(--radius-lg)",
            background:
              "linear-gradient(135deg, rgba(193,125,14,0.06) 0%, rgba(193,125,14,0.02) 100%)",
            padding: "48px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            className="eyebrow"
            style={{ color: "var(--brand-amber)", marginBottom: 16, display: "block" }}
          >
            Consumer-facing · 3 modes · 1 API
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--fg-1)",
              marginBottom: 18,
            }}
          >
            Is this wallet{" "}
            <span style={{ color: "var(--brand-amber)" }}>safe?</span>
          </h2>
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 18,
              lineHeight: 1.6,
              maxWidth: 640,
              margin: "0 auto 32px",
            }}
          >
            Easy mode: paste any Solana wallet, get an emoji + plain-English
            verdict. No login. No jargon. Three personas — Easy, Pro, Dev — same
            intelligence layer.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/fun"
              className="btn-primary"
              style={{ fontSize: 16, padding: "14px 28px" }}
            >
              Open Fun mode →
            </Link>
            <a
              href="/references/solsentry-fun.html"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ fontSize: 16, padding: "14px 28px" }}
            >
              Fullscreen ↗
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginTop: 40,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {[
              {
                t: "Easy",
                d: "emoji + verdict",
                tag: "consumers",
                color: "var(--brand-amber)",
              },
              {
                t: "Pro",
                d: "live dashboard",
                tag: "traders",
                color: "var(--brand-teal)",
              },
              {
                t: "Dev",
                d: "endpoints + curl",
                tag: "developers",
                color: "var(--brand-purple)",
              },
            ].map((m) => (
              <div
                key={m.t}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 14px",
                  background: "var(--bg-elev-1)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: m.color,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {m.tag}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--fg-1)",
                    marginBottom: 4,
                  }}
                >
                  {m.t}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--fg-3)",
                  }}
                >
                  {m.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

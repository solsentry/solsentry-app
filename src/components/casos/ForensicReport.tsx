import React from "react";

/**
 * ForensicReport — long-form wrapper for /casos/* pages.
 * Bellingcat-inspired: dense prose, evidence-cited, clean typography.
 */
export function ForensicReport({ children }: { children: React.ReactNode }) {
  return (
    <article
      style={{
        maxWidth: 760,
        margin: "0 auto",
        color: "var(--fg-2)",
        fontSize: 16,
        lineHeight: 1.75,
      }}
    >
      {children}
    </article>
  );
}

export function ReportHero({
  eyebrow,
  title,
  byline,
  readingTime,
  date,
}: {
  eyebrow: string;
  title: string;
  byline: string;
  readingTime: string;
  date: string;
}) {
  return (
    <header
      style={{
        background: "var(--bg-elev-1)",
        borderBottom: "1px solid var(--border)",
        padding: "64px 24px 48px",
        marginBottom: 40,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            color: "var(--brand-amber)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: "var(--fg-1)",
            margin: "0 0 24px",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            color: "var(--fg-3)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          <span>{byline}</span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span>{date}</span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </header>
  );
}

export function ReportSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 700,
          color: "var(--fg-1)",
          margin: "0 0 20px",
          letterSpacing: "-0.015em",
        }}
      >
        <span
          style={{
            color: "var(--brand-amber)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            marginRight: 12,
            verticalAlign: "middle",
          }}
        >
          § {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function VerdictBox({ children }: { children: React.ReactNode }) {
  return (
    <aside
      style={{
        border: "1px solid var(--brand-amber)",
        background: "var(--brand-amber-tint)",
        borderLeftWidth: 4,
        padding: "20px 24px",
        margin: "32px 0",
        color: "var(--fg-1)",
        fontSize: 17,
        lineHeight: 1.6,
      }}
    >
      {children}
    </aside>
  );
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.85em",
        background: "var(--bg-elev-1)",
        border: "1px solid var(--border-soft)",
        padding: "2px 6px",
        borderRadius: 3,
        color: "var(--fg-1)",
        wordBreak: "break-all",
      }}
    >
      {children}
    </code>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "var(--bg-elev-1)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--brand-amber)",
        padding: 16,
        fontFamily: "var(--font-mono)",
        fontSize: 12.5,
        lineHeight: 1.6,
        color: "var(--fg-1)",
        overflow: "auto",
        margin: "20px 0",
      }}
    >
      {children}
    </pre>
  );
}

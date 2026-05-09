interface Props {
  endpoint: string;
  message?: string;
}

export function ApiError({ endpoint, message }: Props) {
  return (
    <div
      className="panel"
      style={{
        borderColor: "var(--status-critical)",
        background: "rgba(255,68,68,0.06)",
      }}
    >
      <div
        className="label-tag"
        style={{ color: "var(--status-critical)", marginBottom: 10 }}
      >
        API unavailable
      </div>
      <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>
        {message ||
          "Could not reach the API. The service may be temporarily down or this resource may not exist."}
      </p>
      <div style={{ marginTop: 12 }}>
        <a
          href={`https://api.solsentry.app${endpoint}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--brand-amber)",
            wordBreak: "break-all",
          }}
        >
          {`https://api.solsentry.app${endpoint}`} ↗
        </a>
      </div>
    </div>
  );
}

interface Props {
  values: number[];
  height?: number;
  color?: string;
  bgColor?: string;
  label?: string;
}

export function Sparkbars({
  values,
  height = 80,
  color = "var(--brand-amber)",
  bgColor = "var(--surface-2)",
  label,
}: Props) {
  const safe = (values ?? []).filter((v) => Number.isFinite(v));
  if (safe.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg-3)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          background: bgColor,
          borderRadius: 4,
        }}
      >
        no trend yet
      </div>
    );
  }
  const max = Math.max(...safe, 1);
  const min = Math.min(...safe, 0);
  const range = Math.max(max - min, 1);
  return (
    <div>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-3)",
            marginBottom: 4,
          }}
        >
          {label} (max {max.toFixed(1)} / min {min.toFixed(1)})
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          height,
          background: bgColor,
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid var(--border)",
        }}
      >
        {safe.map((v, i) => {
          const h = ((v - min) / range) * (height - 12) + 4;
          return (
            <div
              key={i}
              title={`${v.toFixed(1)}`}
              style={{
                flex: 1,
                height: h,
                background: color,
                borderRadius: 2,
                opacity: 0.8,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

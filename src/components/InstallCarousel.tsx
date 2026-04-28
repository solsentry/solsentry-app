"use client";

import { useEffect, useState } from "react";

const COMMANDS = [
  { label: "Run the MCP", cmd: "npx -y @solsentry/mcp" },
  { label: "Hit the REST API", cmd: "curl https://api.solsentry.app/v1/stats" },
  { label: "Open the bot", cmd: "t.me/solsentryai" },
];

const ROTATE_MS = 3500;

export function InstallCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % COMMANDS.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const current = COMMANDS[idx];

  return (
    <div className="install-carousel">
      <div className="install-label">{current.label}</div>
      <div className="hero-install" role="region" aria-live="polite">
        <span className="prompt">$</span>
        <span className="cmd" key={idx}>
          {current.cmd}
        </span>
      </div>
      <div className="install-dots">
        {COMMANDS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show ${COMMANDS[i].label}`}
            className={`install-dot ${i === idx ? "active" : ""}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

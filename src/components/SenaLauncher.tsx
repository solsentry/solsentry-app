"use client";

import { useRef, useState } from "react";
import { SenaDrawer, type SenaEntity } from "./SenaDrawer";

export function SenaLauncher({ entity }: { entity: SenaEntity }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Sena AI chat"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="sena-launcher"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, var(--brand-amber-400), var(--brand-amber-600))",
          border: "1px solid var(--brand-amber-line)",
          color: "var(--fg-on-brand)",
          cursor: "pointer",
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 20px rgba(193, 125, 14, 0.45), 0 0 0 0 var(--brand-amber-tint)",
          zIndex: 55,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
        }}
      >
        <span aria-hidden>☀</span>
      </button>
      <SenaDrawer
        entity={entity}
        open={open}
        onClose={() => setOpen(false)}
        launcherRef={buttonRef}
      />
      <style>{`
        @keyframes sena-launcher-pulse {
          0% { box-shadow: 0 4px 20px rgba(193, 125, 14, 0.45), 0 0 0 0 rgba(193, 125, 14, 0.4); }
          70% { box-shadow: 0 4px 20px rgba(193, 125, 14, 0.45), 0 0 0 14px rgba(193, 125, 14, 0); }
          100% { box-shadow: 0 4px 20px rgba(193, 125, 14, 0.45), 0 0 0 0 rgba(193, 125, 14, 0); }
        }
        .sena-launcher {
          animation: sena-launcher-pulse 2.4s ease-out 3;
        }
        .sena-launcher:hover {
          transform: scale(1.05);
          transition: transform 160ms ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .sena-launcher { animation: none !important; }
          .sena-launcher:hover { transform: none !important; }
        }
      `}</style>
    </>
  );
}

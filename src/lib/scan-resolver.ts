export type ScanKind = "operator" | "token" | "contract" | "unknown" | "error";

export interface ScanResult {
  kind: ScanKind;
  addr: string;
  data: any;
  narrative?: string;
}

export function getUnknown(addr: string): ScanResult {
  return {
    kind: "unknown",
    addr,
    data: {
      known: false,
      risk_level: "UNKNOWN",
      tags: [],
    },
  };
}

export async function quickEasyLookup(raw: string): Promise<ScanResult | null> {
  const v = raw.trim();
  if (v.length < 32) return null;

  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";
  const get = async (path: string) => {
    const r = await fetch(`${API}${path}`, { cache: "no-store" });
    return r.ok ? r.json() : null;
  };

  try {
    const op = await get(`/v1/operator/${encodeURIComponent(v)}`);
    if (op && (op.known || (op.confirmed_rugs ?? 0) > 0)) {
      return { kind: "operator", addr: v, data: op };
    }

    const tk = await get(`/v1/token/${encodeURIComponent(v)}`);
    if (tk && !tk.error) {
      // Tokens may be sparse in the /token response (e.g. missing symbol, operator)
      // We can enrich it via a background contract-analysis query
      try {
        const ca = await get(`/v1/contract-analysis/${encodeURIComponent(v)}`);
        if (ca && !ca.error) {
          if (!tk.symbol) {
            const tm = ca.extensions?.extensions?.find((e: any) => e.extension_name === 'tokenMetadata');
            if (tm?.detail?.symbol) {
              tk.symbol = tm.detail.symbol;
            } else if (ca.known_label) {
              tk.symbol = ca.known_label;
            }
          }
        }
      } catch (e) {
        // Ignore CA fetch errors for enrichment
      }
      return { kind: "token", addr: v, data: tk };
    }

    const ca = await get(`/v1/contract-analysis/${encodeURIComponent(v)}`);
    if (ca && !ca.error) {
      return { kind: "contract", addr: v, data: ca };
    }
  } catch {
    return getUnknown(v);
  }

  return getUnknown(v);
}

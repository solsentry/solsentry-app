const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

export interface NetworkStats {
  total_predictions: number;
  pending: number;
  resolved: number;
  resolve_rate_pct: number;
  accuracy_pct: number;
  high_risk_alerts: number;
  confirmed_rugs: number;
  confirmed_safe: number;
  total_operators: number;
  serial_ruggers: number;
  wallets_with_confirmed_rugs: number;
  wallet_profiles_tracked: number;
  bot_clusters: number;
  runtime_hours: number;
}

export interface Operator {
  wallet: string;
  known: boolean;
  risk_level?: string;
  risk_score?: number;
  risk_label?: string;
  confirmed_rugs?: number;
  total_tokens?: number;
  rug_rate_pct?: number;
  tags?: string[];
  patterns?: string[];
}

export async function fetchStats(): Promise<NetworkStats | null> {
  try {
    const res = await fetch(`${API_URL}/v1/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as NetworkStats;
  } catch {
    return null;
  }
}

export async function fetchTopOperators(limit = 10): Promise<Operator[]> {
  try {
    const res = await fetch(`${API_URL}/v1/top-operators?limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.operators ?? []) as Operator[];
  } catch {
    return [];
  }
}

export async function fetchOperator(wallet: string): Promise<Operator | null> {
  try {
    const res = await fetch(`${API_URL}/v1/operator/${encodeURIComponent(wallet)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Operator;
  } catch {
    return null;
  }
}

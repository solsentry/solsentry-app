const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

const TTL = {
  stats: 60,
  topOperators: 300,
  operator: 30,
  token: 30,
  timeline: 60,
  alerts: 10,
  resolutions: 10,
  clusters: 120,
  cluster: 120,
  x402: 300,
  hunters: 30,
  dossier: 300,
} as const;

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

export interface TopOperator {
  rank: number;
  wallet: string;
  confirmed_rugs: number;
  total_tokens: number;
  pending: number;
  rug_rate_pct: number;
  risk_label?: string;
  tags?: string[];
}

export interface Alert {
  mint: string;
  symbol?: string | null;
  risk_score: number;
  risk_level: string;
  predicted_at: number;
  age_seconds?: number;
  dev_wallet?: string | null;
  dev_known?: boolean;
  dev_confirmed_rugs?: number;
  flags?: string[];
}

export interface Resolution {
  mint: string;
  symbol?: string | null;
  predicted_risk: number;
  predicted_level: string;
  final_outcome: string;
  was_correct: boolean;
  predicted_at: number;
  resolved_at: number;
  resolve_latency_hours?: number;
  dev_wallet?: string | null;
}

export interface Cluster {
  cluster_id: string;
  size: number;
  first_seen: number;
  last_seen: number;
  shared_funding_source?: string | null;
  funding_source_classification?: string | null;
  associated_rugs?: number;
  associated_tokens?: number;
  risk_score?: number;
  risk_level?: string;
  tags?: string[];
  sample_wallets?: string[];
  operators?: string[];
}

export interface TimelineToken {
  mint: string;
  symbol?: string | null;
  deployed_at: number;
  risk_score: number;
  risk_level: string;
  final_outcome: string;
  resolved_at?: number | null;
  time_to_rug_seconds?: number | null;
  platform?: string | null;
  liquidity_peak_usd?: number | null;
}

export interface OperatorTimeline {
  wallet: string;
  known: boolean;
  operator_id?: string;
  risk_label?: string;
  risk_level?: string;
  total_tokens_in_window: number;
  confirmed_rugs_in_window: number;
  first_seen: number;
  last_seen: number;
  tokens: TimelineToken[];
}

export interface Token {
  mint: string;
  known: boolean;
  risk_score?: number;
  risk_level?: string;
  final_outcome?: string;
  flags?: string[];
  is_bundle?: boolean;
  dev_wallet?: string | null;
  operator?: string | null;
  symbol?: string | null;
  predicted_at?: string | null;
}

export interface X402Stats {
  total_queries: number;
  total_usdc_billed: number;
  unique_clients: number;
  by_tool: Record<string, number>;
}

export interface DrainHop {
  from?: string;
  to?: string;
  amount_sol?: number;
  timestamp?: number;
  signature?: string;
  classification?: string;
}

export interface DrainTrace {
  wallet: string;
  origin_token?: string;
  origin_risk?: number;
  hop_count: number;
  total_sol_drained: number;
  reached_cex: boolean;
  reached_mixer: boolean;
  hops: DrainHop[];
  endpoints: {
    address?: string;
    classification?: string;
    amount_sol?: number;
  }[];
  trace_time_ms?: number;
  latency_ms?: number;
}

async function safeFetch<T>(
  path: string,
  revalidate: number,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchStats(): Promise<NetworkStats | null> {
  return safeFetch<NetworkStats>("/v1/stats", TTL.stats);
}

export async function fetchTopOperators(limit = 10): Promise<TopOperator[]> {
  const data = await safeFetch<{ operators: TopOperator[] }>(
    `/v1/top-operators?limit=${limit}`,
    TTL.topOperators,
  );
  return data?.operators ?? [];
}

export async function fetchOperator(wallet: string): Promise<Operator | null> {
  return safeFetch<Operator>(
    `/v1/operator/${encodeURIComponent(wallet)}`,
    TTL.operator,
  );
}

export async function fetchOperatorTimeline(
  wallet: string,
): Promise<OperatorTimeline | null> {
  return safeFetch<OperatorTimeline>(
    `/v1/operator/${encodeURIComponent(wallet)}/timeline`,
    TTL.timeline,
  );
}

export async function fetchToken(mint: string): Promise<Token | null> {
  return safeFetch<Token>(`/v1/token/${encodeURIComponent(mint)}`, TTL.token);
}

export async function fetchAlertsRecent(limit = 20): Promise<Alert[]> {
  const data = await safeFetch<{ alerts: Alert[] }>(
    `/v1/alerts/recent?limit=${limit}`,
    TTL.alerts,
  );
  return data?.alerts ?? [];
}

export async function fetchResolutionsRecent(
  limit = 20,
): Promise<Resolution[]> {
  const data = await safeFetch<{ resolutions: Resolution[] }>(
    `/v1/resolutions/recent?limit=${limit}`,
    TTL.resolutions,
  );
  return data?.resolutions ?? [];
}

export async function fetchClusters(
  limit = 20,
): Promise<{ clusters: Cluster[]; total_clusters: number }> {
  const data = await safeFetch<{ clusters: Cluster[]; total_clusters: number }>(
    `/v1/clusters?limit=${limit}`,
    TTL.clusters,
  );
  return data ?? { clusters: [], total_clusters: 0 };
}

export async function fetchCluster(clusterId: string): Promise<Cluster | null> {
  return safeFetch<Cluster>(
    `/v1/cluster/${encodeURIComponent(clusterId)}`,
    TTL.cluster,
  );
}

export async function fetchX402Stats(): Promise<X402Stats | null> {
  return safeFetch<X402Stats>("/v1/x402/stats", TTL.x402);
}

export async function fetchDrainTrace(
  wallet: string,
): Promise<DrainTrace | null> {
  return safeFetch<DrainTrace>(
    `/v1/drain-trace/${encodeURIComponent(wallet)}`,
    60,
  );
}

export interface InvariantsCheck {
  ok: boolean;
  checks?: Record<string, unknown>;
  failures?: string[];
  [key: string]: unknown;
}

export async function fetchInvariants(): Promise<InvariantsCheck | null> {
  return safeFetch<InvariantsCheck>("/health/invariants", 30);
}

export interface OperatorNetwork {
  wallet: string;
  nodes: { address: string; type?: string; risk?: number }[];
  edges: { from: string; to: string; weight?: number; kind?: string }[];
  [key: string]: unknown;
}

export async function fetchOperatorNetwork(
  wallet: string,
): Promise<OperatorNetwork | null> {
  return safeFetch<OperatorNetwork>(
    `/v1/operator/${encodeURIComponent(wallet)}/network`,
    120,
  );
}

export interface HuntersActive {
  count_total: number;
  count_hunting: number;
  hunters: {
    agent_id: string;
    target_wallet: string;
    origin_token?: string;
    risk_score: number;
    generation: number;
    label?: string | null;
    discoveries_total?: number;
    total_sol_moved?: number;
    hunt_count?: number;
    last_activity_age_s?: number;
  }[];
}

export async function fetchHuntersActive(): Promise<HuntersActive | null> {
  return safeFetch<HuntersActive>("/v1/hunters/active", TTL.hunters);
}

export async function fetchHuntersActiveCount(): Promise<number | undefined> {
  const data = await fetchHuntersActive();
  return data?.count_total;
}

export interface Dossier {
  wallet: string;
  built_at?: string;
  schema_version?: number;
  operator_id?: string | null;
  risk_level?: string | null;
  rug_rate_pct?: number | null;
  total_tokens?: number | null;
  confirmed_rugs?: number | null;
  genesis?: unknown;
  first_funder?: unknown;
  second_funder?: unknown;
  cex_exits?: unknown[];
  identity?: unknown;
}

export async function fetchDossier(wallet: string): Promise<Dossier | null> {
  return safeFetch<Dossier>(
    `/v1/dossier/${encodeURIComponent(wallet)}`,
    TTL.dossier,
  );
}

export function truncate(addr: string, head = 6, tail = 4): string {
  if (!addr || addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function fmtInt(n: number | undefined | null): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number | undefined | null, digits = 1): string {
  if (n === undefined || n === null) return "—";
  return `${n.toFixed(digits)}%`;
}

export function fmtAgeSeconds(seconds: number | undefined | null): string {
  if (seconds === undefined || seconds === null) return "—";
  const s = Math.floor(seconds);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function fmtUnixAge(ts: number): string {
  return fmtAgeSeconds(Date.now() / 1000 - ts);
}

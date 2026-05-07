import { fetchStats, fetchHuntersActiveCount } from "@/lib/api";
import { SideNav } from "@/components/dashboard/SideNav";
import { TopBar } from "@/components/dashboard/TopBar";

export const revalidate = 60;

export default async function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Best-effort live numbers — fall back gracefully if API unreachable.
  const [stats, hunterCount] = await Promise.all([
    fetchStats().catch(() => null),
    fetchHuntersActiveCount().catch(() => undefined),
  ]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar
        runtimeHours={stats?.runtime_hours}
        totalScans={stats?.total_predictions}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          flex: 1,
          minHeight: 0,
        }}
        className="solsentry-pro-grid"
      >
        <SideNav hunterCount={hunterCount} />
        <main
          style={{
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solsentry-pro-grid {
            grid-template-columns: 1fr !important;
          }
          .solsentry-pro-grid > aside {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

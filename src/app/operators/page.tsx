import { ProShell } from "@/components/ProShell";
import { OperatorsTable } from "@/components/operators-table";

export const metadata = {
  title: "Top Operators - SolSentry",
  description: "Leaderboard of known Solana operators",
};

export default function OperatorsPage() {
  return (
    <ProShell>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold text-[var(--fg-1)]">
            Top Operators
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-3)]">
            Leaderboard of the most active serial deployers and token operators.
          </p>
        </div>
        <OperatorsTable />
      </div>
    </ProShell>
  );
}

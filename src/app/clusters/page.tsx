import { ProShell } from "@/components/ProShell";
import { BotClusterSunburst } from "@/components/bot-cluster-sunburst";

export const revalidate = 120;

export const metadata = {
  title: "Bot clusters — coordinated wallet groups",
  description:
    "Solana bot cluster registry. Groups of wallets sharing funding sources, deployment patterns, or coordinated trading.",
};

export default function ClustersPage() {
  return (
    <ProShell>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold text-[var(--fg-1)]">
            Coordinated Wallet Groups
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-3)]">
            Clusters are sets of wallets identified as coordinated — through shared funding, identical bot cluster behaviour, or matching deployment fingerprints.
          </p>
        </div>
        <BotClusterSunburst />
      </div>
    </ProShell>
  );
}

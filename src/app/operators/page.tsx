import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { ApiError } from "@/components/ApiError";
import { ProShell } from "@/components/ProShell";
import { OperatorsTable } from "@/components/OperatorsTable";
import { fetchTopOperators } from "@/lib/api";

export const revalidate = 300;

export const metadata = {
  title: "Operators directory — every tracked Solana deployer",
  description:
    "Dense, filterable directory of every Solana operator SolSentry tracks. Filter by CRITICAL, HIGH, serial, or new. Sort by rug rate, token count, or confirmed rugs.",
};

export default async function OperatorsDirectoryPage() {
  const ops = await fetchTopOperators(50);

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow="Operators directory"
          title="Every operator we track"
          sub="Dense table of Solana operators ranked by confirmed rug count. Filter by risk band, search by wallet prefix, click any row for the full profile."
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a href="https://api.solsentry.app/v1/top-operators?limit=50" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={`${ops.length} operators`} title="Browse">
          {ops.length === 0 ? (
            <ApiError endpoint="/v1/top-operators?limit=50" message="No operators returned. The endpoint may be temporarily unavailable." />
          ) : (
            <OperatorsTable initial={ops} />
          )}
        </Section>
      </main>
    </ProShell>
  );
}

import type { Metadata } from "next";
import { MyRadarClient } from "@/components/MyRadarClient";
import { ProShell } from "@/components/ProShell";

export const metadata: Metadata = {
  title: "My Radar — SolSentry",
  robots: { index: false },
};

export default function MyRadarPage() {
  return (
    <ProShell>
      <MyRadarClient />
    </ProShell>
  );
}

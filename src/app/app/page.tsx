import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyRadarClient } from "@/components/MyRadarClient";
import { ProShell } from "@/components/ProShell";

export const metadata: Metadata = {
  title: "My Radar — SolSentry",
  robots: { index: false },
};

export default async function MyRadarPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("solsentry_session")) {
    redirect("/login?callback=/app");
  }

  return (
    <ProShell>
      <MyRadarClient />
    </ProShell>
  );
}

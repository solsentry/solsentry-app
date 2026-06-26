import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ mint: string }>;
}

export default async function ScanMintPage({ params }: PageProps) {
  const { mint } = await params;
  if (!mint) redirect("/");
  
  redirect(`/lookup?addr=${encodeURIComponent(mint)}`);
}

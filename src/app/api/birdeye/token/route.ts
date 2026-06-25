import { NextResponse } from "next/server";

const BIRDEYE_BASE = "https://public-api.birdeye.so";

export const revalidate = 60; // 1 min cache

export async function GET(request: Request) {
  const apiKey = process.env.BIRDEYE_API_KEY;
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!apiKey) {
    return NextResponse.json(
      { error: "BIRDEYE_API_KEY not configured on server." },
      { status: 503 },
    );
  }

  if (!mint) {
    return NextResponse.json(
      { error: "Missing mint parameter" },
      { status: 400 },
    );
  }

  try {
    const url = `${BIRDEYE_BASE}/defi/v3/token/market-data?address=${mint}`;
    const res = await fetch(url, {
      headers: { "X-API-KEY": apiKey, "x-chain": "solana" },
      next: { revalidate: 60 },
    });
    
    if (!res.ok) throw new Error(`Birdeye HTTP ${res.status}`);
    
    const json = await res.json();
    return NextResponse.json(json?.data || {});
  } catch (e) {
    console.error("birdeye token market data failed", e);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}

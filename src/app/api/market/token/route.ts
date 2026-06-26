import { NextResponse } from "next/server";

export const revalidate = 60; // Edge Cache for 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!mint || mint.length < 32) {
    return NextResponse.json({ error: "Invalid mint" }, { status: 400 });
  }

  try {
    const [dexRes, jupRes] = await Promise.allSettled([
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`https://lite-api.jup.ag/price/v3?ids=${mint}`).then((r) =>
        r.ok ? r.json() : null
      ),
    ]);

    const dexData = dexRes.status === "fulfilled" ? dexRes.value : null;
    const jupData = jupRes.status === "fulfilled" ? jupRes.value : null;

    let price = 0;
    let liquidity = 0;
    let market_cap = 0;
    let fdv = 0;
    let volume_24h = 0;
    let createdAt = null;
    let found = false;

    // 1. Process DexScreener (Primary for liquidity/volume)
    if (dexData && dexData.pairs && dexData.pairs.length > 0) {
      // Sort pairs by liquidity to get the deepest pool
      const pairs = dexData.pairs.sort(
        (a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
      const pair = pairs[0];

      price = Number(pair.priceUsd) || 0;
      liquidity = pair.liquidity?.usd || 0;
      market_cap = pair.marketCap || pair.fdv || 0;
      fdv = pair.fdv || 0;
      volume_24h = pair.volume?.h24 || 0;
      found = true;
    }

    // 2. Process Jupiter (For createdAt and fallback)
    if (jupData && jupData[mint]) {
      const jd = jupData[mint];
      if (!found && jd.usdPrice) {
        price = Number(jd.usdPrice);
        liquidity = jd.liquidity || 0;
        found = true;
      }
      if (jd.createdAt) {
        createdAt = jd.createdAt;
      }
    }

    // 3. Fallback to GeckoTerminal if both failed to yield a price
    if (!found) {
      const gtRes = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${mint}`);
      if (gtRes.ok) {
        const gtData = await gtRes.json();
        const attrs = gtData?.data?.attributes;
        if (attrs) {
          price = Number(attrs.price_usd) || 0;
          fdv = Number(attrs.fdv_usd) || 0;
          market_cap = Number(attrs.market_cap_usd) || fdv;
          volume_24h = Number(attrs.volume_usd?.h24) || 0;
          found = true;
        }
      }
    }

    if (!found) {
      // If no data could be resolved, return 500 to trigger UI fallback ("Dados indisponíveis")
      return NextResponse.json(
        { error: "Market data unavailable" },
        { status: 500 }
      );
    }

    const payload = {
      price,
      liquidity,
      market_cap,
      fdv,
      volume_24h,
      createdAt,
      source: "aggregator",
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

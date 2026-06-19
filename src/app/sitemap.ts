import type { MetadataRoute } from "next";

const SITE = "https://solsentry.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    {
      path: "/",
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      path: "/lookup",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      path: "/scan",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      path: "/pricing",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      path: "/top-operators",
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      path: "/dashboard",
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      path: "/alerts",
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      path: "/clusters",
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      path: "/operators",
      changeFrequency: "hourly",
      priority: 0.6,
    },
    {
      path: "/tokens",
      changeFrequency: "hourly",
      priority: 0.6,
    },
    {
      path: "/wallets",
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      path: "/live",
      changeFrequency: "hourly",
      priority: 0.6,
    },
    {
      path: "/api",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      path: "/docs",
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      path: "/mcp",
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      path: "/telegram",
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      path: "/x402",
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      path: "/about",
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  return routes.map((route) => ({
    url: `${SITE}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

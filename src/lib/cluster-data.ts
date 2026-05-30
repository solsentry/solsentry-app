export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";

export interface ClusterWallet {
  address: string;
  deploys: number;
  rugs: number;
  rugRate: number;
}

export interface BotCluster {
  id: string;
  clusterId: number;
  walletCount: number;
  totalDeploys: number;
  totalRugs: number;
  rugRate: number;
  risk: RiskLevel;
  tags: string[];
  topWallets: ClusterWallet[];
}

// Risk color mapping
export const RISK_COLORS: Record<RiskLevel, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f59e0b",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
  SAFE: "#14b8a6",
};

// Generate mock cluster data
export function generateMockClusters(): BotCluster[] {
  const riskLevels: RiskLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"];

  const clusters: BotCluster[] = [
    // Canonical cluster #847 - fast deployer farm
    {
      id: "cluster-847",
      clusterId: 847,
      walletCount: 47,
      totalDeploys: 1893,
      totalRugs: 1741,
      rugRate: 92.0,
      risk: "CRITICAL",
      tags: ["fast_deployer", "high_volume", "coordinated"],
      topWallets: [
        {
          address: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
          deploys: 423,
          rugs: 401,
          rugRate: 94.8,
        },
        {
          address: "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqKDhCYWpgdQGz",
          deploys: 312,
          rugs: 289,
          rugRate: 92.6,
        },
        {
          address: "2mKGvM4f9SxQhTVFrUKa8VqgJGmWBnF3TxuV3yQ9NpKi",
          deploys: 298,
          rugs: 271,
          rugRate: 90.9,
        },
      ],
    },
    // More CRITICAL clusters
    {
      id: "cluster-312",
      clusterId: 312,
      walletCount: 127,
      totalDeploys: 4521,
      totalRugs: 4203,
      rugRate: 93.0,
      risk: "CRITICAL",
      tags: ["serial_deployer", "massive_network"],
      topWallets: [
        {
          address: "9QgXqrgdbVU8KcpfskqJpAXKzbaYQJecgMAruSr6AzHF",
          deploys: 892,
          rugs: 843,
          rugRate: 94.5,
        },
        {
          address: "BDT6LsKqVPKLqWjVYPd7qPGVRdaND5dM2ZyPz6FZHaLz",
          deploys: 654,
          rugs: 612,
          rugRate: 93.6,
        },
        {
          address: "FhR4GZXV3TcBWBqVPE4EjZQ3DqBMRNb8YsVYd2P9kQLm",
          deploys: 521,
          rugs: 489,
          rugRate: 93.9,
        },
      ],
    },
    {
      id: "cluster-89",
      clusterId: 89,
      walletCount: 83,
      totalDeploys: 2934,
      totalRugs: 2701,
      rugRate: 92.1,
      risk: "CRITICAL",
      tags: ["fast_deployer", "pump_dump"],
      topWallets: [
        {
          address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
          deploys: 567,
          rugs: 534,
          rugRate: 94.2,
        },
        {
          address: "3WZmM5b5YgKqXvpbVR7WdYfKgLVaJjPGvyPzQ8XtJeFn",
          deploys: 445,
          rugs: 412,
          rugRate: 92.6,
        },
        {
          address: "J2kYsrVVwNPQrNvC7MtUBxVsGPd8jWQzNXfHvP9kYKLm",
          deploys: 389,
          rugs: 356,
          rugRate: 91.5,
        },
      ],
    },
    // HIGH risk clusters
    {
      id: "cluster-556",
      clusterId: 556,
      walletCount: 62,
      totalDeploys: 1834,
      totalRugs: 1523,
      rugRate: 83.0,
      risk: "HIGH",
      tags: ["coordinated", "wash_trading"],
      topWallets: [
        {
          address: "Dke2bRvKgA7P9T1V9cRW8C7pQN2f3vLmJ4KyHzPqXeZr",
          deploys: 423,
          rugs: 361,
          rugRate: 85.3,
        },
        {
          address: "5YzHxUkqLqA3pVq8MnZpWjFd9GhK7bQmV2XtNpYeKfLm",
          deploys: 367,
          rugs: 298,
          rugRate: 81.2,
        },
        {
          address: "Gnp3hVdQ8K5YtPqWmJrB7cX9fZaN2LkVyT6eHuRwJq4m",
          deploys: 289,
          rugs: 243,
          rugRate: 84.1,
        },
      ],
    },
    {
      id: "cluster-234",
      clusterId: 234,
      walletCount: 39,
      totalDeploys: 1245,
      totalRugs: 1033,
      rugRate: 82.9,
      risk: "HIGH",
      tags: ["bot_network", "fast_deployer"],
      topWallets: [
        {
          address: "Hmn7YcQvA8ZpKt2WjFqP5bVdXrG3eNuLy9TfHkRxJqZm",
          deploys: 312,
          rugs: 267,
          rugRate: 85.6,
        },
        {
          address: "8KpRvYtQm3WxJfN5hCzG9bVdTqLy2XeHuPfKwRnJ4qZm",
          deploys: 278,
          rugs: 231,
          rugRate: 83.1,
        },
        {
          address: "QnLkY7fVd3KxGpT8hWjR5cZbMtN2vXeQu9PfHyRwJqZm",
          deploys: 234,
          rugs: 189,
          rugRate: 80.8,
        },
      ],
    },
    {
      id: "cluster-789",
      clusterId: 789,
      walletCount: 28,
      totalDeploys: 892,
      totalRugs: 714,
      rugRate: 80.0,
      risk: "HIGH",
      tags: ["emerging", "high_frequency"],
      topWallets: [
        {
          address: "TxV9K3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 234,
          rugs: 192,
          rugRate: 82.1,
        },
        {
          address: "Uz5mN8gVpQ3KtYhWjR7cBdXrF2eLnXuPy9fHkRvJq4Zm",
          deploys: 198,
          rugs: 156,
          rugRate: 78.8,
        },
        {
          address: "VyR6K9pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 167,
          rugs: 134,
          rugRate: 80.2,
        },
      ],
    },
    // MEDIUM risk clusters
    {
      id: "cluster-445",
      clusterId: 445,
      walletCount: 51,
      totalDeploys: 1567,
      totalRugs: 940,
      rugRate: 60.0,
      risk: "MEDIUM",
      tags: ["mixed_behavior", "moderate_risk"],
      topWallets: [
        {
          address: "WxY7K3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 312,
          rugs: 187,
          rugRate: 59.9,
        },
        {
          address: "XzA8K4pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 267,
          rugs: 156,
          rugRate: 58.4,
        },
        {
          address: "YaB9K5pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 223,
          rugs: 134,
          rugRate: 60.1,
        },
      ],
    },
    {
      id: "cluster-678",
      clusterId: 678,
      walletCount: 34,
      totalDeploys: 1023,
      totalRugs: 614,
      rugRate: 60.0,
      risk: "MEDIUM",
      tags: ["suspicious_patterns"],
      topWallets: [
        {
          address: "ZbC1K6pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 234,
          rugs: 140,
          rugRate: 59.8,
        },
        {
          address: "AcD2K7pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 198,
          rugs: 119,
          rugRate: 60.1,
        },
        {
          address: "BdE3K8pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 156,
          rugs: 94,
          rugRate: 60.3,
        },
      ],
    },
    {
      id: "cluster-123",
      clusterId: 123,
      walletCount: 19,
      totalDeploys: 567,
      totalRugs: 340,
      rugRate: 60.0,
      risk: "MEDIUM",
      tags: ["new_cluster", "monitoring"],
      topWallets: [
        {
          address: "CeF4K9pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 134,
          rugs: 80,
          rugRate: 59.7,
        },
        {
          address: "DfG5L1pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 112,
          rugs: 67,
          rugRate: 59.8,
        },
        {
          address: "EgH6L2pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 98,
          rugs: 59,
          rugRate: 60.2,
        },
      ],
    },
    // LOW risk clusters
    {
      id: "cluster-901",
      clusterId: 901,
      walletCount: 72,
      totalDeploys: 2345,
      totalRugs: 703,
      rugRate: 30.0,
      risk: "LOW",
      tags: ["legitimate_activity", "monitored"],
      topWallets: [
        {
          address: "FhI7L3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 456,
          rugs: 137,
          rugRate: 30.0,
        },
        {
          address: "GiJ8L4pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 389,
          rugs: 117,
          rugRate: 30.1,
        },
        {
          address: "HjK9L5pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 312,
          rugs: 94,
          rugRate: 30.1,
        },
      ],
    },
    {
      id: "cluster-567",
      clusterId: 567,
      walletCount: 45,
      totalDeploys: 1456,
      totalRugs: 437,
      rugRate: 30.0,
      risk: "LOW",
      tags: ["established", "low_risk"],
      topWallets: [
        {
          address: "IkL1L6pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 289,
          rugs: 87,
          rugRate: 30.1,
        },
        {
          address: "JlM2L7pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 234,
          rugs: 70,
          rugRate: 29.9,
        },
        {
          address: "KmN3L8pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 198,
          rugs: 59,
          rugRate: 29.8,
        },
      ],
    },
    {
      id: "cluster-345",
      clusterId: 345,
      walletCount: 23,
      totalDeploys: 789,
      totalRugs: 237,
      rugRate: 30.0,
      risk: "LOW",
      tags: ["verified", "community"],
      topWallets: [
        {
          address: "LnO4L9pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 167,
          rugs: 50,
          rugRate: 29.9,
        },
        {
          address: "MoP5M1pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 134,
          rugs: 40,
          rugRate: 29.9,
        },
        {
          address: "NpQ6M2pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 112,
          rugs: 34,
          rugRate: 30.4,
        },
      ],
    },
    // SAFE clusters
    {
      id: "cluster-111",
      clusterId: 111,
      walletCount: 89,
      totalDeploys: 3456,
      totalRugs: 346,
      rugRate: 10.0,
      risk: "SAFE",
      tags: ["trusted", "established_protocol"],
      topWallets: [
        {
          address: "OqR7M3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 678,
          rugs: 68,
          rugRate: 10.0,
        },
        {
          address: "PrS8M4pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 567,
          rugs: 57,
          rugRate: 10.1,
        },
        {
          address: "QsT9M5pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 456,
          rugs: 46,
          rugRate: 10.1,
        },
      ],
    },
    {
      id: "cluster-222",
      clusterId: 222,
      walletCount: 56,
      totalDeploys: 2134,
      totalRugs: 213,
      rugRate: 10.0,
      risk: "SAFE",
      tags: ["verified_team", "audited"],
      topWallets: [
        {
          address: "RtU1M6pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 423,
          rugs: 42,
          rugRate: 9.9,
        },
        {
          address: "SuV2M7pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 356,
          rugs: 36,
          rugRate: 10.1,
        },
        {
          address: "TvW3M8pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 289,
          rugs: 29,
          rugRate: 10.0,
        },
      ],
    },
    {
      id: "cluster-333",
      clusterId: 333,
      walletCount: 41,
      totalDeploys: 1567,
      totalRugs: 157,
      rugRate: 10.0,
      risk: "SAFE",
      tags: ["whitelisted", "compliant"],
      topWallets: [
        {
          address: "UwX4M9pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 312,
          rugs: 31,
          rugRate: 9.9,
        },
        {
          address: "VxY5N1pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 267,
          rugs: 27,
          rugRate: 10.1,
        },
        {
          address: "WyZ6N2pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 223,
          rugs: 22,
          rugRate: 9.9,
        },
      ],
    },
    // Additional mixed clusters
    {
      id: "cluster-444",
      clusterId: 444,
      walletCount: 67,
      totalDeploys: 2012,
      totalRugs: 1810,
      rugRate: 90.0,
      risk: "CRITICAL",
      tags: ["serial_rugger", "avoid"],
      topWallets: [
        {
          address: "XzA7N3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 401,
          rugs: 361,
          rugRate: 90.0,
        },
        {
          address: "YaB8N4pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 356,
          rugs: 320,
          rugRate: 89.9,
        },
        {
          address: "ZbC9N5pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 289,
          rugs: 260,
          rugRate: 90.0,
        },
      ],
    },
    {
      id: "cluster-555",
      clusterId: 555,
      walletCount: 31,
      totalDeploys: 934,
      totalRugs: 747,
      rugRate: 80.0,
      risk: "HIGH",
      tags: ["emerging_threat"],
      topWallets: [
        {
          address: "AcD1N6pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 234,
          rugs: 187,
          rugRate: 79.9,
        },
        {
          address: "BdE2N7pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 198,
          rugs: 158,
          rugRate: 79.8,
        },
        {
          address: "CeF3N8pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 156,
          rugs: 125,
          rugRate: 80.1,
        },
      ],
    },
    {
      id: "cluster-666",
      clusterId: 666,
      walletCount: 15,
      totalDeploys: 456,
      totalRugs: 274,
      rugRate: 60.1,
      risk: "MEDIUM",
      tags: ["under_review"],
      topWallets: [
        {
          address: "DfG4N9pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 112,
          rugs: 67,
          rugRate: 59.8,
        },
        {
          address: "EgH5O1pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 98,
          rugs: 59,
          rugRate: 60.2,
        },
        {
          address: "FhI6O2pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 78,
          rugs: 47,
          rugRate: 60.3,
        },
      ],
    },
    {
      id: "cluster-777",
      clusterId: 777,
      walletCount: 5,
      totalDeploys: 123,
      totalRugs: 37,
      rugRate: 30.1,
      risk: "LOW",
      tags: ["small_cluster", "benign"],
      topWallets: [
        {
          address: "GiJ7O3pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 34,
          rugs: 10,
          rugRate: 29.4,
        },
        {
          address: "HjK8O4pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 28,
          rugs: 8,
          rugRate: 28.6,
        },
        {
          address: "IkL9O5pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 23,
          rugs: 7,
          rugRate: 30.4,
        },
      ],
    },
    {
      id: "cluster-888",
      clusterId: 888,
      walletCount: 12,
      totalDeploys: 345,
      totalRugs: 35,
      rugRate: 10.1,
      risk: "SAFE",
      tags: ["clean", "trusted"],
      topWallets: [
        {
          address: "JlM1O6pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 89,
          rugs: 9,
          rugRate: 10.1,
        },
        {
          address: "KmN2O7pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 78,
          rugs: 8,
          rugRate: 10.3,
        },
        {
          address: "LnO3O8pYqWmN5hGjF7bCdZrL2eQnXuPy8fHkRvJq4Zm",
          deploys: 67,
          rugs: 7,
          rugRate: 10.4,
        },
      ],
    },
  ];

  return clusters.sort((a, b) => b.walletCount - a.walletCount);
}

export const MOCK_CLUSTERS = generateMockClusters();
export const TOTAL_CLUSTERS_TRACKED = 9350;

// Selection types for the sunburst
export type SelectedItemType = "cluster" | "wallet";

export interface SelectedCluster {
  type: "cluster";
  cluster: BotCluster;
}

export interface SelectedWallet {
  type: "wallet";
  wallet: ClusterWallet;
  parentCluster: BotCluster;
}

export type SelectedItem = SelectedCluster | SelectedWallet | null;

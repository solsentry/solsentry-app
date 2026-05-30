export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM";

export interface Operator {
  rank: number;
  wallet: string;
  sns: string | null;
  riskLevel: RiskLevel;
  rugRate: number;
  rugs: number;
  tokensDeployed: number;
  lastActive: Date;
  rugHistory: number[]; // 7-day rug count
  tags: string[];
  avatarUrl: string | null;
}

// Generate realistic-looking Solana base58 addresses
const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function generateSolanaAddress(): string {
  let addr = "";
  for (let i = 0; i < 44; i++) {
    addr += base58Chars[Math.floor(Math.random() * base58Chars.length)];
  }
  return addr;
}

// Avatar placeholders using dicebear
function getAvatarUrl(seed: string): string | null {
  // 70% chance of having an avatar
  if (Math.random() > 0.7) return null;
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}&backgroundColor=131313`;
}

// SNS names for some operators
const snsNames = [
  "darkpool.sol",
  "rugmaster.sol",
  "alpha_trader.sol",
  "moon_dev.sol",
  "degen_king.sol",
  "pump_lord.sol",
  "sol_whale.sol",
  "token_sniper.sol",
  "rug_hunter.sol",
  "meme_deployer.sol",
  "fast_dev.sol",
  "serial_dev.sol",
];

function generateMockOperators(): Operator[] {
  const operators: Operator[] = [];

  // #1 - Canonical case from spec
  operators.push({
    rank: 1,
    wallet: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    sns: null,
    riskLevel: "CRITICAL",
    rugRate: 91.9,
    rugs: 2953,
    tokensDeployed: 3212,
    lastActive: new Date(Date.now() - 12 * 60000), // 12m ago
    rugHistory: [8, 12, 15, 9, 11, 14, 10],
    tags: ["serial_deployer", "fast_deployer"],
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=4kxscute&backgroundColor=131313",
  });

  // Generate 7 more CRITICAL (total 8)
  for (let i = 2; i <= 8; i++) {
    const wallet = generateSolanaAddress();
    const tokensDeployed = Math.floor(Math.random() * 2000) + 500;
    const rugRate = 88 + Math.random() * 10; // 88-98%
    const rugs = Math.floor(tokensDeployed * (rugRate / 100));
    operators.push({
      rank: i,
      wallet,
      sns: Math.random() > 0.7 ? snsNames[Math.floor(Math.random() * snsNames.length)] : null,
      riskLevel: "CRITICAL",
      rugRate: parseFloat(rugRate.toFixed(1)),
      rugs,
      tokensDeployed,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 24 * 3600000)),
      rugHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20)),
      tags: ["serial_deployer"],
      avatarUrl: getAvatarUrl(wallet),
    });
  }

  // Generate 15 HIGH (total 23)
  for (let i = 9; i <= 23; i++) {
    const wallet = generateSolanaAddress();
    const tokensDeployed = Math.floor(Math.random() * 1500) + 200;
    const rugRate = 70 + Math.random() * 18; // 70-88%
    const rugs = Math.floor(tokensDeployed * (rugRate / 100));
    operators.push({
      rank: i,
      wallet,
      sns: Math.random() > 0.8 ? snsNames[Math.floor(Math.random() * snsNames.length)] : null,
      riskLevel: "HIGH",
      rugRate: parseFloat(rugRate.toFixed(1)),
      rugs,
      tokensDeployed,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 72 * 3600000)),
      rugHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 12)),
      tags: Math.random() > 0.5 ? ["fast_deployer"] : [],
      avatarUrl: getAvatarUrl(wallet),
    });
  }

  // Generate 27 MEDIUM (total 50)
  for (let i = 24; i <= 50; i++) {
    const wallet = generateSolanaAddress();
    const tokensDeployed = Math.floor(Math.random() * 800) + 50;
    const rugRate = 50 + Math.random() * 20; // 50-70%
    const rugs = Math.floor(tokensDeployed * (rugRate / 100));
    operators.push({
      rank: i,
      wallet,
      sns: Math.random() > 0.85 ? snsNames[Math.floor(Math.random() * snsNames.length)] : null,
      riskLevel: "MEDIUM",
      rugRate: parseFloat(rugRate.toFixed(1)),
      rugs,
      tokensDeployed,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 168 * 3600000)), // up to 7 days
      rugHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 8)),
      tags: [],
      avatarUrl: getAvatarUrl(wallet),
    });
  }

  return operators;
}

export const mockOperators = generateMockOperators();

// Platform stats from spec
export const platformStats = {
  predictions: 62024,
  accuracy: 90.0,
  resolveRate: 96.2,
  operators: 8143,
  serialRuggers: 1841,
  botClusters: 9350,
  highRiskAlerts: 35459,
  confirmedRugs: 25902,
  confirmedSafe: 1624,
  runtimeHours: 843,
};

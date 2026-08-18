import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Section } from "@/components/Section";

export const metadata = { title: "Debug Hub · SolSentry" };

const TEST_OPERATOR = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";
const TEST_TOKEN = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"; // Bonk or any valid token
const MOCK_TOKEN = "F4GpAFr6vrxU3Y887F3XWkXRgybCVjZNk63m72f6pump"; // from screenshot

export default function DebugHubPage() {
  const links = [
    { name: "Screen Gate (Form)", path: "/screen", desc: "Formulário de submissão manual x402." },
    { name: "Operator Network (Valid)", path: `/network/${TEST_OPERATOR}`, desc: "Visualização do grafo + Inflow/Outflow." },
    { name: "Token Analysis (Valid)", path: `/token/${TEST_TOKEN}`, desc: "Página de risco com a tabela de Holders e Clusters reais." },
    { name: "Token Analysis (Mock from image)", path: `/token/${MOCK_TOKEN}`, desc: "O token do seu screenshot, para testar a resposta da API (pode dar 404)." },
    { name: "Live Feed", path: "/tokens", desc: "Feed ao vivo de todos os tokens recentes." },
    { name: "Operator List", path: "/wallets", desc: "Lista de operadores monitorados." },
    { name: "Birdeye Radar", path: "/birdeye-radar", desc: "Radar de trending integrado com Birdeye." },
  ];

  return (
    <>
      <SiteTopbar />
      <main style={{ padding: "80px 24px", minHeight: "calc(100vh - 140px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, marginBottom: 16, color: "var(--fg-1)", fontFamily: "var(--font-display)" }}>
            Debug & Test Hub
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 16, marginBottom: 40 }}>
            Central de links reais para validação sem cair em erros de rota falsa (como "/token/pump...").
          </p>

          <Section title="Páginas Disponíveis">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.map((link) => (
                <div key={link.path} className="panel" style={{ padding: 16 }}>
                  <Link
                    href={link.path}
                    style={{
                      fontSize: 18,
                      color: "var(--brand-amber)",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {link.name} →
                  </Link>
                  <div style={{ fontSize: 13, color: "var(--fg-2)", fontFamily: "var(--font-mono)" }}>
                    {link.path}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--fg-3)", marginTop: 8 }}>
                    {link.desc}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

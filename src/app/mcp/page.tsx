// /mcp — server wrapper: keeps metadata (EN, for SEO) + renders the
// bilingual client body, which resolves PT/EN from the saved pref or
// navigator.language (see useLang / B8.4a).

import { McpClient } from "./McpClient";

export const metadata = {
  title: "MCP server — SolSentry in your AI coding agent",
  description:
    "Install the SolSentry MCP server in Claude Code, Cursor, or any MCP-compatible agent. Operator lookups, drain traces, and bot cluster queries — directly in your editor.",
};

export default function MCPPage() {
  return <McpClient />;
}

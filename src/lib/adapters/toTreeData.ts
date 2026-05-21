// Adapter: OperatorNetwork → recursive tree shape for tidy-tree viz.
// Ported from internal/marketing/brand/sds/v4/06_ia_completa/casen_viz_prototype.html
// (the static organograma user prefers for "version estática").

import type { OperatorNetwork, OperatorNetworkNode } from "@/lib/api";

export type TreeNodeType =
  | "root"
  | "operator"
  | "wallet"
  | "alert"
  | "warning"
  | "legit"
  | "hub";

export interface TreeNode {
  id: string;
  name: string;
  subtitle?: string;
  type: TreeNodeType;
  children?: TreeNode[];
  collapsedChildren?: TreeNode[]; // hidden until click-to-expand
}

function shortAddr(addr: string, n = 4): string {
  if (!addr) return "?";
  if (addr.length <= n * 2 + 2) return addr;
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

function typeFromNode(node: OperatorNetworkNode, isRoot: boolean): TreeNodeType {
  if (isRoot) return "root";
  const r = node.risk;
  if (r !== undefined) {
    if (r >= 80) return "alert";
    if (r >= 50) return "warning";
    if (r < 20) return "legit";
  }
  if (node.type === "cex" || node.type === "mixer") return "hub";
  if (node.type === "operator") return "operator";
  return "wallet";
}

function nodeSubtitle(node: OperatorNetworkNode): string {
  if (node.type) return node.type;
  if (node.risk !== undefined) {
    if (node.risk >= 80) return "CRITICAL";
    if (node.risk >= 50) return "HIGH";
    if (node.risk >= 20) return "MEDIUM";
    return "LOW";
  }
  return "wallet";
}

/**
 * Build a hierarchical tree from OperatorNetwork.
 * BFS from root, follows edges, dedupes via visited set.
 *
 * @param net The operator network response
 * @param maxInitialDepth Children deeper than this are stored in `collapsedChildren`
 *   so the UI can click-to-expand. Default 1 (show only direct children).
 * @param maxChildrenPerNode Caps fan-out at each level.
 */
export function networkToTree(
  net: OperatorNetwork,
  maxInitialDepth = 1,
  maxChildrenPerNode = 12,
): TreeNode {
  const byAddr = new Map<string, OperatorNetworkNode>();
  for (const n of net.nodes) byAddr.set(n.address, n);

  // Build undirected adjacency for tree traversal
  const adj = new Map<string, string[]>();
  for (const e of net.edges) {
    const a = adj.get(e.from) ?? [];
    a.push(e.to);
    adj.set(e.from, a);
    const b = adj.get(e.to) ?? [];
    b.push(e.from);
    adj.set(e.to, b);
  }

  const root = net.wallet;
  const visited = new Set<string>();

  function build(addr: string, depth: number): TreeNode {
    visited.add(addr);
    const node = byAddr.get(addr);
    const isRoot = addr === root || node?.isRoot === true;

    const name = node?.label ?? shortAddr(addr, 5);
    const subtitle = node ? nodeSubtitle(node) : "wallet";
    const type = node ? typeFromNode(node, isRoot) : "wallet";

    const childAddrs = (adj.get(addr) ?? [])
      .filter((c) => !visited.has(c))
      .slice(0, maxChildrenPerNode);

    let children: TreeNode[] | undefined;
    let collapsedChildren: TreeNode[] | undefined;

    if (childAddrs.length > 0) {
      const built = childAddrs.map((c) => build(c, depth + 1));
      if (depth < maxInitialDepth) {
        children = built;
      } else {
        collapsedChildren = built;
      }
    }

    return {
      id: addr,
      name,
      subtitle,
      type,
      children,
      collapsedChildren,
    };
  }

  return build(root, 0);
}

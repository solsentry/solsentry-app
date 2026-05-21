// force-layout.worker.ts
// Soft-clustered force layout for operator graph.
//
// Adapted from Haradrim (https://github.com/mertimus/haradrim, MIT license).
// Author of original: Mert Mumtaz (@0xMert_, Helius CEO).
// Used here with attribution per MIT license.
//
// Key idea: standard d3-force simulation, but each node has an anchor point
// (hubX, hubY) and is pulled toward it via forceX/forceY. This produces
// natural physics (siblings repel, edges curve) while keeping cluster
// centers anchored — best of tree + graph.

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

export interface InputNode extends SimulationNodeDatum {
  id: string;
  size: number;
  hubX?: number;
  hubY?: number;
}

export interface InputLink extends SimulationLinkDatum<InputNode> {
  source: string | InputNode;
  target: string | InputNode;
}

export interface OutputNode {
  id: string;
  x: number;
  y: number;
}

interface RunMessage {
  type: "run";
  nodes: InputNode[];
  links: InputLink[];
}

self.onmessage = (e: MessageEvent<RunMessage>) => {
  if (e.data.type !== "run") return;
  const { nodes, links } = e.data;

  // Seed initial positions at hubs (or origin) so the simulation converges fast
  for (const n of nodes) {
    n.x = n.hubX ?? (Math.random() - 0.5) * 200;
    n.y = n.hubY ?? (Math.random() - 0.5) * 200;
  }

  // Forces tuned to match Haradrim's actual implementation:
  //   src/workers/force-layout.worker.ts (mertimus/haradrim, MIT).
  const sim = forceSimulation<InputNode>(nodes)
    .force(
      "link",
      forceLink<InputNode, InputLink>(links)
        .id((d) => d.id)
        .distance(120) // wider gap since cards are 200px wide
        .strength(1.2),
    )
    .force("charge", forceManyBody().strength(-180))
    .force("center", forceCenter(0, 0).strength(0.1))
    .force(
      "collide",
      forceCollide<InputNode>()
        .radius((d) => d.size * 0.55 + 15)
        .strength(0.8),
    )
    .force(
      "x",
      forceX<InputNode>((d) => d.hubX ?? 0).strength((d) =>
        d.hubX === 0 && d.hubY === 0 ? 0 : 0.4,
      ),
    )
    .force(
      "y",
      forceY<InputNode>((d) => d.hubY ?? 0).strength((d) =>
        d.hubX === 0 && d.hubY === 0 ? 0 : 0.4,
      ),
    )
    .stop();

  for (let i = 0; i < 400; i++) sim.tick();

  const out: OutputNode[] = nodes.map((n) => ({
    id: n.id,
    x: n.x ?? 0,
    y: n.y ?? 0,
  }));

  postMessage({ type: "done", nodes: out });
};

// Required for TypeScript when treating this file as a module
export {};

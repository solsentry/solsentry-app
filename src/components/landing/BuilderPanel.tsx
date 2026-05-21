"use client";

// BuilderPanel — three cards for the developer audience.
// Surfaces Telegram, MCP, REST in that order on purpose: cheapest path
// to a working integration first, library install second, raw API last.

import Link from "next/link";
import { MessageSquare, Terminal, Code2 } from "lucide-react";
import type { LandingCopy } from "@/lib/i18n-landing";

interface Props {
  copy: LandingCopy;
}

export function BuilderPanel({ copy }: Props) {
  const cards = [
    {
      icon: MessageSquare,
      title: copy.buildTgTitle,
      body: copy.buildTgBody,
      href: "/telegram",
      cta: copy.buildCta,
    },
    {
      icon: Terminal,
      title: copy.buildMcpTitle,
      body: copy.buildMcpBody,
      href: "/mcp",
      cta: copy.buildCta,
    },
    {
      icon: Code2,
      title: copy.buildApiTitle,
      body: copy.buildApiBody,
      href: "/api",
      cta: copy.buildCta,
    },
  ];

  return (
    <section
      className="landing-section landing-build"
      aria-labelledby="build-title"
    >
      <header className="landing-section__head">
        <span className="landing-eyebrow">{copy.buildEyebrow}</span>
        <h2 id="build-title" className="landing-section__title">
          {copy.buildTitle}
        </h2>
      </header>

      <ul className="landing-build__grid">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link href={c.href} className="landing-build__card">
                <Icon size={20} aria-hidden />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <span className="landing-build__cta">{c.cta} →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

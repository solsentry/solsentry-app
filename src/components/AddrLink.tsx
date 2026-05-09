import Link from "next/link";
import { truncate } from "@/lib/api";

interface Props {
  addr: string;
  href?: string;
  external?: boolean;
  head?: number;
  tail?: number;
}

export function AddrLink({
  addr,
  href,
  external = false,
  head = 6,
  tail = 4,
}: Props) {
  const target = href ?? `/operator/${addr}`;
  const text = truncate(addr, head, tail);

  if (external) {
    return (
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--brand-amber)",
          textDecoration: "none",
        }}
      >
        {text}
      </a>
    );
  }

  return (
    <Link
      href={target}
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--brand-amber)",
        textDecoration: "none",
      }}
    >
      {text}
    </Link>
  );
}

import Link from "next/link";

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <span className="dot" aria-hidden />
          SolSentry
        </Link>
        <div className="nav-links">
          <Link href="/operator">Operator</Link>
          <Link href="/docs">Docs</Link>
          <a href="https://www.npmjs.com/package/@solsentry/mcp" target="_blank" rel="noreferrer">
            NPM
          </a>
          <a href="https://github.com/solsentryai" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

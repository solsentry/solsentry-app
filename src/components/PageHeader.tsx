interface Props {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, sub, children }: Props) {
  return (
    <section className="section-pad-sm" style={{ paddingTop: 64, paddingBottom: 24 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="section-title">{title}</h1>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

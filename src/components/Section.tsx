interface Props {
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

export function Section({ eyebrow, title, sub, children, id, style }: Props) {
  return (
    <section className="section-pad" id={id} style={style}>
      <div className="container">
        {(eyebrow || title || sub) && (
          <div className="section-head">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {sub && <p className="section-sub">{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

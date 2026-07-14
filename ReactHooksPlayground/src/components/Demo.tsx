import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  explanation?: ReactNode;
}

export function Demo({ title, explanation, children }: Props) {
  return (
    <section className="demo">
      <h2>{title}</h2>
      {explanation && <p className="hint">{explanation}</p>}
      <div className="demo-body">{children}</div>
    </section>
  );
}

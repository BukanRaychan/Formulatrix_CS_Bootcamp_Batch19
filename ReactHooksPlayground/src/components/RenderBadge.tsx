interface Props {
  count: number;
  label?: string;
}

export function RenderBadge({ count, label = "renders" }: Props) {
  return (
    <span className="render-badge">
      {label}: <strong>{count}</strong>
    </span>
  );
}

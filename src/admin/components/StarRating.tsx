

interface Props {
  value: number;
  max?: number;
}

export function StarRating({ value, max = 5 }: Props) {
  return (
    <span className="admin-stars">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontSize: '14px', opacity: i < Math.round(value) ? 1 : 0.25 }}
        >
          star
        </span>
      ))}
      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 4 }}>
        {value.toFixed(1)}
      </span>
    </span>
  );
}

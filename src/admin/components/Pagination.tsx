

interface Props {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, totalPages, onChange }: Props) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-info">
        Showing {start}–{end} of {total}
      </span>
      <div className="admin-pagination-btns">
        <button
          className="admin-page-btn"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} style={{ color: '#64748b', padding: '0 4px', fontSize: '0.8rem' }}>…</span>
          ) : (
            <button
              key={p}
              className={`admin-page-btn${page === p ? ' active' : ''}`}
              onClick={() => onChange(p as number)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="admin-page-btn"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>
    </div>
  );
}

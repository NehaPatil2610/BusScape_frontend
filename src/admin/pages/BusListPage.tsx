import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminBuses, deleteBus } from '../api/buses.api';
import type { Bus, BusListParams } from '../api/buses.api';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StarRating } from '../components/StarRating';
import { toast } from '../components/Toaster';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

export function BusListPage() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<BusListParams>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [deleteTarget, setDeleteTarget] = useState<Bus | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dSearch = useDebounce(search, 400);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminBuses({ ...filters, search: dSearch || undefined, page, pageSize: 20 });
      setBuses(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  }, [filters, dSearch]);

  useEffect(() => { load(1); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBus(deleteTarget._id);
      toast.success('Bus deleted successfully');
      setDeleteTarget(null);
      load(pagination.page);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Buses</h1>
          <p className="admin-page-sub">{pagination.total} total buses</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/buses/new')}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Add Bus
        </button>
      </div>

      <div className="admin-card">
        {/* Filter bar */}
        <div className="admin-filter-bar">
          <input
            className="admin-input admin-search-input"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={filters.isAC === undefined ? '' : String(filters.isAC)}
            onChange={(e) => setFilters((f) => ({ ...f, isAC: e.target.value === '' ? undefined : e.target.value === 'true' }))}
          >
            <option value="">All AC</option>
            <option value="true">AC</option>
            <option value="false">Non-AC</option>
          </select>
          <select
            className="admin-select"
            value={filters.seatType ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, seatType: e.target.value as any || undefined }))}
          >
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="sleeper">Sleeper</option>
            <option value="semi-sleeper">Semi-Sleeper</option>
          </select>
          <select
            className="admin-select"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':') as any;
              setFilters((f) => ({ ...f, sortBy, sortOrder }));
            }}
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="price:asc">Price ↑</option>
            <option value="price:desc">Price ↓</option>
            <option value="averageRating:desc">Rating ↓</option>
            <option value="name:asc">Name A-Z</option>
          </select>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading"><span className="admin-spinner" />Loading…</div>
          ) : buses.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">🚌</span>
              <span>No buses found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>AC</th>
                  <th>Types</th>
                  <th>Seats</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{b.name}</td>
                    <td>₹{b.price.toLocaleString()}</td>
                    <td>
                      <span className={`admin-badge ${b.isAC ? 'admin-badge-blue' : 'admin-badge-gray'}`}>
                        {b.isAC ? 'AC' : 'Non-AC'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{b.seatTypes.join(', ')}</td>
                    <td>{b.availableSeats} / {b.seats.length}</td>
                    <td><StarRating value={b.averageRating} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/buses/${b._id}`}>
                          <button className="admin-btn admin-btn-ghost admin-btn-sm">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                          </button>
                        </Link>
                        <Link to={`/admin/buses/${b._id}/edit`}>
                          <button className="admin-btn admin-btn-ghost admin-btn-sm">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                          </button>
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => setDeleteTarget(b)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination {...pagination} onChange={(p) => load(p)} />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Bus"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone. The operation will fail if upcoming bookings exist.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

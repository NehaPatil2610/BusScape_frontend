import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminBookings, updateAdminBookingStatus } from '../api/bookings.api';
import type { Booking, BookingListParams, BookingStatus } from '../api/bookings.api';
import { Pagination } from '../components/Pagination';
import { toast } from '../components/Toaster';

const STATUSES: (BookingStatus | '')[] = ['', 'upcoming', 'completed', 'cancelled'];

export function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BookingListParams>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminBookings({
        ...filters,
        status: statusFilter || undefined,
        page,
        pageSize: 20,
      });
      setBookings(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [filters, statusFilter]);

  useEffect(() => { load(1); }, [load]);

  const handleStatusChange = async (b: Booking, newStatus: BookingStatus) => {
    try {
      await updateAdminBookingStatus(b._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      load(pagination.page);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Update failed');
    }
  };

  const busName = (b: Booking) =>
    typeof b.bus_id === 'string' ? b.bus_id : b.bus_id.name;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-sub">{pagination.total} total bookings</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '1rem', width: 'fit-content' }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`admin-tab${statusFilter === s ? ' active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-filter-bar">
          <select
            className="admin-select"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':') as any;
              setFilters((f) => ({ ...f, sortBy, sortOrder }));
            }}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="price:desc">Price ↓</option>
            <option value="price:asc">Price ↑</option>
          </select>
          <input
            className="admin-input"
            placeholder="Filter by User ID…"
            style={{ width: 220 }}
            onChange={(e) => setFilters((f) => ({ ...f, userSub: e.target.value || undefined }))}
          />
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading"><span className="admin-spinner" />Loading…</div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">📋</span>
              <span>No bookings found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Route</th>
                  <th>Passengers</th>
                  <th>Seats</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{busName(b)}</td>
                    <td style={{ fontSize: '0.78rem' }}>{b.departure} → {b.arrival}</td>
                    <td>{b.passengers.length}</td>
                    <td style={{ fontSize: '0.78rem' }}>{b.seatsbooked.join(', ')}</td>
                    <td style={{ fontWeight: 600 }}>₹{b.price.toLocaleString()}</td>
                    <td>
                      <select
                        className="admin-select"
                        style={{ width: 'auto', padding: '2px 28px 2px 8px', fontSize: '0.75rem' }}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <Link to={`/admin/bookings/${b._id}`}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination {...pagination} onChange={(p) => load(p)} />
      </div>
    </div>
  );
}

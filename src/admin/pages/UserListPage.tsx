import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminUsers } from '../api/users.api';
import type { UserSummary } from '../api/users.api';
import { Pagination } from '../components/Pagination';
import { toast } from '../components/Toaster';

export function UserListPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({ page, pageSize: 20 });
      setUsers(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">{pagination.total} unique users (derived from bookings)</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading"><span className="admin-spinner" />Loading…</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">👥</span>
              <span>No users found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID (Sub)</th>
                  <th>Total Bookings</th>
                  <th>Total Spent</th>
                  <th>Last Booking</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8' }}>
                      {u._id}
                    </td>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{u.totalBookings}</td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>₹{u.totalSpent.toLocaleString()}</td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {u.lastBookingDate
                        ? new Date(u.lastBookingDate).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                    <td>
                      <Link to={`/admin/users/${encodeURIComponent(u._id)}`}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                          View
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

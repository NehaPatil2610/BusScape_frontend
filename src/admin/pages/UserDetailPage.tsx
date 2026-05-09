import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminUserDetails } from '../api/users.api';
import type { UserDetail } from '../api/users.api';
import { toast } from '../components/Toaster';

export function UserDetailPage() {
  const { userSub } = useParams<{ userSub: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userSub) return;
    fetchAdminUserDetails(decodeURIComponent(userSub))
      .then(setData)
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [userSub]);

  if (loading) return <div className="admin-loading"><span className="admin-spinner" />Loading user…</div>;
  if (!data) return <div className="admin-empty"><span>User not found.</span></div>;

  const bookings = data.bookings as any[];

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          </button>
          <div>
            <h1 className="admin-page-title">User Detail</h1>
            <p className="admin-page-sub" style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{data.userSub}</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="admin-stat-grid" style={{ marginBottom: '1rem' }}>
        {[
          { label: 'Total Bookings', value: data.totalBookings, icon: 'receipt_long', color: 'blue' },
          { label: 'Total Spent', value: `₹${data.totalSpent.toLocaleString()}`, icon: 'currency_rupee', color: 'green' },
          { label: 'Saved Passengers', value: data.savedPassengers.length, icon: 'group', color: 'purple' },
        ].map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className={`admin-stat-icon ${s.color}`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <div className="admin-stat-label">{s.label}</div>
              <div className="admin-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking History */}
      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">Booking History ({bookings.length})</span>
        </div>
        <div className="admin-table-wrap">
          {bookings.length === 0 ? (
            <div className="admin-empty"><span>No bookings</span></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Bus</th><th>Route</th><th>Seats</th><th>Price</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>
                      {typeof b.bus_id === 'string' ? '—' : b.bus_id?.name ?? '—'}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>{b.departure} → {b.arrival}</td>
                    <td style={{ fontSize: '0.78rem' }}>{b.seatsbooked?.join(', ')}</td>
                    <td>₹{b.price?.toLocaleString()}</td>
                    <td>
                      <span className={`admin-badge ${b.status === 'upcoming' ? 'admin-badge-blue' : b.status === 'completed' ? 'admin-badge-green' : 'admin-badge-red'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Saved Passengers */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Saved Passengers ({data.savedPassengers.length})</span>
        </div>
        <div className="admin-table-wrap">
          {data.savedPassengers.length === 0 ? (
            <div className="admin-empty"><span>No saved passengers</span></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Age</th><th>Gender</th><th>ID Type</th><th>Default</th></tr>
              </thead>
              <tbody>
                {data.savedPassengers.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.name}</td>
                    <td>{p.age}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.gender}</td>
                    <td style={{ color: '#64748b' }}>{p.idType ?? '—'}</td>
                    <td>
                      {p.isDefault
                        ? <span className="admin-badge admin-badge-blue">Default</span>
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

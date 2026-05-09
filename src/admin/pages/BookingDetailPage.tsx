import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminBookingById, updateAdminBookingStatus } from '../api/bookings.api';
import type { Booking, BookingStatus } from '../api/bookings.api';
import { toast } from '../components/Toaster';

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetchAdminBookingById(bookingId).then(setBooking).finally(() => setLoading(false));
  }, [bookingId]);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!booking) return;
    setSaving(true);
    try {
      const updated = await updateAdminBookingStatus(booking._id, newStatus);
      setBooking(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" />Loading booking…</div>;
  if (!booking) return <div className="admin-empty"><span>Booking not found.</span></div>;

  const busName = typeof booking.bus_id === 'string' ? booking.bus_id : booking.bus_id.name;
  const statusColors: Record<string, string> = { upcoming: 'admin-badge-blue', completed: 'admin-badge-green', cancelled: 'admin-badge-red' };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          </button>
          <div>
            <h1 className="admin-page-title">Booking Detail</h1>
            <p className="admin-page-sub" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{booking._id}</p>
          </div>
        </div>
        <span className={`admin-badge ${statusColors[booking.status] ?? 'admin-badge-gray'}`} style={{ fontSize: '0.85rem', padding: '4px 14px' }}>
          {booking.status}
        </span>
      </div>

      <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
        {/* Summary */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Booking Summary</span></div>
          <div className="admin-card-body">
            {[
              ['Bus', busName],
              ['Route', `${booking.departure} → ${booking.arrival}`],
              ['Total Price', `₹${booking.price.toLocaleString()}`],
              ['Seats Booked', booking.seatsbooked.join(', ')],
              ['User ID', booking.userSub ?? '—'],
              ['Created', new Date(booking.createdAt).toLocaleString('en-IN')],
              ['Updated', new Date(booking.updatedAt).toLocaleString('en-IN')],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1e293b', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Change */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Change Status</span></div>
          <div className="admin-card-body">
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Override the booking status. This directly updates the booking in the database.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(['upcoming', 'completed', 'cancelled'] as BookingStatus[]).map((s) => (
                <button
                  key={s}
                  className={`admin-btn ${s === 'cancelled' ? 'admin-btn-danger' : s === 'completed' ? 'admin-btn-success' : 'admin-btn-ghost'}`}
                  disabled={saving || booking.status === s}
                  onClick={() => handleStatusChange(s)}
                >
                  {saving && <span className="admin-spinner" style={{ width: 12, height: 12 }} />}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="admin-card">
        <div className="admin-card-header"><span className="admin-card-title">Passengers ({booking.passengers.length})</span></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th></tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, i) => (
                <tr key={i}>
                  <td style={{ color: '#64748b' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.name}</td>
                  <td>{p.age}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

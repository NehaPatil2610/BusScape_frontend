import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAdminBusById } from '../api/buses.api';
import type { Bus } from '../api/buses.api';

export function BusDetailPage() {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!busId) return;
    fetchAdminBusById(busId).then(setBus).finally(() => setLoading(false));
  }, [busId]);

  if (loading) return <div className="admin-loading"><span className="admin-spinner" />Loading bus…</div>;
  if (!bus) return <div className="admin-empty"><span>Bus not found.</span></div>;

  // Build seat grid
  const rows = Math.max(...bus.seats.map((s) => s.row));
  const cols = Math.max(...bus.seats.map((s) => s.column));
  const seatGrid: (Bus['seats'][number] | null)[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => bus.seats.find((s) => s.row === r + 1 && s.column === c + 1) ?? null)
  );

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          </button>
          <div>
            <h1 className="admin-page-title">{bus.name}</h1>
            <p className="admin-page-sub">Bus ID: {bus._id}</p>
          </div>
        </div>
        <Link to={`/admin/buses/${bus._id}/edit`}>
          <button className="admin-btn admin-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            Edit Bus
          </button>
        </Link>
      </div>

      <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
        {/* Info Card */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Bus Details</span></div>
          <div className="admin-card-body">
            {[
              ['Price', `₹${bus.price.toLocaleString()}`],
              ['AC', bus.isAC ? '✓ Air Conditioned' : '✗ Non-AC'],
              ['Seat Types', bus.seatTypes.join(', ')],
              ['Total Seats', bus.seats.length],
              ['Available Seats', bus.availableSeats],
              ['Average Rating', `${bus.averageRating.toFixed(1)} ★`],
              ['Review Count', bus.reviewCount],
              ['Created', new Date(bus.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1e293b', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route / Stops */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Route Stops</span></div>
          <div className="admin-card-body">
            {bus.stops.map((stop, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i === 0 ? '#34d399' : i === bus.stops.length - 1 ? '#f87171' : '#2563eb',
                    flexShrink: 0, marginTop: 4,
                  }} />
                  {i < bus.stops.length - 1 && (
                    <div style={{ flex: 1, width: 2, background: '#334155', marginTop: 2 }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.875rem' }}>{stop.stopName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {stop.arrivalTime && <span>Arr: {stop.arrivalTime}  </span>}
                    {stop.departureTime && <span>Dep: {stop.departureTime}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Seat Map</span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#34d399' }}>■ Available</span>
            <span style={{ color: '#f87171' }}>■ Confirmed</span>
          </div>
        </div>
        <div className="admin-seat-map">
          {seatGrid.map((row, ri) => (
            <div key={ri} className="admin-seat-row">
              {row.map((seat, ci) =>
                seat ? (
                  <div key={ci} className={`admin-seat ${seat.status}`} title={`Seat ${seat.seatNumber} (${seat.seatType})`}>
                    {seat.seatNumber}
                  </div>
                ) : (
                  <div key={ci} style={{ width: 36, height: 36 }} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

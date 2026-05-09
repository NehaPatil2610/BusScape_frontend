import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchDashboardStats } from '../api/dashboard.api';
import type { DashboardStats } from '../api/dashboard.api';

const fmt = (n: number) =>
  n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : n >= 1000   ? `₹${(n / 1000).toFixed(1)}K`
  : `₹${n}`;

const STATUS_COLORS = ['#60a5fa', '#34d399', '#f87171'];

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then(setData).finally(() => setLoading(false));
    const t = setInterval(() => fetchDashboardStats().then(setData), 30_000);
    return () => clearInterval(t);
  }, []);

  if (loading || !data) {
    return (
      <div className="admin-loading">
        <span className="admin-spinner" />
        Loading dashboard…
      </div>
    );
  }

  const stats = [
    { label: 'Total Buses',    value: data.totalBuses,    icon: 'directions_bus', color: 'blue' },
    { label: 'Total Bookings', value: data.totalBookings, icon: 'receipt_long',   color: 'green' },
    { label: 'Total Revenue',  value: fmt(data.totalRevenue), icon: 'currency_rupee', color: 'orange' },
    { label: 'Total Reviews',  value: data.totalReviews,  icon: 'star',           color: 'purple' },
    { label: 'Pending Reviews',value: data.pendingReviews,icon: 'pending',        color: data.pendingReviews > 0 ? 'red' : 'gray' as any },
  ];

  const pieData = [
    { name: 'Upcoming',  value: data.bookingsByStatus.upcoming },
    { name: 'Completed', value: data.bookingsByStatus.completed },
    { name: 'Cancelled', value: data.bookingsByStatus.cancelled },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Real-time platform overview</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        {stats.map((s) => (
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

      {/* Charts row */}
      <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
        {/* Revenue Area Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Revenue — Last 7 Days</span>
          </div>
          <div className="admin-card-body" style={{ paddingBottom: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.revenueLast7Days} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={55} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Pie */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Booking Status Breakdown</span>
          </div>
          <div className="admin-card-body" style={{ paddingBottom: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="admin-grid-2">
        {/* Recent Bookings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Bookings</span>
            <Link to="/admin/bookings" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>View all</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Route</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>No bookings yet</td></tr>
                ) : data.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                      {typeof b.bus_id === 'string' ? '—' : b.bus_id.name}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{b.departure} → {b.arrival}</td>
                    <td>₹{b.price.toLocaleString()}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${b.status === 'upcoming' ? 'blue' : b.status === 'completed' ? 'green' : 'red'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Rated Buses */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Top Rated Buses</span>
            <Link to="/admin/buses" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>View all</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {data.topRatedBuses.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>No buses yet</td></tr>
                ) : data.topRatedBuses.map((b) => (
                  <tr key={b._id}>
                    <td style={{ color: '#f1f5f9', fontWeight: 500 }}>{b.name}</td>
                    <td>
                      <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>★ {b.averageRating.toFixed(1)}</span>
                    </td>
                    <td style={{ color: '#64748b' }}>{b.reviewCount}</td>
                    <td>₹{b.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

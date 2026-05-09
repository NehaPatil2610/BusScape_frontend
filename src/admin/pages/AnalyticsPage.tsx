import { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { fetchRevenueAnalytics, fetchBookingAnalytics } from '../api/analytics.api';
import type { RevenueAnalytics, BookingAnalytics } from '../api/analytics.api';
import { toast } from '../components/Toaster';

const DAYS_OPTIONS = [7, 14, 30, 90];
const STATUS_COLORS: Record<string, string> = {
  upcoming: '#60a5fa', completed: '#34d399', cancelled: '#f87171',
};

export function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState<'revenue' | 'bookings'>('revenue');
  const [revData, setRevData] = useState<RevenueAnalytics | null>(null);
  const [bookData, setBookData] = useState<BookingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRevenueAnalytics(days), fetchBookingAnalytics(days)])
      .then(([r, b]) => { setRevData(r); setBookData(b); })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-sub">Platform performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              className={`admin-btn ${days === d ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: '1rem', width: 'fit-content' }}>
        <button className={`admin-tab${tab === 'revenue' ? ' active' : ''}`} onClick={() => setTab('revenue')}>Revenue</button>
        <button className={`admin-tab${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
      </div>

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" />Loading analytics…</div>
      ) : tab === 'revenue' && revData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Daily Revenue */}
          <div className="admin-card">
            <div className="admin-card-header"><span className="admin-card-title">Daily Revenue (₹) — Last {days} days</span></div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revData.dailyRevenue} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={60} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-grid-2">
            {/* Revenue per Bus */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Top Buses by Revenue</span></div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revData.busRevenue} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                    <YAxis type="category" dataKey="busName" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Routes */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Top Routes by Revenue</span></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Route</th><th>Revenue</th><th>Bookings</th></tr></thead>
                  <tbody>
                    {revData.routeRevenue.map((r, i) => (
                      <tr key={i}>
                        <td style={{ color: '#64748b' }}>{i + 1}</td>
                        <td style={{ fontSize: '0.78rem' }}>{r._id.departure} → {r._id.arrival}</td>
                        <td style={{ color: '#34d399', fontWeight: 600 }}>₹{r.revenue.toLocaleString()}</td>
                        <td>{r.bookingCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : tab === 'bookings' && bookData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Daily Bookings */}
          <div className="admin-card">
            <div className="admin-card-header"><span className="admin-card-title">Daily Bookings — Last {days} days</span></div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={bookData.dailyBookings} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} width={40} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" stroke="#34d399" fill="url(#bookGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-grid-2">
            {/* Status Breakdown Pie */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Status Breakdown</span></div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={bookData.statusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                      {bookData.statusBreakdown.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry._id] ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                    <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Popular Routes</span></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Route</th><th>Bookings</th></tr></thead>
                  <tbody>
                    {bookData.popularRoutes.map((r, i) => (
                      <tr key={i}>
                        <td style={{ color: '#64748b' }}>{i + 1}</td>
                        <td style={{ fontSize: '0.78rem' }}>{r._id.departure} → {r._id.arrival}</td>
                        <td style={{ fontWeight: 600, color: '#60a5fa' }}>{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

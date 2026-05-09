import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from './Toaster';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

interface Props {
  pendingReviews?: number;
}

export function AdminLayout({ pendingReviews }: Props) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/buses',     icon: 'directions_bus', label: 'Buses' },
    { to: '/admin/bookings',  icon: 'receipt_long', label: 'Bookings' },
    { to: '/admin/reviews',   icon: 'star', label: 'Reviews', badge: pendingReviews },
    { to: '/admin/users',     icon: 'group', label: 'Users' },
    { to: '/admin/analytics', icon: 'bar_chart', label: 'Analytics' },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('adminKey');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">🚌</div>
            <div>
              <div className="admin-sidebar-logo-text">BusScape</div>
              <div className="admin-sidebar-logo-sub">Admin Console</div>
            </div>
          </div>
          <nav className="admin-nav">
            <div className="admin-nav-section">Main</div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `admin-nav-link${isActive ? ' active' : ''}`
                }
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {item.icon}
                </span>
                {item.label}
                {item.badge && item.badge > 0 ? (
                  <span className="admin-nav-badge">{item.badge}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <button className="admin-signout-btn" onClick={handleSignOut}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
            }}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
          </button>
          <span className="admin-topbar-title">Admin Panel</span>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🔒 Secured</span>
          </div>
        </div>
        <div className="admin-page">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

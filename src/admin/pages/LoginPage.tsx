import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../api/dashboard.api';
import '../admin.css';

export function LoginPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    localStorage.setItem('adminKey', key.trim());
    try {
      await fetchDashboardStats();
      navigate('/admin/dashboard', { replace: true });
    } catch {
      localStorage.removeItem('adminKey');
      setError('Invalid admin key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">🚌</div>
          <div>
            <p className="admin-login-title">BusScape Admin</p>
            <p className="admin-login-sub">Enter your admin key to continue</p>
          </div>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label className="admin-label">Admin Key</label>
            <input
              className="admin-input"
              type="password"
              placeholder="Enter your admin secret key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading || !key.trim()}
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          >
            {loading && <span className="admin-spinner" style={{ width: 16, height: 16 }} />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: '#374151', textAlign: 'center', marginTop: '1.5rem' }}>
          BusScape Admin Console — Internal Use Only
        </p>
      </div>
    </div>
  );
}

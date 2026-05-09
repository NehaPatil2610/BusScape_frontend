import { useEffect, useRef, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let _addToast: ((t: Omit<Toast, 'id'>) => void) | null = null;

export const toast = {
  success: (msg: string) => _addToast?.({ message: msg, type: 'success' }),
  error:   (msg: string) => _addToast?.({ message: msg, type: 'error' }),
  info:    (msg: string) => _addToast?.({ message: msg, type: 'info' }),
};

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', icon: 'check_circle', color: '#34d399' },
  error:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  icon: 'error',         color: '#f87171' },
  info:    { bg: 'rgba(37,99,235,0.15)',   border: 'rgba(37,99,235,0.4)', icon: 'info',           color: '#60a5fa' },
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ref = useRef(0);

  useEffect(() => {
    _addToast = (t) => {
      const id = ++ref.current;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500);
    };
    return () => { _addToast = null; };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => {
        const c = COLORS[t.type];
        return (
          <div
            key={t.id}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#e2e8f0',
              minWidth: 260,
              maxWidth: 380,
              backdropFilter: 'blur(8px)',
              animation: 'admin-slide-in 0.2s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.color }}>
              {c.icon}
            </span>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}

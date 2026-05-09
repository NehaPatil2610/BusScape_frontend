

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, loading,
  title, description, confirmLabel = 'Confirm', destructive = false,
}: Props) {
  if (!isOpen) return null;
  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="admin-dialog-title">{title}</div>
        <div className="admin-dialog-desc">{description}</div>
        <div className="admin-dialog-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`admin-btn ${destructive ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="admin-spinner" style={{ width: 14, height: 14 }} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

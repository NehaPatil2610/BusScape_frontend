import { useCallback, useEffect, useState } from 'react';
import { fetchAdminReviews, moderateReview, deleteReview } from '../api/reviews.api';
import type { Review, ReviewListParams, ModerationStatus } from '../api/reviews.api';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StarRating } from '../components/StarRating';
import { toast } from '../components/Toaster';

type Tab = ModerationStatus | 'all';
const TABS: { label: string; value: Tab }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
];

export function ReviewListPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [filters, setFilters] = useState<ReviewListParams>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [moderating, setModerating] = useState<string | null>(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminReviews({
        ...filters,
        moderationStatus: tab === 'all' ? undefined : tab,
        page,
        pageSize: 20,
      });
      setReviews(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [filters, tab]);

  useEffect(() => { load(1); }, [load]);

  const handleModerate = async (reviewId: string, status: ModerationStatus) => {
    setModerating(reviewId);
    try {
      await moderateReview(reviewId, status);
      toast.success(`Review ${status}`);
      load(pagination.page);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Moderation failed');
    } finally {
      setModerating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteReview(deleteTarget._id);
      toast.success('Review deleted');
      setDeleteTarget(null);
      load(pagination.page);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const busName = (r: Review) =>
    typeof r.bus_id === 'string' ? r.bus_id : r.bus_id.name;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews</h1>
          <p className="admin-page-sub">{pagination.total} results in current view</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '1rem', width: 'fit-content' }}>
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`admin-tab${tab === t.value ? ' active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-filter-bar">
          <select
            className="admin-select"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':') as any;
              setFilters((f) => ({ ...f, sortBy, sortOrder }));
            }}
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="rating:desc">Rating ↓</option>
            <option value="rating:asc">Rating ↑</option>
          </select>
          <select
            className="admin-select"
            onChange={(e) => {
              const v = e.target.value;
              setFilters((f) => ({ ...f, minRating: v ? Number(v) : undefined }));
            }}
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}★ & above</option>
            ))}
          </select>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading"><span className="admin-spinner" />Loading…</div>
          ) : reviews.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">⭐</span>
              <span>No reviews found</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>User</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap' }}>{busName(r)}</td>
                    <td><StarRating value={r.rating} /></td>
                    <td style={{ maxWidth: 240, fontSize: '0.8rem', color: '#94a3b8' }}>
                      {r.comment
                        ? r.comment.length > 80 ? r.comment.slice(0, 80) + '…' : r.comment
                        : <em style={{ color: '#374151' }}>No comment</em>}
                    </td>
                    <td style={{ fontSize: '0.7rem', color: '#64748b', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.userSub ? r.userSub.slice(0, 16) + '…' : '—'}
                    </td>
                    <td>
                      {r.verifiedTrip
                        ? <span className="admin-badge admin-badge-green">Verified</span>
                        : <span className="admin-badge admin-badge-gray">Unverified</span>}
                    </td>
                    <td>
                      <span className={`admin-badge ${r.moderationStatus === 'approved' ? 'admin-badge-green' : r.moderationStatus === 'rejected' ? 'admin-badge-red' : 'admin-badge-yellow'}`}>
                        {r.moderationStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                        {r.moderationStatus !== 'approved' && (
                          <button
                            className="admin-btn admin-btn-success admin-btn-sm"
                            disabled={moderating === r._id}
                            onClick={() => handleModerate(r._id, 'approved')}
                            title="Approve"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                          </button>
                        )}
                        {r.moderationStatus !== 'rejected' && (
                          <button
                            className="admin-btn admin-btn-warning admin-btn-sm"
                            disabled={moderating === r._id}
                            onClick={() => handleModerate(r._id, 'rejected')}
                            title="Reject"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>block</span>
                          </button>
                        )}
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => setDeleteTarget(r)}
                          title="Delete"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination {...pagination} onChange={(p) => load(p)} />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review? Bus ratings will be recomputed."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

import { useEffect, useState } from 'react'
import { fetchBusReviews } from '../../api/searchApi'
import type { BusReview } from '../../types/home'

interface ReviewsSectionProps {
  busId: string
}

function normalize(payload: unknown): { reviews: BusReview[]; hasMore: boolean } {
  if (Array.isArray(payload)) {
    return { reviews: payload as BusReview[], hasMore: false }
  }
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const value = payload as { data: BusReview[]; pagination?: { page: number; totalPages: number } }
    const hasMore = value.pagination ? value.pagination.page < value.pagination.totalPages : false
    return { reviews: value.data ?? [], hasMore }
  }
  return { reviews: [], hasMore: false }
}

function relativeTime(value?: string): string {
  if (!value) return ''
  const ts = new Date(value).getTime()
  if (!Number.isFinite(ts)) return ''
  const diffMs = Date.now() - ts
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Today'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export function ReviewsSection({ busId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<BusReview[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!busId) return
    setIsLoading(true)
    setError(null)
    const controller = new AbortController()
    fetchBusReviews(busId, 1, 10, controller.signal)
      .then((response) => {
        const { reviews: list, hasMore: more } = normalize(response.data)
        setReviews(list)
        setHasMore(more)
        setPage(1)
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Failed to load reviews')
        }
      })
      .finally(() => setIsLoading(false))
    return () => controller.abort()
  }, [busId])

  const loadMore = async () => {
    setIsLoading(true)
    try {
      const next = page + 1
      const response = await fetchBusReviews(busId, next, 10)
      const { reviews: more, hasMore: moreFlag } = normalize(response.data)
      setReviews((prev) => [...prev, ...more])
      setHasMore(moreFlag)
      setPage(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      style={{
        margin: '2rem auto 0',
        padding: '1.5rem',
        border: '1px solid var(--color-border)',
        borderRadius: '1rem',
        background: 'var(--color-surface)',
        maxWidth: '900px',
        width: '100%',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Reviews</h2>

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {isLoading && reviews.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No reviews yet — be the first to share your experience.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => (
            <article
              key={review._id ?? review.id ?? review.reviewId}
              style={{
                padding: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <strong>{review.userName ?? 'Traveller'}</strong>
                <span style={{ color: '#f59e0b' }}>
                  {'★'.repeat(Math.round(review.rating))}
                  <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - Math.round(review.rating))}</span>
                </span>
                {review.verifiedTrip && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(34,197,94,0.15)',
                      color: '#16a34a',
                      fontWeight: 700,
                    }}
                  >
                    Verified trip
                  </span>
                )}
                <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '0.85rem' }}>
                  {relativeTime(review.createdAt)}
                </span>
              </div>
              {review.comment && <p style={{ margin: '0.5rem 0 0' }}>{review.comment}</p>}
              {review.photos && review.photos.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {review.photos.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                      }}
                    />
                  ))}
                </div>
              )}
            </article>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoading}
              style={{
                alignSelf: 'center',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.6rem',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                cursor: 'pointer',
              }}
            >
              {isLoading ? 'Loading…' : 'Load more reviews'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

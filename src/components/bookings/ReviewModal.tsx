import { useState } from 'react'
import { createReview } from '../../api/searchApi'

interface ReviewModalProps {
  bookingId: string
  busName: string
  isOpen: boolean
  onClose: () => void
  onSubmitted: (bookingId: string) => void
}

export function ReviewModal({
  bookingId,
  busName,
  isOpen,
  onClose,
  onSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [photosText, setPhotosText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (rating < 1 || rating > 5) {
      setError('Pick a rating between 1 and 5.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const photos = photosText
        .split(/[\n,]/)
        .map((p) => p.trim())
        .filter(Boolean)
      await createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
        photos: photos.length > 0 ? photos : undefined,
      })
      onSubmitted(bookingId)
      onClose()
      setRating(5)
      setComment('')
      setPhotosText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          padding: '1.5rem',
          borderRadius: '1rem',
          width: 'min(480px, 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Rate your trip</h2>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.7, fontSize: '0.9rem' }}>{busName}</p>
        </div>

        <div>
          <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rating</label>
          <div style={{ fontSize: '1.75rem', cursor: 'pointer', userSelect: 'none' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{ color: star <= rating ? '#f59e0b' : 'rgba(0,0,0,0.2)' }}
                role="button"
                aria-label={`${star} stars`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Comment</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="How was your journey?"
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              resize: 'vertical',
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
            Photo URLs (one per line, optional)
          </span>
          <textarea
            value={photosText}
            onChange={(e) => setPhotosText(e.target.value)}
            rows={2}
            placeholder="https://..."
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              resize: 'vertical',
            }}
          />
        </label>

        {error && <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit review'}
          </button>
        </div>
      </form>
    </div>
  )
}

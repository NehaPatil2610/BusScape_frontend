import { useEffect, useState } from 'react'
import {
  createSavedPassenger,
  deleteSavedPassenger,
  listSavedPassengers,
  updateSavedPassenger,
} from '../api/searchApi'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useTheme } from '../hooks/useAppState'
import { useLogtoUser } from '../hooks/useLogtoUser'
import type { PassengerGender, SavedPassenger, SavedPassengerInput } from '../types/home'
import './ProfilePage.css'

const EMPTY_FORM: SavedPassengerInput = {
  name: '',
  age: 18,
  gender: 'male',
  idType: '',
  idNumber: '',
  isDefault: false,
}

function getId(passenger: SavedPassenger): string {
  return passenger._id ?? passenger.id ?? ''
}

function normalizeList(payload: unknown): SavedPassenger[] {
  if (Array.isArray(payload)) return payload as SavedPassenger[]
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data: unknown }).data
    if (Array.isArray(data)) return data as SavedPassenger[]
  }
  return []
}

export function SavedPassengersPage() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useLogtoUser()
  const [passengers, setPassengers] = useState<SavedPassenger[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<SavedPassengerInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const reload = () => {
    setIsLoading(true)
    setError(null)
    listSavedPassengers()
      .then((response) => setPassengers(normalizeList(response.data)))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load saved passengers'),
      )
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    reload()
  }, [isAuthenticated])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !Number.isFinite(form.age) || form.age <= 0) {
      setError('Name and a valid age are required.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      if (editingId) {
        await updateSavedPassenger(editingId, form)
      } else {
        await createSavedPassenger(form)
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save passenger')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (passenger: SavedPassenger) => {
    setEditingId(getId(passenger))
    setForm({
      name: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      idType: passenger.idType ?? '',
      idNumber: passenger.idNumber ?? '',
      isDefault: passenger.isDefault ?? false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved passenger?')) return
    try {
      await deleteSavedPassenger(id)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="profile-main">
          <div className="profile-section profile-empty-state">
            <h2>Sign in to manage saved passengers</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="profile-main">
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            <span className="material-symbols-outlined" style={{ fontSize: '2.25rem' }}>
              groups
            </span>
          </div>
          <div className="profile-header-info">
            <h1>Saved travellers</h1>
            <p>Quickly select these at checkout instead of re-entering details.</p>
          </div>
        </div>

        {error && <div className="profile-status error">{error}</div>}

        <form className="profile-section" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit passenger' : 'Add a new passenger'}</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="profile-field">
              <label>Age</label>
              <input
                type="number"
                min={1}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                required
              />
            </div>
            <div className="profile-field">
              <label>Gender</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as PassengerGender })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="profile-field">
              <label>ID type</label>
              <input
                value={form.idType ?? ''}
                placeholder="Aadhaar, Passport…"
                onChange={(e) => setForm({ ...form, idType: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>ID number</label>
              <input
                value={form.idNumber ?? ''}
                onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Default</label>
              <select
                value={form.isDefault ? 'yes' : 'no'}
                onChange={(e) => setForm({ ...form, isDefault: e.target.value === 'yes' })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="profile-actions">
            <button type="submit" className="primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId ? 'Update passenger' : 'Add passenger'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(EMPTY_FORM)
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="profile-section">
          <h2>Your saved travellers</h2>
          {isLoading ? (
            <p>Loading…</p>
          ) : passengers.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No saved travellers yet.</p>
          ) : (
            <div className="profile-grid">
              {passengers.map((passenger) => {
                const id = getId(passenger)
                return (
                  <div key={id} className="profile-readonly" style={{ gap: '0.5rem' }}>
                    <span className="key">
                      {passenger.name}
                      {passenger.isDefault && (
                        <span className="profile-badge verified" style={{ marginLeft: '0.4rem' }}>
                          Default
                        </span>
                      )}
                    </span>
                    <span className="value">
                      Age {passenger.age} • {passenger.gender}
                      {passenger.idType ? ` • ${passenger.idType} ${passenger.idNumber ?? ''}` : ''}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => startEdit(passenger)}
                        style={{ padding: '0.3rem 0.7rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        style={{ padding: '0.3rem 0.7rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

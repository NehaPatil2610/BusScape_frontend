import { useLogto } from '@logto/react'
import { useEffect, useState } from 'react'
import {
  updateAccount,
  updateAccountProfile,
  type AccountProfileUpdate,
  type AccountUpdate,
} from '../api/logtoAccount'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useTheme } from '../hooks/useAppState'
import { useLogtoUser } from '../hooks/useLogtoUser'
import './ProfilePage.css'

interface FormState {
  username: string
  name: string
  avatar: string
  givenName: string
  familyName: string
  middleName: string
  nickname: string
  gender: string
  birthdate: string
  locale: string
}

const EMPTY_FORM: FormState = {
  username: '',
  name: '',
  avatar: '',
  givenName: '',
  familyName: '',
  middleName: '',
  nickname: '',
  gender: '',
  birthdate: '',
  locale: '',
}

function formatTimestamp(value: unknown): string {
  if (!value) return '—'
  const ms = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(ms)) return String(value)
  return new Date(ms).toLocaleString()
}

export function ProfilePage() {
  const { theme, toggleTheme } = useTheme()
  const { signIn, getAccessToken } = useLogto()
  const { isAuthenticated, isLoading, user, refresh } = useLogtoUser()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!user) return
    const profile = (user.userInfo?.profile ?? {}) as Record<string, string | undefined>
    setForm({
      username: user.username ?? '',
      name: user.name ?? '',
      avatar: user.picture ?? '',
      givenName: profile.given_name ?? '',
      familyName: profile.family_name ?? '',
      middleName: profile.middle_name ?? '',
      nickname: profile.nickname ?? '',
      gender: profile.gender ?? '',
      birthdate: profile.birthdate ?? '',
      locale: profile.locale ?? '',
    })
  }, [user])

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="profile-page">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="profile-main">
          <div className="profile-section profile-empty-state">
            <h2>Sign in to view your profile</h2>
            <p>Your BusScape profile is linked to your Logto account.</p>
            <div className="profile-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="primary"
                onClick={() => signIn(`${window.location.origin}/callback`)}
              >
                Sign in
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const onChange = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setStatus(null)

    try {
      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('Could not obtain access token. Please sign in again.')
      }

      const account: AccountUpdate = {
        username: form.username || undefined,
        name: form.name || undefined,
        avatar: form.avatar || undefined,
      }
      const profile: AccountProfileUpdate = {
        givenName: form.givenName || undefined,
        familyName: form.familyName || undefined,
        middleName: form.middleName || undefined,
        nickname: form.nickname || undefined,
        gender: form.gender || undefined,
        birthdate: form.birthdate || undefined,
        locale: form.locale || undefined,
      }

      await updateAccount(accessToken, account)
      await updateAccountProfile(accessToken, profile)

      setStatus({ tone: 'success', message: 'Profile updated successfully.' })
      refresh()
    } catch (error) {
      setStatus({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update profile. The Account API may be disabled in Logto Console.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const avatarLetter = (form.name || form.username || user?.email || 'U').trim().charAt(0).toUpperCase()

  return (
    <div className="profile-page">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="profile-main">
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {form.avatar ? <img src={form.avatar} alt="Avatar" /> : avatarLetter}
          </div>
          <div className="profile-header-info">
            <h1>{form.name || form.username || 'BusScape User'}</h1>
            <p>{user?.email ?? 'No email on file'}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>ID: {user?.sub ?? '—'}</p>
          </div>
        </div>

        {status && <div className={`profile-status ${status.tone}`}>{status.message}</div>}

        <form className="profile-section" onSubmit={handleSave}>
          <h2>Account</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Username</label>
              <input value={form.username} onChange={onChange('username')} placeholder="username" />
            </div>
            <div className="profile-field">
              <label>Display name</label>
              <input value={form.name} onChange={onChange('name')} placeholder="Full name" />
            </div>
            <div className="profile-field">
              <label>Avatar URL</label>
              <input value={form.avatar} onChange={onChange('avatar')} placeholder="https://..." />
            </div>
          </div>

          <h2 style={{ marginTop: '1.5rem' }}>Profile</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Given name</label>
              <input value={form.givenName} onChange={onChange('givenName')} />
            </div>
            <div className="profile-field">
              <label>Family name</label>
              <input value={form.familyName} onChange={onChange('familyName')} />
            </div>
            <div className="profile-field">
              <label>Middle name</label>
              <input value={form.middleName} onChange={onChange('middleName')} />
            </div>
            <div className="profile-field">
              <label>Nickname</label>
              <input value={form.nickname} onChange={onChange('nickname')} />
            </div>
            <div className="profile-field">
              <label>Gender</label>
              <select value={form.gender} onChange={onChange('gender')}>
                <option value="">—</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="profile-field">
              <label>Birthdate</label>
              <input type="date" value={form.birthdate} onChange={onChange('birthdate')} />
            </div>
            <div className="profile-field">
              <label>Locale</label>
              <input value={form.locale} onChange={onChange('locale')} placeholder="en-IN" />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={() => refresh()} disabled={isSaving}>
              Reload from Logto
            </button>
          </div>
        </form>

        <div className="profile-section">
          <h2>Read-only details</h2>
          <div className="profile-grid">
            <div className="profile-readonly">
              <span className="key">Email</span>
              <span className="value">
                {user?.email ?? '—'}
                {user?.email && (
                  <span
                    className={`profile-badge ${user.emailVerified ? 'verified' : 'unverified'}`}
                  >
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                )}
              </span>
            </div>
            <div className="profile-readonly">
              <span className="key">Phone</span>
              <span className="value">
                {user?.phoneNumber ?? '—'}
                {user?.phoneNumber && (
                  <span
                    className={`profile-badge ${user.phoneNumberVerified ? 'verified' : 'unverified'}`}
                  >
                    {user.phoneNumberVerified ? 'Verified' : 'Unverified'}
                  </span>
                )}
              </span>
            </div>
            <div className="profile-readonly">
              <span className="key">Created</span>
              <span className="value">{formatTimestamp(user?.userInfo?.created_at)}</span>
            </div>
            <div className="profile-readonly">
              <span className="key">Updated</span>
              <span className="value">{formatTimestamp(user?.userInfo?.updated_at)}</span>
            </div>
            <div className="profile-readonly">
              <span className="key">Identities</span>
              <span className="value">
                {user?.identities && Object.keys(user.identities).length > 0
                  ? Object.keys(user.identities).join(', ')
                  : 'None linked'}
              </span>
            </div>
            <div className="profile-readonly">
              <span className="key">Custom data</span>
              <span className="value">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(user?.customData ?? {}, null, 2)}
                </pre>
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

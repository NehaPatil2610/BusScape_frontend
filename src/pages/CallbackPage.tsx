import { useHandleSignInCallback } from '@logto/react'
import { useNavigate } from 'react-router-dom'

export function CallbackPage() {
  const navigate = useNavigate()
  const { isLoading } = useHandleSignInCallback(() => {
    navigate('/', { replace: true })
  })

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>Redirecting...</div>
  }

  return null
}

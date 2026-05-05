import { useEffect } from 'react'
import { setCurrentUserSub } from '../api/httpClient'
import { useLogtoUser } from '../hooks/useLogtoUser'

export function AuthSubBridge() {
  const { user } = useLogtoUser()

  useEffect(() => {
    setCurrentUserSub(user?.sub ?? null)
  }, [user?.sub])

  return null
}

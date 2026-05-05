import { useLogto, type IdTokenClaims, type UserInfoResponse } from '@logto/react'
import { useEffect, useState } from 'react'

export interface LogtoUser {
  sub?: string
  name?: string
  username?: string
  email?: string
  emailVerified?: boolean
  phoneNumber?: string
  phoneNumberVerified?: boolean
  picture?: string
  customData?: Record<string, unknown>
  identities?: UserInfoResponse['identities']
  claims?: IdTokenClaims
  userInfo?: UserInfoResponse
}

interface State {
  isAuthenticated: boolean
  isLoading: boolean
  user?: LogtoUser
  error?: Error
}

export function useLogtoUser(): State & { refresh: () => void } {
  const { isAuthenticated, getIdTokenClaims, fetchUserInfo } = useLogto()
  const [state, setState] = useState<State>({
    isAuthenticated: false,
    isLoading: true,
  })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isActive = true

    if (!isAuthenticated) {
      setState({ isAuthenticated: false, isLoading: false, user: undefined })
      return
    }

    setState((previous) => ({ ...previous, isAuthenticated: true, isLoading: true }))

    Promise.all([getIdTokenClaims(), fetchUserInfo()])
      .then(([claims, userInfo]) => {
        if (!isActive) return

        const user: LogtoUser = {
          sub: userInfo?.sub ?? claims?.sub,
          name: userInfo?.name ?? claims?.name ?? undefined,
          username: userInfo?.username ?? claims?.username ?? undefined,
          email: userInfo?.email ?? claims?.email ?? undefined,
          emailVerified: userInfo?.email_verified ?? claims?.email_verified,
          phoneNumber: userInfo?.phone_number ?? claims?.phone_number ?? undefined,
          phoneNumberVerified:
            userInfo?.phone_number_verified ?? claims?.phone_number_verified,
          picture: userInfo?.picture ?? claims?.picture ?? undefined,
          customData: userInfo?.custom_data as Record<string, unknown> | undefined,
          identities: userInfo?.identities,
          claims,
          userInfo,
        }

        setState({ isAuthenticated: true, isLoading: false, user })
      })
      .catch((error: unknown) => {
        if (!isActive) return
        setState({
          isAuthenticated: true,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to load user'),
        })
      })

    return () => {
      isActive = false
    }
  }, [isAuthenticated, getIdTokenClaims, fetchUserInfo, refreshKey])

  return {
    ...state,
    refresh: () => setRefreshKey((value) => value + 1),
  }
}

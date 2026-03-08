import { useContext, useMemo } from 'react'
import { AppContext } from '../context/appContextStore'
import type { AppContextValue, ThemeMode } from '../types/app'

function useAppContext(): AppContextValue {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}

export function useAppState(): AppContextValue {
  return useAppContext()
}

export function useTheme() {
  const { state, dispatch } = useAppContext()

  return useMemo(
    () => ({
      theme: state.theme,
      setTheme: (theme: ThemeMode) =>
        dispatch({
          type: 'SET_THEME',
          payload: theme,
        }),
      toggleTheme: () =>
        dispatch({
          type: 'TOGGLE_THEME',
        }),
    }),
    [dispatch, state.theme],
  )
}

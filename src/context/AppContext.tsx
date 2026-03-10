import {
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react'
import type { AppAction, AppState, ThemeMode } from '../types/app'
import { AppContext } from './appContextStore'

const THEME_STORAGE_KEY = 'busscape-theme'

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      }
    default:
      return state
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => ({
    theme: getPreferredTheme(),
  }))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    document.documentElement.classList.toggle('dark', state.theme === 'dark')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, state.theme)
    }
  }, [state.theme])

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [dispatch, state],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export type ThemeMode = 'light' | 'dark'

export interface AppState {
  theme: ThemeMode
}

export type AppAction =
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'TOGGLE_THEME' }

export interface AppContextValue {
  state: AppState
  dispatch: (action: AppAction) => void
}

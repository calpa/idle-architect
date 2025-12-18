import { defaultGameState, gameStateSchema, type GameState } from './schema/gameState'

const storageKey = 'idle-architect:game:v1'

type SavedGame = {
  v: 1
  state: GameState
}

export function loadGameFromStorage(): GameState {
  try {
    if (typeof window === 'undefined') return defaultGameState
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return defaultGameState
    const parsed = JSON.parse(raw) as Partial<SavedGame>
    if (parsed?.v !== 1 || !parsed.state) return defaultGameState
    return gameStateSchema.parse({ ...defaultGameState, ...parsed.state })
  } catch {
    return defaultGameState
  }
}

export function saveGameToStorage(state: GameState) {
  try {
    if (typeof window === 'undefined') return
    const payload: SavedGame = { v: 1, state }
    window.localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

export function clearSavedGame() {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(storageKey)
  } catch {
    // ignore
  }
}

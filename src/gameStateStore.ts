import { atom } from 'jotai'
import { loadGameFromStorage } from './gamePersistence'
import type { GameState } from './schema/gameState'

export const gameStateAtom = atom<GameState>(loadGameFromStorage())

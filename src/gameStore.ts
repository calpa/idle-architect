import { atom, type Getter, type Setter } from 'jotai'
import { defaultGameState, gameStateSchema, type GameState } from './schema/gameState'

export const minedPerClick = 1
export const minerCost = 10
export const minerRatePerSecond = 1

export const gameStateAtom = atom<GameState>(defaultGameState)

export const derivedAtom = atom((get: Getter) => {
  const state = get(gameStateAtom)
  return {
    minedPerClick,
    minerCost,
    minerRatePerSecond,
    canBuyMiner: state.money >= minerCost,
    moneyPerSecond: state.autoMiners * minerRatePerSecond,
  }
})

export const mineAtom = atom(null, (get: Getter, set: Setter) => {
  const prev = get(gameStateAtom)
  const next: GameState = {
    ...prev,
    money: prev.money + minedPerClick,
    clicks: prev.clicks + 1,
  }
  set(gameStateAtom, gameStateSchema.parse(next))
})

export const buyAutoMinerAtom = atom(null, (get: Getter, set: Setter) => {
  const prev = get(gameStateAtom)
  if (prev.money < minerCost) return
  const next: GameState = {
    ...prev,
    money: prev.money - minerCost,
    autoMiners: prev.autoMiners + 1,
  }
  set(gameStateAtom, gameStateSchema.parse(next))
})

export const advanceAtom = atom(null, (get: Getter, set: Setter, dtSeconds: number) => {
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return

  const prev = get(gameStateAtom)
  if (prev.autoMiners <= 0) return

  const gained = prev.autoMiners * minerRatePerSecond * dtSeconds
  const next: GameState = {
    ...prev,
    money: prev.money + gained,
  }

  set(gameStateAtom, gameStateSchema.parse(next))
})

export const resetAtom = atom(null, (_get: Getter, set: Setter) => {
  set(gameStateAtom, defaultGameState)
})

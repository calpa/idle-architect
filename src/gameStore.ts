import { atom, type Getter, type Setter } from 'jotai'
import { defaultGameState, gameStateSchema, type GameState } from './gameSchema'

export const minedPerClick = 1

export type BuildingId = 'miner' | 'drill' | 'excavator'

export type BuildingConfig = {
  id: BuildingId
  name: string
  baseCost: number
  costGrowth: number
  baseRatePerSecond: number
}

export const buildingConfigs: readonly BuildingConfig[] = [
  { id: 'miner', name: 'Miner', baseCost: 10, costGrowth: 1.15, baseRatePerSecond: 1 },
  { id: 'drill', name: 'Drill', baseCost: 80, costGrowth: 1.17, baseRatePerSecond: 6 },
  { id: 'excavator', name: 'Excavator', baseCost: 500, costGrowth: 1.2, baseRatePerSecond: 30 },
] as const

export function nextCost(baseCost: number, costGrowth: number, owned: number) {
  return baseCost * Math.pow(costGrowth, owned)
}

export const gameStateAtom = atom<GameState>(defaultGameState)

export const derivedAtom = atom((get: Getter) => {
  const state = get(gameStateAtom)
  const buildings = buildingConfigs.map((cfg) => {
    const owned = state.buildings[cfg.id] ?? 0
    const cost = nextCost(cfg.baseCost, cfg.costGrowth, owned)
    const ratePerSecond = owned * cfg.baseRatePerSecond
    return {
      id: cfg.id,
      name: cfg.name,
      owned,
      cost,
      baseRatePerSecond: cfg.baseRatePerSecond,
      ratePerSecond,
      canBuy: state.money >= cost,
    }
  })

  const moneyPerSecond = buildings.reduce((sum, b) => sum + b.ratePerSecond, 0)

  return {
    minedPerClick,
    buildings,
    moneyPerSecond,
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

export const buyBuildingAtom = atom(null, (get: Getter, set: Setter, buildingId: BuildingId) => {
  const cfg = buildingConfigs.find((c) => c.id === buildingId)
  if (!cfg) return

  const prev = get(gameStateAtom)
  const owned = prev.buildings[buildingId] ?? 0
  const cost = nextCost(cfg.baseCost, cfg.costGrowth, owned)
  if (prev.money < cost) return

  const next: GameState = {
    ...prev,
    money: prev.money - cost,
    buildings: {
      ...prev.buildings,
      [buildingId]: owned + 1,
    },
  }

  set(gameStateAtom, gameStateSchema.parse(next))
})

export const advanceAtom = atom(null, (get: Getter, set: Setter, dtSeconds: number) => {
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return

  const prev = get(gameStateAtom)
  const productionPerSecond = buildingConfigs.reduce((sum, cfg) => {
    const owned = prev.buildings[cfg.id] ?? 0
    return sum + owned * cfg.baseRatePerSecond
  }, 0)

  if (productionPerSecond <= 0) return

  const gained = productionPerSecond * dtSeconds
  const next: GameState = {
    ...prev,
    money: prev.money + gained,
  }

  set(gameStateAtom, gameStateSchema.parse(next))
})

export const resetAtom = atom(null, (_get: Getter, set: Setter) => {
  set(gameStateAtom, defaultGameState)
})

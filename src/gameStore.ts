import { atom, type Getter, type Setter } from 'jotai'
import { defaultGameState, gameStateSchema, type GameState } from './schema/gameState'
import { shopItemConfigs, type ShopItemConfig, type ShopItemId } from './schema/shop'
import { clearSavedGame, loadGameFromStorage, saveGameToStorage } from './gamePersistence'
import { pushNotificationAtom } from './notificationStore'

export const minedPerClick = 1

const lockedTeaserThreshold = 0.7

function getOwned(state: GameState, id: ShopItemId) {
  switch (id) {
    case 'autoMiner':
      return state.autoMiners
    case 'drill':
      return state.drills
    case 'excavator':
      return state.excavators
    case 'factory':
      return state.factories
    case 'aiForeman':
      return state.aiForemen
  }
}

function setOwned(state: GameState, id: ShopItemId, nextOwned: number): GameState {
  switch (id) {
    case 'autoMiner':
      return { ...state, autoMiners: nextOwned }
    case 'drill':
      return { ...state, drills: nextOwned }
    case 'excavator':
      return { ...state, excavators: nextOwned }
    case 'factory':
      return { ...state, factories: nextOwned }
    case 'aiForeman':
      return { ...state, aiForemen: nextOwned }
  }
}

export function getShopItemCost(config: ShopItemConfig, owned: number) {
  const normalizedOwned = Math.max(0, Math.floor(owned))
  return Math.ceil(config.baseCost * Math.pow(config.costGrowth, normalizedOwned))
}

export function getMoneyPerSecond(state: GameState) {
  return (
    state.autoMiners * shopItemConfigs[0].ratePerSecond +
    state.drills * shopItemConfigs[1].ratePerSecond +
    state.excavators * shopItemConfigs[2].ratePerSecond +
    state.factories * shopItemConfigs[3].ratePerSecond +
    state.aiForemen * shopItemConfigs[4].ratePerSecond
  )
}

export const gameStateAtom = atom<GameState>(loadGameFromStorage())

export const saveGameAtom = atom(null, (get: Getter, set: Setter, reason: 'manual' | 'auto') => {
  const state = get(gameStateAtom)
  saveGameToStorage(state)
  set(pushNotificationAtom, {
    severity: 'success',
    message: reason === 'auto' ? 'Auto-saved' : 'Game saved',
  })
})

export const derivedAtom = atom((get: Getter) => {
  const state = get(gameStateAtom)
  const shopItems = shopItemConfigs
    .map((config) => {
      const owned = getOwned(state, config.id)
      const cost = getShopItemCost(config, owned)
      const unlocked = state.lifetimeMoneyEarned >= config.unlockAtLifetimeEarned
      const showLockedTeaser =
        !unlocked &&
        config.unlockAtLifetimeEarned > 0 &&
        state.lifetimeMoneyEarned >= config.unlockAtLifetimeEarned * lockedTeaserThreshold
      const visible = unlocked || showLockedTeaser

      return {
        id: config.id,
        name: config.name,
        owned,
        cost,
        ratePerSecond: config.ratePerSecond,
        canBuy: unlocked && state.money >= cost,
        unlocked,
        visible,
        unlockAtLifetimeEarned: config.unlockAtLifetimeEarned,
      }
    })
    .filter((x) => x.visible)
  const moneyPerSecond = getMoneyPerSecond(state)
  return {
    minedPerClick,
    moneyPerSecond,
    shopItems,
  }
})

export const mineAtom = atom(null, (get: Getter, set: Setter) => {
  const prev = get(gameStateAtom)
  const next: GameState = {
    ...prev,
    money: prev.money + minedPerClick,
    lifetimeMoneyEarned: prev.lifetimeMoneyEarned + minedPerClick,
    clicks: prev.clicks + 1,
  }
  set(gameStateAtom, gameStateSchema.parse(next))
})

function buyShopItem(get: Getter, set: Setter, id: ShopItemId) {
  const prev = get(gameStateAtom)
  const config = shopItemConfigs.find((c) => c.id === id)
  if (!config) return

  const owned = getOwned(prev, id)
  const cost = getShopItemCost(config, owned)
  if (prev.money < cost) return

  const nextOwned = owned + 1
  const nextBase: GameState = {
    ...prev,
    money: prev.money - cost,
  }
  const next = setOwned(nextBase, id, nextOwned)
  set(gameStateAtom, gameStateSchema.parse(next))

  set(pushNotificationAtom, {
    severity: 'success',
    message: `Bought ${config.name}`,
  })
}

export const buyAutoMinerAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'autoMiner')
})

export const buyDrillAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'drill')
})

export const buyExcavatorAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'excavator')
})

export const buyFactoryAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'factory')
})

export const buyAiForemanAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'aiForeman')
})

export const advanceAtom = atom(null, (get: Getter, set: Setter, dtSeconds: number) => {
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return

  const prev = get(gameStateAtom)
  const moneyPerSecond = getMoneyPerSecond(prev)
  if (moneyPerSecond <= 0) return

  const gained = moneyPerSecond * dtSeconds
  const next: GameState = {
    ...prev,
    money: prev.money + gained,
    lifetimeMoneyEarned: prev.lifetimeMoneyEarned + gained,
  }

  set(gameStateAtom, gameStateSchema.parse(next))
})

export const resetAtom = atom(null, (_get: Getter, set: Setter) => {
  clearSavedGame()
  set(gameStateAtom, defaultGameState)

  set(pushNotificationAtom, {
    severity: 'info',
    message: 'Game reset',
  })
})

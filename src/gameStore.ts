import { atom, type Getter, type Setter } from 'jotai'
import { defaultGameState, gameStateSchema, type GameState } from './schema/gameState'
import { shopItemConfigs, type ShopItemId } from './schema/shop'
import { clearSavedGame, saveGameToStorage } from './gamePersistence'
import { gameStateAtom } from './gameStateStore'
import { pushNotificationAtom } from './notificationStore'
import { checkAchievementsAtom, resetAchievementsAtom } from './achievementsStore'
import {
  getMaxAffordableQuantity,
  getShopItemCost,
  getTotalCostForQuantity,
} from './utils/shopPricing'

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

export function getMoneyPerSecond(state: GameState) {
  return (
    state.autoMiners * shopItemConfigs[0].ratePerSecond +
    state.drills * shopItemConfigs[1].ratePerSecond +
    state.excavators * shopItemConfigs[2].ratePerSecond +
    state.factories * shopItemConfigs[3].ratePerSecond +
    state.aiForemen * shopItemConfigs[4].ratePerSecond
  )
}

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
      const cost5 = getTotalCostForQuantity(config, owned, 5)
      const cost10 = getTotalCostForQuantity(config, owned, 10)
      const maxAffordableQty = getMaxAffordableQuantity(config, owned, state.money)
      const maxAffordableCost = getTotalCostForQuantity(config, owned, maxAffordableQty)
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
        cost5,
        cost10,
        maxAffordableQty,
        maxAffordableCost,
        ratePerSecond: config.ratePerSecond,
        canBuy: unlocked && state.money >= cost,
        canBuy5: unlocked && state.money >= cost5,
        canBuy10: unlocked && state.money >= cost10,
        canBuyMax: unlocked && maxAffordableQty > 0,
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
  const parsed = gameStateSchema.parse(next)
  set(gameStateAtom, parsed)
  set(checkAchievementsAtom, parsed)
})

function buyShopItem(get: Getter, set: Setter, id: ShopItemId, quantity: number | 'max') {
  const prev = get(gameStateAtom)
  const config = shopItemConfigs.find((c) => c.id === id)
  if (!config) return

  const owned = getOwned(prev, id)
  const resolvedQty =
    quantity === 'max' ? getMaxAffordableQuantity(config, owned, prev.money) : Math.max(0, Math.floor(quantity))
  if (resolvedQty <= 0) return

  const totalCost = getTotalCostForQuantity(config, owned, resolvedQty)
  if (prev.money < totalCost) return

  const nextOwned = owned + resolvedQty
  const nextBase: GameState = {
    ...prev,
    money: prev.money - totalCost,
  }
  const next = setOwned(nextBase, id, nextOwned)
  const parsed = gameStateSchema.parse(next)
  set(gameStateAtom, parsed)
  set(checkAchievementsAtom, parsed)

  set(pushNotificationAtom, {
    severity: 'success',
    message: `Bought ${config.name}`,
  })
}

export const buyAutoMinerAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'autoMiner', 1)
})

export const buyDrillAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'drill', 1)
})

export const buyExcavatorAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'excavator', 1)
})

export const buyFactoryAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'factory', 1)
})

export const buyAiForemanAtom = atom(null, (get: Getter, set: Setter) => {
  buyShopItem(get, set, 'aiForeman', 1)
})

export const buyShopItemAtom = atom(
  null,
  (get: Getter, set: Setter, input: { id: ShopItemId; quantity: number | 'max' }) => {
    buyShopItem(get, set, input.id, input.quantity)
  },
)

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

  const parsed = gameStateSchema.parse(next)
  set(gameStateAtom, parsed)
  set(checkAchievementsAtom, parsed)
})

export const resetAtom = atom(null, (_get: Getter, set: Setter) => {
  clearSavedGame()
  set(resetAchievementsAtom)
  set(gameStateAtom, defaultGameState)

  set(pushNotificationAtom, {
    severity: 'info',
    message: 'Game reset',
  })
})

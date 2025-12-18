import { atom, type Getter, type Setter } from 'jotai'
import type { GameState } from './schema/gameState'
import { achievementConfigs } from './schema/achievements'
import type { ShopItemId } from './schema/shop'
import { shopItemConfigs } from './schema/shop'
import { gameStateAtom } from './gameStateStore'
import { pushNotificationAtom } from './notificationStore'

type AchievementsState = {
  unlockedAtById: Record<string, number>
}

const storageKey = 'idle-architect:achievements:v1'

type SavedAchievements = {
  v: 1
  unlockedAtById: Record<string, number>
}

const defaultAchievementsState: AchievementsState = {
  unlockedAtById: {},
}

function loadAchievementsFromStorage(): AchievementsState {
  try {
    if (typeof window === 'undefined') return defaultAchievementsState
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return defaultAchievementsState
    const parsed = JSON.parse(raw) as Partial<SavedAchievements>
    if (parsed?.v !== 1 || !parsed.unlockedAtById) return defaultAchievementsState
    return { unlockedAtById: parsed.unlockedAtById }
  } catch {
    return defaultAchievementsState
  }
}

function saveAchievementsToStorage(state: AchievementsState) {
  try {
    if (typeof window === 'undefined') return
    const payload: SavedAchievements = { v: 1, unlockedAtById: state.unlockedAtById }
    window.localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

function clearAchievementsStorage() {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(storageKey)
  } catch {
    // ignore
  }
}

export const achievementsAtom = atom<AchievementsState>(loadAchievementsFromStorage())

export type AchievementView = {
  id: string
  title: string
  description: string
  unlockedAtMs: number | null
  progress: number
  current: number
  target: number
}

function getOwnedCount(state: GameState, itemId: ShopItemId) {
  switch (itemId) {
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

function getMetricValue(state: GameState, metric: (typeof achievementConfigs)[number]['metric']) {
  switch (metric.type) {
    case 'clicks':
      return state.clicks
    case 'owned':
      return getOwnedCount(state, metric.itemId)
    case 'moneyPerSecond':
      return Math.floor(
        state.autoMiners * shopItemConfigs[0].ratePerSecond +
          state.drills * shopItemConfigs[1].ratePerSecond +
          state.excavators * shopItemConfigs[2].ratePerSecond +
          state.factories * shopItemConfigs[3].ratePerSecond +
          state.aiForemen * shopItemConfigs[4].ratePerSecond,
      )
  }
}

export const achievementViewsAtom = atom((get: Getter) => {
  const state = get(gameStateAtom)
  const achievements = get(achievementsAtom)

  return achievementConfigs.map((cfg) => {
    const current = getMetricValue(state, cfg.metric)
    const target = cfg.metric.target
    const unlockedAtMs = achievements.unlockedAtById[cfg.id] ?? null
    const progress = target <= 0 ? 1 : Math.max(0, Math.min(1, current / target))

    return {
      id: cfg.id,
      title: cfg.title,
      description: cfg.description,
      unlockedAtMs,
      progress,
      current,
      target,
    } satisfies AchievementView
  })
})

export const checkAchievementsAtom = atom(null, (get: Getter, set: Setter, state: GameState) => {
  const currentAchievements = get(achievementsAtom)
  const unlockedAtById = { ...currentAchievements.unlockedAtById }
  let changed = false

  for (const cfg of achievementConfigs) {
    if (unlockedAtById[cfg.id] != null) continue
    const value = getMetricValue(state, cfg.metric)
    if (value >= cfg.metric.target) {
      unlockedAtById[cfg.id] = Date.now()
      changed = true
      set(pushNotificationAtom, {
        severity: 'success',
        message: `Achievement unlocked: ${cfg.title}`,
      })
    }
  }

  if (!changed) return

  const next = { unlockedAtById }
  set(achievementsAtom, next)
  saveAchievementsToStorage(next)
})

export const resetAchievementsAtom = atom(null, (_get: Getter, set: Setter) => {
  clearAchievementsStorage()
  set(achievementsAtom, defaultAchievementsState)
})

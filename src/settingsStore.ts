import { atom } from 'jotai'
import { defaultSettings, settingsSchema, type Settings } from './schema/settings'

const storageKey = 'idle-architect:settings:v1'

function loadSettingsFromStorage(): Settings {
  try {
    if (typeof window === 'undefined') return defaultSettings
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    return settingsSchema.parse({ ...defaultSettings, ...parsed })
  } catch {
    return defaultSettings
  }
}

export const settingsAtom = atom<Settings>(loadSettingsFromStorage())

export const updateSettingsAtom = atom(null, (_get, set, patch: Partial<Settings>) => {
  set(settingsAtom, (prev) => {
    const next = settingsSchema.parse({ ...prev, ...patch })
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // ignore
    }
    return next
  })
})

export const resetSettingsAtom = atom(null, (_get, set) => {
  set(settingsAtom, () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(defaultSettings))
    } catch {
      // ignore
    }
    return defaultSettings
  })
})

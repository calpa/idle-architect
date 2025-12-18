import { atom, type Getter, type Setter } from 'jotai'

export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error'

export type Notification = {
  id: string
  severity: NotificationSeverity
  message: string
}

export const notificationQueueAtom = atom<Notification[]>([])

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const pushNotificationAtom = atom(
  null,
  (_get: Getter, set: Setter, input: Omit<Notification, 'id'>) => {
    const next: Notification = { id: makeId(), ...input }
    set(notificationQueueAtom, (prev) => [...prev, next])
  },
)

export const popNotificationAtom = atom(null, (_get: Getter, set: Setter) => {
  set(notificationQueueAtom, (prev) => prev.slice(1))
})

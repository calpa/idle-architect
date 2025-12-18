import { z } from 'zod'

export const settingsSchema = z.object({
  numberNotation: z.enum(['compact', 'standard', 'exponential']),
  autosaveEnabled: z.boolean(),
  autosaveIntervalMinutes: z.enum(['1', '10']),
})

export type Settings = z.infer<typeof settingsSchema>

export const defaultSettings: Settings = {
  numberNotation: 'compact',
  autosaveEnabled: true,
  autosaveIntervalMinutes: '1',
}

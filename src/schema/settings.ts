import { z } from 'zod'

export const settingsSchema = z.object({
  numberNotation: z.enum(['compact', 'standard', 'exponential']),
})

export type Settings = z.infer<typeof settingsSchema>

export const defaultSettings: Settings = {
  numberNotation: 'compact',
}

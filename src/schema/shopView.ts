import { z } from 'zod'

export const shopItemViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  owned: z.number().int().min(0),
  cost: z.number().finite().min(0),
  ratePerSecond: z.number().finite().min(0),
  canBuy: z.boolean(),
  unlocked: z.boolean(),
  unlockAtLifetimeEarned: z.number().finite().min(0),
})

export type ShopItemView = z.infer<typeof shopItemViewSchema>

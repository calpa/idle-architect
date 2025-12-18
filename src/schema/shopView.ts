import { z } from 'zod'

export const shopItemViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  owned: z.number().int().min(0),
  cost: z.number().finite().min(0),
  cost5: z.number().finite().min(0),
  cost10: z.number().finite().min(0),
  maxAffordableQty: z.number().int().min(0),
  maxAffordableCost: z.number().finite().min(0),
  ratePerSecond: z.number().finite().min(0),
  canBuy: z.boolean(),
  canBuy5: z.boolean(),
  canBuy10: z.boolean(),
  canBuyMax: z.boolean(),
  unlocked: z.boolean(),
  unlockAtLifetimeEarned: z.number().finite().min(0),
})

export type ShopItemView = z.infer<typeof shopItemViewSchema>

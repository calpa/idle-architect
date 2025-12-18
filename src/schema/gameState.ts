import { z } from 'zod'

export const gameStateSchema = z.object({
  money: z.number().finite().min(0),
  lifetimeMoneyEarned: z.number().finite().min(0),
  clicks: z.number().int().min(0),
  autoMiners: z.number().int().min(0),
  drills: z.number().int().min(0),
  excavators: z.number().int().min(0),
  factories: z.number().int().min(0),
  aiForemen: z.number().int().min(0),
})

export type GameState = z.infer<typeof gameStateSchema>

export const defaultGameState: GameState = {
  money: 0,
  lifetimeMoneyEarned: 0,
  clicks: 0,
  autoMiners: 0,
  drills: 0,
  excavators: 0,
  factories: 0,
  aiForemen: 0,
}

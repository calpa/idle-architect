import { z } from 'zod'

export const gameStateSchema = z.object({
  money: z.number().finite().min(0),
  clicks: z.number().int().min(0),
  autoMiners: z.number().int().min(0),
})

export type GameState = z.infer<typeof gameStateSchema>

export const defaultGameState: GameState = {
  money: 0,
  clicks: 0,
  autoMiners: 0,
}

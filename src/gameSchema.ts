import { z } from 'zod'

export const gameStateSchema = z.object({
  money: z.number().finite().min(0),
  clicks: z.number().int().min(0),
  buildings: z.record(z.string(), z.number().int().min(0)),
})

export type GameState = z.infer<typeof gameStateSchema>

export const defaultGameState: GameState = {
  money: 0,
  clicks: 0,
  buildings: {
    miner: 0,
    drill: 0,
    excavator: 0,
  },
}

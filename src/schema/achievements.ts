import { z } from 'zod'
import type { ShopItemId } from './shop'

export type AchievementMetric =
  | { type: 'clicks'; target: number }
  | { type: 'owned'; itemId: ShopItemId; target: number }
  | { type: 'moneyPerSecond'; target: number }

export type AchievementConfig = {
  id: string
  title: string
  description: string
  metric: AchievementMetric
}

export const achievementConfigSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  metric: z.any(),
})

export const achievementConfigs: AchievementConfig[] = [
  {
    id: 'clicks_10',
    title: 'Getting Started',
    description: 'Click 10 times.',
    metric: { type: 'clicks', target: 10 },
  },
  {
    id: 'clicks_100',
    title: 'Click Apprentice',
    description: 'Click 100 times.',
    metric: { type: 'clicks', target: 100 },
  },
  {
    id: 'clicks_1000',
    title: 'Click Master',
    description: 'Click 1,000 times.',
    metric: { type: 'clicks', target: 1000 },
  },
  {
    id: 'clicks_10000',
    title: 'Relentless',
    description: 'Click 10,000 times.',
    metric: { type: 'clicks', target: 10000 },
  },

  {
    id: 'autoMiner_10',
    title: 'Auto Miner Crew',
    description: 'Own 10 Auto Miners.',
    metric: { type: 'owned', itemId: 'autoMiner', target: 10 },
  },
  {
    id: 'autoMiner_25',
    title: 'Auto Miner Workforce',
    description: 'Own 25 Auto Miners.',
    metric: { type: 'owned', itemId: 'autoMiner', target: 25 },
  },
  {
    id: 'autoMiner_100',
    title: 'Auto Miner Empire',
    description: 'Own 100 Auto Miners.',
    metric: { type: 'owned', itemId: 'autoMiner', target: 100 },
  },

  {
    id: 'drill_10',
    title: 'Drill Team',
    description: 'Own 10 Drill Rigs.',
    metric: { type: 'owned', itemId: 'drill', target: 10 },
  },
  {
    id: 'drill_25',
    title: 'Drill Division',
    description: 'Own 25 Drill Rigs.',
    metric: { type: 'owned', itemId: 'drill', target: 25 },
  },
  {
    id: 'drill_100',
    title: 'Drill Dynasty',
    description: 'Own 100 Drill Rigs.',
    metric: { type: 'owned', itemId: 'drill', target: 100 },
  },

  {
    id: 'excavator_10',
    title: 'Excavation Squad',
    description: 'Own 10 Excavators.',
    metric: { type: 'owned', itemId: 'excavator', target: 10 },
  },
  {
    id: 'excavator_25',
    title: 'Excavation Corps',
    description: 'Own 25 Excavators.',
    metric: { type: 'owned', itemId: 'excavator', target: 25 },
  },
  {
    id: 'excavator_100',
    title: 'Excavation Kingdom',
    description: 'Own 100 Excavators.',
    metric: { type: 'owned', itemId: 'excavator', target: 100 },
  },

  {
    id: 'factory_10',
    title: 'Factory Floor',
    description: 'Own 10 Factories.',
    metric: { type: 'owned', itemId: 'factory', target: 10 },
  },
  {
    id: 'factory_25',
    title: 'Factory Network',
    description: 'Own 25 Factories.',
    metric: { type: 'owned', itemId: 'factory', target: 25 },
  },
  {
    id: 'factory_100',
    title: 'Factory Megacity',
    description: 'Own 100 Factories.',
    metric: { type: 'owned', itemId: 'factory', target: 100 },
  },

  {
    id: 'aiForeman_10',
    title: 'AI Foremen Team',
    description: 'Own 10 AI Foremen.',
    metric: { type: 'owned', itemId: 'aiForeman', target: 10 },
  },
  {
    id: 'aiForeman_25',
    title: 'AI Foremen Bureau',
    description: 'Own 25 AI Foremen.',
    metric: { type: 'owned', itemId: 'aiForeman', target: 25 },
  },
  {
    id: 'aiForeman_100',
    title: 'AI Foremen Council',
    description: 'Own 100 AI Foremen.',
    metric: { type: 'owned', itemId: 'aiForeman', target: 100 },
  },

  {
    id: 'mps_10',
    title: 'Drip Income',
    description: 'Reach 10 money per second.',
    metric: { type: 'moneyPerSecond', target: 10 },
  },
  {
    id: 'mps_100',
    title: 'Steady Flow',
    description: 'Reach 100 money per second.',
    metric: { type: 'moneyPerSecond', target: 100 },
  },
  {
    id: 'mps_1000',
    title: 'Industrial Output',
    description: 'Reach 1,000 money per second.',
    metric: { type: 'moneyPerSecond', target: 1000 },
  },
  {
    id: 'mps_10000',
    title: 'Mass Production',
    description: 'Reach 10,000 money per second.',
    metric: { type: 'moneyPerSecond', target: 10000 },
  },
  {
    id: 'mps_100000',
    title: 'Megaproject',
    description: 'Reach 100,000 money per second.',
    metric: { type: 'moneyPerSecond', target: 100000 },
  },
  {
    id: 'mps_1000000',
    title: 'Planetary Scale',
    description: 'Reach 1,000,000 money per second.',
    metric: { type: 'moneyPerSecond', target: 1000000 },
  },
]

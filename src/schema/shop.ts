export type ShopItemId = 'autoMiner' | 'drill' | 'excavator' | 'factory' | 'aiForeman'

export type ShopItemConfig = {
  id: ShopItemId
  name: string
  baseCost: number
  costGrowth: number
  ratePerSecond: number
  unlockAtLifetimeEarned: number
}

export const shopItemConfigs: readonly ShopItemConfig[] = [
  {
    id: 'autoMiner',
    name: 'Auto Miner',
    baseCost: 10,
    costGrowth: 1.15,
    ratePerSecond: 1,
    unlockAtLifetimeEarned: 0,
  },
  {
    id: 'drill',
    name: 'Drill Rig',
    baseCost: 100,
    costGrowth: 1.17,
    ratePerSecond: 12,
    unlockAtLifetimeEarned: 60,
  },
  {
    id: 'excavator',
    name: 'Excavator',
    baseCost: 1200,
    costGrowth: 1.18,
    ratePerSecond: 160,
    unlockAtLifetimeEarned: 900,
  },
  {
    id: 'factory',
    name: 'Refinery',
    baseCost: 15000,
    costGrowth: 1.2,
    ratePerSecond: 2200,
    unlockAtLifetimeEarned: 12000,
  },
  {
    id: 'aiForeman',
    name: 'AI Foreman',
    baseCost: 250000,
    costGrowth: 1.22,
    ratePerSecond: 40000,
    unlockAtLifetimeEarned: 200000,
  },
] as const

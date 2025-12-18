import type { ShopItemConfig } from '../schema/shop'

/**
 * Calculates the cost of a shop item based on the number already owned.
 * Uses exponential growth formula: baseCost * costGrowth^owned
 * @param config - The shop item configuration
 * @param owned - The number of this item currently owned
 * @returns The cost to purchase the next item, rounded up
 */
export function getShopItemCost(config: ShopItemConfig, owned: number) {
  const normalizedOwned = Math.max(0, Math.floor(owned))
  return Math.ceil(config.baseCost * Math.pow(config.costGrowth, normalizedOwned))
}

/**
 * Calculates the total cost to purchase a specific quantity of items.
 * @param config - The shop item configuration
 * @param owned - The number of this item currently owned
 * @param quantity - The number of items to purchase
 * @returns The total cost for all items in the quantity
 */
export function getTotalCostForQuantity(config: ShopItemConfig, owned: number, quantity: number) {
  const q = Math.max(0, Math.floor(quantity))
  if (q <= 0) return 0

  let total = 0
  for (let i = 0; i < q; i += 1) {
    total += getShopItemCost(config, owned + i)
  }
  return total
}

/**
 * Determines the maximum quantity of items that can be purchased with available money.
 * @param config - The shop item configuration
 * @param owned - The number of this item currently owned
 * @param money - The amount of money available to spend
 * @returns The maximum number of items that can be afforded
 */
export function getMaxAffordableQuantity(config: ShopItemConfig, owned: number, money: number) {
  const normalizedOwned = Math.max(0, Math.floor(owned))
  let remaining = Math.max(0, money)
  let qty = 0

  // Safety guard against infinite loops.
  for (let i = 0; i < 100000; i += 1) {
    const nextCost = getShopItemCost(config, normalizedOwned + qty)
    if (nextCost <= 0) return qty
    if (remaining < nextCost) return qty
    remaining -= nextCost
    qty += 1
  }

  return qty
}

export type NumberNotation = 'compact' | 'standard' | 'exponential'

export function formatNumber(n: number, notation: NumberNotation = 'compact') {
  if (notation === 'exponential') {
    if (!Number.isFinite(n)) return String(n)
    return n.toExponential(2)
  }

  return new Intl.NumberFormat(undefined, {
    notation,
    maximumFractionDigits: 2,
  }).format(n)
}

import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { formatNumber, type NumberNotation } from './formatNumber'
import type { ShopItemView } from '../schema/shopView'

export type ShopProps = {
  money: number
  items: readonly ShopItemView[]
  numberNotation: NumberNotation
  onBuy: (id: string) => void
}

export default function Shop(props: ShopProps) {
  const { money, items, numberNotation, onBuy } = props

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
            Shop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Spend money to increase your passive income.
          </Typography>
        </Box>

        {items.map((item) => {
          const missing = Math.max(0, item.cost - money)
          const affordabilityProgress = item.cost <= 0 ? 0 : Math.min(100, (money / item.cost) * 100)

          const unlockProgress =
            item.unlockAtLifetimeEarned <= 0
              ? 100
              : Math.min(100, (money / item.unlockAtLifetimeEarned) * 100)

          return (
            <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +{formatNumber(item.ratePerSecond, numberNotation)}/s
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Owned: {formatNumber(item.owned, numberNotation)}
                  </Typography>
                </Stack>

                {item.unlocked ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Cost: {formatNumber(item.cost, numberNotation)}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                      <Typography variant="caption" color="text.secondary">
                        Next {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {formatNumber(missing, numberNotation)} to go
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={affordabilityProgress}
                      sx={{ height: 10, borderRadius: 999 }}
                    />

                    <Button
                      variant="outlined"
                      onClick={() => onBuy(item.id)}
                      disabled={!item.canBuy}
                      sx={{ fontWeight: 800, textTransform: 'none' }}
                    >
                      {item.canBuy ? 'Buy' : 'Not enough money'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Locked. Earn {formatNumber(item.unlockAtLifetimeEarned, numberNotation)} total money to unlock.
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={unlockProgress}
                      sx={{ height: 10, borderRadius: 999 }}
                    />
                    <Button variant="outlined" disabled sx={{ fontWeight: 800, textTransform: 'none' }}>
                      Locked
                    </Button>
                  </>
                )}
              </Stack>
            </Paper>
          )
        })}
      </Stack>
    </Paper>
  )
}

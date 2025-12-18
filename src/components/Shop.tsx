import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { formatNumber } from './formatNumber'

export type ShopProps = {
  minerRatePerSecond: number
  minerCost: number
  canBuyMiner: boolean
  onBuyAutoMiner: () => void
}

export default function Shop(props: ShopProps) {
  const { minerRatePerSecond, minerCost, canBuyMiner, onBuyAutoMiner } = props

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

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Auto Miner
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +{formatNumber(minerRatePerSecond)}/s
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Cost: {formatNumber(minerCost)}
            </Typography>
            <Button
              variant="outlined"
              onClick={onBuyAutoMiner}
              disabled={!canBuyMiner}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              {canBuyMiner ? 'Buy' : 'Not enough money'}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  )
}

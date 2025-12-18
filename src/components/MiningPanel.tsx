import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { formatNumber } from './formatNumber'

export type MiningPanelProps = {
  money: number
  minedPerClick: number
  minerCost: number
  onMine: () => void
}

export default function MiningPanel(props: MiningPanelProps) {
  const { money, minedPerClick, minerCost, onMine } = props

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: (t) => (t.palette.mode === 'light' ? '#ffffff' : 'background.paper'),
      }}
    >
      <Stack spacing={1.5}>
        <Button
          size="large"
          variant="contained"
          onClick={onMine}
          sx={{ py: 1.6, fontWeight: 800, textTransform: 'none' }}
        >
          Mine (+{minedPerClick})
        </Button>

        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary">
              Next Auto Miner
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {formatNumber(Math.max(0, minerCost - money))} to go
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (money / minerCost) * 100)}
            sx={{ mt: 1, height: 10, borderRadius: 999 }}
          />
        </Box>
      </Stack>
    </Paper>
  )
}

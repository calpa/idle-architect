import { AppBar, Box, Button, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import { formatNumber } from './formatNumber'

export type HeaderBarProps = {
  title: string
  money: number
  moneyPerSecond: number
  onReset: () => void
}

export default function HeaderBar(props: HeaderBarProps) {
  const { title, money, moneyPerSecond, onReset } = props

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.3 }}>
          {title}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Money
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {formatNumber(money)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              / sec
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {formatNumber(moneyPerSecond)}
            </Typography>
          </Box>
        </Stack>
        <Tooltip title="Reset progress">
          <Button color="inherit" onClick={onReset}>
            Reset
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

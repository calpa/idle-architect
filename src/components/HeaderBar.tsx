import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import { formatNumber, type NumberNotation } from './formatNumber'

export type HeaderBarProps = {
  title: string
  money: number
  moneyPerSecond: number
  numberNotation: NumberNotation
}

export default function HeaderBar(props: HeaderBarProps) {
  const { title, money, moneyPerSecond, numberNotation } = props

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
              {formatNumber(money, numberNotation)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              / sec
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {formatNumber(moneyPerSecond, numberNotation)}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

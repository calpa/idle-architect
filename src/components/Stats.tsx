import { Grid, Paper, Typography } from '@mui/material'
import { formatNumber } from './formatNumber'

export type StatsProps = {
  clicks: number
  autoMiners: number
  minerRatePerSecond: number
  moneyPerSecond: number
}

export default function Stats(props: StatsProps) {
  const { clicks, autoMiners, minerRatePerSecond, moneyPerSecond } = props

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Clicks
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(clicks)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Auto Miners
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(autoMiners)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Miner Rate
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(minerRatePerSecond)}/s
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Total /s
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(moneyPerSecond)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

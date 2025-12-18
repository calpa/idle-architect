import { Grid, Paper, Typography } from '@mui/material'
import { formatNumber, type NumberNotation } from './formatNumber'

export type StatsProps = {
  clicks: number
  totalUnits: number
  money: number
  moneyPerSecond: number
  numberNotation: NumberNotation
}

export default function Stats(props: StatsProps) {
  const { clicks, totalUnits, money, moneyPerSecond, numberNotation } = props

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Clicks
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(clicks, numberNotation)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Units
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(totalUnits, numberNotation)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Total /s
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(moneyPerSecond, numberNotation)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="overline" color="text.secondary">
            Money
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {formatNumber(money, numberNotation)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

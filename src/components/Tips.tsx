import { Paper, Stack, Typography } from '@mui/material'

export default function Tips() {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Tips
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your income continues automatically as long as the tab is open.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Early on, clicking is best. Later, automation dominates.
        </Typography>
      </Stack>
    </Paper>
  )
}

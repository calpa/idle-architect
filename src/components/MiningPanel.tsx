import { Button, Paper, Stack } from '@mui/material'

export type MiningPanelProps = {
  minedPerClick: number
  onMine: () => void
}

export default function MiningPanel(props: MiningPanelProps) {
  const { minedPerClick, onMine } = props

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
      </Stack>
    </Paper>
  )
}

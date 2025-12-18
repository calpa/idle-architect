import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material'

export type SettingsPanelProps = {
  open: boolean
  tickIntervalMs: number
  numberNotation: 'compact' | 'standard'
  onClose: () => void
  onChangeTickIntervalMs: (ms: number) => void
  onChangeNumberNotation: (notation: 'compact' | 'standard') => void
  onResetSettings: () => void
}

export default function SettingsPanel(props: SettingsPanelProps) {
  const {
    open,
    tickIntervalMs,
    numberNotation,
    onClose,
    onChangeTickIntervalMs,
    onChangeNumberNotation,
    onResetSettings,
  } = props

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 2.5 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.3 }}>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tune the gameplay and UI.
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Tick interval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              How often the game updates passive income.
            </Typography>
            <Slider
              value={tickIntervalMs}
              min={50}
              max={1000}
              step={50}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v} ms`}
              onChange={(_e, v) => {
                const next = Array.isArray(v) ? v[0] : v
                onChangeTickIntervalMs(next)
              }}
            />
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="number-notation-label">Number format</InputLabel>
            <Select
              labelId="number-notation-label"
              label="Number format"
              value={numberNotation}
              onChange={(e) => onChangeNumberNotation(e.target.value as 'compact' | 'standard')}
            >
              <MenuItem value="compact">Compact (1.2K)</MenuItem>
              <MenuItem value="standard">Standard (1,234)</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={onResetSettings}>
              Reset settings
            </Button>
            <Button variant="contained" onClick={onClose}>
              Done
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}

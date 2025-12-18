import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Stack,
  Typography,
} from '@mui/material'
import type { NumberNotation } from './formatNumber'

export type SettingsTabProps = {
  numberNotation: NumberNotation
  onChangeNumberNotation: (notation: NumberNotation) => void
  autosaveEnabled: boolean
  autosaveIntervalMinutes: '1' | '10'
  onChangeAutosaveEnabled: (enabled: boolean) => void
  onChangeAutosaveIntervalMinutes: (minutes: '1' | '10') => void
  onManualSave: () => void
  lastSavedAtMs: number | null
  secondsToNextAutosave: number | null
  onResetGame: () => void
}

export default function SettingsTab(props: SettingsTabProps) {
  const {
    numberNotation,
    onChangeNumberNotation,
    autosaveEnabled,
    autosaveIntervalMinutes,
    onChangeAutosaveEnabled,
    onChangeAutosaveIntervalMinutes,
    onManualSave,
    lastSavedAtMs,
    secondsToNextAutosave,
    onResetGame,
  } = props

  const lastSavedLabel =
    lastSavedAtMs == null ? 'Never' : new Date(lastSavedAtMs).toLocaleTimeString()

  const countdownLabel =
    secondsToNextAutosave == null
      ? 'Off'
      : `${Math.floor(secondsToNextAutosave / 60)}:${String(secondsToNextAutosave % 60).padStart(2, '0')}`

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure display preferences and manage your save.
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="number-notation-label">Number format</InputLabel>
          <Select
            labelId="number-notation-label"
            label="Number format"
            value={numberNotation}
            onChange={(e) => onChangeNumberNotation(e.target.value as NumberNotation)}
          >
            <MenuItem value="compact">Compact (1.2K)</MenuItem>
            <MenuItem value="standard">Standard (1,234)</MenuItem>
            <MenuItem value="exponential">Exponential (1.23e+4)</MenuItem>
          </Select>
        </FormControl>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Auto-save
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saves to localStorage automatically.
                </Typography>
              </Box>
              <Switch checked={autosaveEnabled} onChange={(e) => onChangeAutosaveEnabled(e.target.checked)} />
            </Stack>

            <FormControl fullWidth disabled={!autosaveEnabled}>
              <InputLabel id="autosave-interval-label">Auto-save period</InputLabel>
              <Select
                labelId="autosave-interval-label"
                label="Auto-save period"
                value={autosaveIntervalMinutes}
                onChange={(e) => onChangeAutosaveIntervalMinutes(e.target.value as '1' | '10')}
              >
                <MenuItem value="1">Every 1 minute</MenuItem>
                <MenuItem value="10">Every 10 minutes</MenuItem>
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Next save in
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {countdownLabel}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last saved
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {lastSavedLabel}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onManualSave} sx={{ fontWeight: 800, textTransform: 'none' }}>
                Save now
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Danger zone
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resetting will wipe your current money, clicks, and auto miners.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.25, justifyContent: 'flex-end' }}>
            <Button variant="contained" color="error" onClick={onResetGame}>
              Reset game
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}

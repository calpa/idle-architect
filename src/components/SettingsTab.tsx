import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { NumberNotation } from './formatNumber'

export type SettingsTabProps = {
  numberNotation: NumberNotation
  onChangeNumberNotation: (notation: NumberNotation) => void
  onResetGame: () => void
}

export default function SettingsTab(props: SettingsTabProps) {
  const { numberNotation, onChangeNumberNotation, onResetGame } = props

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

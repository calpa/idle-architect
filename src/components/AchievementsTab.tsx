import { Box, Chip, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import type { AchievementView } from '../achievementsStore'
import { formatNumber, type NumberNotation } from './formatNumber'

export type AchievementsTabProps = {
  achievements: AchievementView[]
  numberNotation: NumberNotation
}

export default function AchievementsTab(props: AchievementsTabProps) {
  const { achievements, numberNotation } = props

  const unlockedCount = achievements.filter((a) => a.unlockedAtMs != null).length

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
            Achievements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unlockedCount} / {achievements.length} unlocked
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={1.5}>
          {achievements.map((a) => {
            const unlocked = a.unlockedAtMs != null
            return (
              <Paper key={a.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                        {a.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.description}
                      </Typography>
                    </Box>
                    {unlocked ? (
                      <Chip
                        color="success"
                        label="Unlocked"
                        size="small"
                        sx={{ fontWeight: 900, textTransform: 'none' }}
                      />
                    ) : (
                      <Chip
                        color="default"
                        label="Locked"
                        size="small"
                        sx={{ fontWeight: 900, textTransform: 'none' }}
                      />
                    )}
                  </Stack>

                  <LinearProgress variant="determinate" value={a.progress * 100} />

                  <Typography variant="caption" color="text.secondary">
                    {formatNumber(a.current, numberNotation)} / {formatNumber(a.target, numberNotation)}
                  </Typography>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
    </Paper>
  )
}

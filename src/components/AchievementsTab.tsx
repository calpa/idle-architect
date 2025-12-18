import { alpha } from '@mui/material/styles'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import type { AchievementView } from '../achievementsStore'
import { formatNumber, type NumberNotation } from './formatNumber'

export type AchievementsTabProps = {
  achievements: AchievementView[]
  numberNotation: NumberNotation
}

export default function AchievementsTab(props: AchievementsTabProps) {
  const { achievements, numberNotation } = props

  const unlockedCount = achievements.filter((a) => a.unlockedAtMs != null).length

  function getCategory(a: AchievementView) {
    if (a.id.startsWith('clicks_')) return 'Clicks'
    if (a.id.startsWith('mps_')) return 'Production'
    if (a.id.startsWith('autoMiner_')) return 'Auto Miner'
    if (a.id.startsWith('drill_')) return 'Drill Rig'
    if (a.id.startsWith('excavator_')) return 'Excavator'
    if (a.id.startsWith('factory_')) return 'Refinery'
    if (a.id.startsWith('aiForeman_')) return 'AI Foreman'
    return 'Other'
  }

  const categoryOrder = [
    'Clicks',
    'Production',
    'Auto Miner',
    'Drill Rig',
    'Excavator',
    'Refinery',
    'AI Foreman',
    'Other',
  ] as const

  const grouped = categoryOrder
    .map((category) => {
      const items = achievements
        .filter((a) => getCategory(a) === category)
        .sort((a, b) => {
          const au = a.unlockedAtMs != null
          const bu = b.unlockedAtMs != null
          if (au !== bu) return au ? -1 : 1
          return a.target - b.target
        })
      return { category, items }
    })
    .filter((g) => g.items.length > 0)

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

        <Stack spacing={2.5}>
          {grouped.map((group) => (
            <Box key={group.category}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 950 }}>
                  {group.category}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                  {group.items.filter((a) => a.unlockedAtMs != null).length} / {group.items.length}
                </Typography>
              </Stack>

              <Grid container spacing={1.5} sx={{ mt: 1.25 }}>
                {group.items.map((a) => {
                  const unlocked = a.unlockedAtMs != null
                  return (
                    <Grid key={a.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <Paper
                        variant="outlined"
                        sx={(theme) => ({
                          position: 'relative',
                          p: 1.75,
                          borderRadius: 0,
                          borderWidth: 1,
                          borderColor: unlocked
                            ? alpha(theme.palette.success.main, 0.5)
                            : alpha(theme.palette.divider, 0.9),
                          backgroundColor: unlocked
                            ? alpha(theme.palette.success.main, 0.1)
                            : theme.palette.background.paper,
                        })}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <Chip
                              color={unlocked ? 'success' : 'default'}
                              label={unlocked ? 'Unlocked' : 'Locked'}
                              size="small"
                              sx={{ fontWeight: 900, textTransform: 'none', borderRadius: 0 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                              {formatNumber(a.current, numberNotation)} / {formatNumber(a.target, numberNotation)}
                            </Typography>
                          </Stack>

                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 950, lineHeight: 1.15 }}>
                              {a.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                              {a.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

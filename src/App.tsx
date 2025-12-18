import { useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Box, Container, Divider, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import {
  advanceAtom,
  buyShopItemAtom,
  derivedAtom,
  mineAtom,
  resetAtom,
  saveGameAtom,
} from './gameStore'
import { gameStateAtom } from './gameStateStore'

import HeaderBar from './components/HeaderBar'
import MiningPanel from './components/MiningPanel'
import Shop from './components/Shop'
import Stats from './components/Stats'
import SettingsTab from './components/SettingsTab'
import Tips from './components/Tips'
import Notifications from './components/Notifications'
import AchievementsTab from './components/AchievementsTab'
import { settingsAtom, updateSettingsAtom } from './settingsStore'
import { achievementViewsAtom } from './achievementsStore'

function App() {
  const state = useAtomValue(gameStateAtom)
  const derived = useAtomValue(derivedAtom)
  const settings = useAtomValue(settingsAtom)
  const achievementViews = useAtomValue(achievementViewsAtom)
  const mine = useSetAtom(mineAtom)
  const buyShopItem = useSetAtom(buyShopItemAtom)
  const reset = useSetAtom(resetAtom)
  const advance = useSetAtom(advanceAtom)
  const updateSettings = useSetAtom(updateSettingsAtom)
  const saveGame = useSetAtom(saveGameAtom)

  const [tab, setTab] = useState<'game' | 'achievements' | 'settings'>('game')

  const autosaveIntervalSeconds = useMemo(() => {
    const minutes = settings.autosaveIntervalMinutes === '10' ? 10 : 1
    return minutes * 60
  }, [settings.autosaveIntervalMinutes])

  const [lastSavedAtMs, setLastSavedAtMs] = useState<number | null>(null)
  const [secondsToNextAutosave, setSecondsToNextAutosave] = useState<number | null>(
    settings.autosaveEnabled ? autosaveIntervalSeconds : null,
  )

  const lastTickAtRef = useRef<number | null>(null)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = performance.now()
      const last = lastTickAtRef.current
      lastTickAtRef.current = now
      if (last == null) return
      const dtSeconds = (now - last) / 1000
      advance(dtSeconds)
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [advance])

  useEffect(() => {
    if (!settings.autosaveEnabled) {
      setSecondsToNextAutosave(null)
      return
    }
    setSecondsToNextAutosave(autosaveIntervalSeconds)
  }, [autosaveIntervalSeconds, settings.autosaveEnabled])

  useEffect(() => {
    if (!settings.autosaveEnabled) return

    const timerId = window.setInterval(() => {
      setSecondsToNextAutosave((prev) => {
        if (prev == null) return prev
        if (prev <= 1) {
          saveGame('auto')
          setLastSavedAtMs(Date.now())
          return autosaveIntervalSeconds
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [autosaveIntervalSeconds, saveGame, settings.autosaveEnabled])

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HeaderBar
        title="Idle Architect"
        money={state.money}
        moneyPerSecond={derived.moneyPerSecond}
        numberNotation={settings.numberNotation}
      />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
          <Tab label="Game" value="game" />
          <Tab label="Achievements" value="achievements" />
          <Tab label="Settings" value="settings" />
        </Tabs>

        <Box sx={{ mt: 2.5 }}>
          {tab === 'game' ? (
            <Stack spacing={2.5}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
                          Mining
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tap to mine, then buy upgrades below.
                        </Typography>
                      </Box>

                      <MiningPanel minedPerClick={derived.minedPerClick} onMine={mine} />

                      <Divider />

                      <Stats
                        clicks={state.clicks}
                        totalUnits={
                          state.autoMiners +
                          state.drills +
                          state.excavators +
                          state.factories +
                          state.aiForemen
                        }
                        money={state.money}
                        moneyPerSecond={derived.moneyPerSecond}
                        numberNotation={settings.numberNotation}
                      />
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Tips />
                </Grid>
              </Grid>

              <Shop
                money={state.money}
                items={derived.shopItems}
                numberNotation={settings.numberNotation}
                onBuy={(id, quantity) => {
                  buyShopItem({ id: id as any, quantity })
                }}
              />
            </Stack>
          ) : tab === 'achievements' ? (
            <AchievementsTab achievements={achievementViews} numberNotation={settings.numberNotation} />
          ) : (
            <SettingsTab
              numberNotation={settings.numberNotation}
              onChangeNumberNotation={(notation) => updateSettings({ numberNotation: notation })}
              autosaveEnabled={settings.autosaveEnabled}
              autosaveIntervalMinutes={settings.autosaveIntervalMinutes}
              onChangeAutosaveEnabled={(enabled) => updateSettings({ autosaveEnabled: enabled })}
              onChangeAutosaveIntervalMinutes={(minutes) =>
                updateSettings({ autosaveIntervalMinutes: minutes })
              }
              onManualSave={() => {
                saveGame('manual')
                setLastSavedAtMs(Date.now())
              }}
              lastSavedAtMs={lastSavedAtMs}
              secondsToNextAutosave={secondsToNextAutosave}
              onResetGame={reset}
            />
          )}
        </Box>
      </Container>

      <Notifications />
    </Box>
  )
}

export default App

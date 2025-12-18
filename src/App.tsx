import { useEffect, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Box, Container, Divider, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import {
  advanceAtom,
  buyAutoMinerAtom,
  buyAiForemanAtom,
  buyDrillAtom,
  buyExcavatorAtom,
  buyFactoryAtom,
  derivedAtom,
  gameStateAtom,
  mineAtom,
  resetAtom,
} from './gameStore'

import HeaderBar from './components/HeaderBar'
import MiningPanel from './components/MiningPanel'
import Shop from './components/Shop'
import Stats from './components/Stats'
import SettingsTab from './components/SettingsTab'
import Tips from './components/Tips'
import { settingsAtom, updateSettingsAtom } from './settingsStore'

function App() {
  const state = useAtomValue(gameStateAtom)
  const derived = useAtomValue(derivedAtom)
  const settings = useAtomValue(settingsAtom)
  const mine = useSetAtom(mineAtom)
  const buyAutoMiner = useSetAtom(buyAutoMinerAtom)
  const buyDrill = useSetAtom(buyDrillAtom)
  const buyExcavator = useSetAtom(buyExcavatorAtom)
  const buyFactory = useSetAtom(buyFactoryAtom)
  const buyAiForeman = useSetAtom(buyAiForemanAtom)
  const reset = useSetAtom(resetAtom)
  const advance = useSetAtom(advanceAtom)
  const updateSettings = useSetAtom(updateSettingsAtom)

  const [tab, setTab] = useState<'game' | 'settings'>('game')

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
                onBuy={(id) => {
                  switch (id) {
                    case 'autoMiner':
                      buyAutoMiner()
                      return
                    case 'drill':
                      buyDrill()
                      return
                    case 'excavator':
                      buyExcavator()
                      return
                    case 'factory':
                      buyFactory()
                      return
                    case 'aiForeman':
                      buyAiForeman()
                      return
                  }
                }}
              />
            </Stack>
          ) : (
            <SettingsTab
              numberNotation={settings.numberNotation}
              onChangeNumberNotation={(notation) => updateSettings({ numberNotation: notation })}
              onResetGame={reset}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default App

import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Box, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import {
  advanceAtom,
  buyAutoMinerAtom,
  derivedAtom,
  gameStateAtom,
  mineAtom,
  resetAtom,
} from './gameStore'

import HeaderBar from './components/HeaderBar'
import MiningPanel from './components/MiningPanel'
import Shop from './components/Shop'
import Stats from './components/Stats'
import Tips from './components/Tips'

function App() {
  const state = useAtomValue(gameStateAtom)
  const derived = useAtomValue(derivedAtom)
  const mine = useSetAtom(mineAtom)
  const buyAutoMiner = useSetAtom(buyAutoMinerAtom)
  const reset = useSetAtom(resetAtom)
  const advance = useSetAtom(advanceAtom)

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
        onReset={reset}
      />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
                    Mining
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tap to mine, then reinvest into automation.
                  </Typography>
                </Box>

                <MiningPanel
                  money={state.money}
                  minedPerClick={derived.minedPerClick}
                  minerCost={derived.minerCost}
                  onMine={mine}
                />

                <Divider />

                <Stats
                  clicks={state.clicks}
                  autoMiners={state.autoMiners}
                  minerRatePerSecond={derived.minerRatePerSecond}
                  moneyPerSecond={derived.moneyPerSecond}
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Shop
                minerRatePerSecond={derived.minerRatePerSecond}
                minerCost={derived.minerCost}
                canBuyMiner={derived.canBuyMiner}
                onBuyAutoMiner={buyAutoMiner}
              />

              <Tips />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default App

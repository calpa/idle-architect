import { useEffect, useMemo, useRef, useState } from 'react'

export type MiningGameState = {
  money: number
  clicks: number
  autoMiners: number
}

export function useMiningGame() {
  const [state, setState] = useState<MiningGameState>({
    money: 0,
    clicks: 0,
    autoMiners: 0,
  })

  const lastTickAtRef = useRef<number | null>(null)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = performance.now()
      const last = lastTickAtRef.current
      lastTickAtRef.current = now

      if (last == null) return

      const dtSeconds = (now - last) / 1000
      if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return

      setState((prev) => {
        if (prev.autoMiners <= 0) return prev
        const gained = prev.autoMiners * dtSeconds
        return {
          ...prev,
          money: prev.money + gained,
        }
      })
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const minedPerClick = 1
  const minerCost = 10
  const minerRatePerSecond = 1

  const derived = useMemo(() => {
    return {
      minedPerClick,
      minerCost,
      minerRatePerSecond,
      canBuyMiner: state.money >= minerCost,
      moneyPerSecond: state.autoMiners * minerRatePerSecond,
    }
  }, [state.autoMiners, state.money])

  const mine = () => {
    setState((prev) => ({
      ...prev,
      money: prev.money + minedPerClick,
      clicks: prev.clicks + 1,
    }))
  }

  const buyAutoMiner = () => {
    setState((prev) => {
      if (prev.money < minerCost) return prev
      return {
        ...prev,
        money: prev.money - minerCost,
        autoMiners: prev.autoMiners + 1,
      }
    })
  }

  const reset = () => {
    setState({ money: 0, clicks: 0, autoMiners: 0 })
    lastTickAtRef.current = null
  }

  return {
    state,
    derived,
    actions: {
      mine,
      buyAutoMiner,
      reset,
    },
  }
}

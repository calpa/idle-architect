import './App.css'
import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  advanceAtom,
  buyBuildingAtom,
  derivedAtom,
  gameStateAtom,
  mineAtom,
  resetAtom,
} from './gameStore'

function App() {
  const state = useAtomValue(gameStateAtom)
  const derived = useAtomValue(derivedAtom)
  const mine = useSetAtom(mineAtom)
  const buyBuilding = useSetAtom(buyBuildingAtom)
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
    <div className="game">
      <header className="gameHeader">
        <h1>Mining Game</h1>
        <div className="subTitle">Click to earn. Buy buildings to automate production.</div>
      </header>

      <section className="panel">
        <div className="stats">
          <div className="stat">
            <div className="statLabel">Money</div>
            <div className="statValue">{state.money.toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Clicks</div>
            <div className="statValue">{state.clicks}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Production</div>
            <div className="statValue">{derived.moneyPerSecond.toFixed(2)}/s</div>
          </div>
          <div className="stat">
            <div className="statLabel">Buildings</div>
            <div className="statValue">{derived.buildings.reduce((sum, b) => sum + b.owned, 0)}</div>
          </div>
        </div>

        <div className="actions">
          <button className="primary" onClick={mine}>
            Mine (+{derived.minedPerClick})
          </button>
        </div>

        <div className="shop">
          <div className="shopTitle">Shop</div>
          <div className="shopList">
            {derived.buildings.map((b) => (
              <div key={b.id} className="shopItem">
                <div className="shopItemMain">
                  <div className="shopItemName">{b.name}</div>
                  <div className="shopItemMeta">
                    Owned: {b.owned} | +{b.baseRatePerSecond}/s each
                  </div>
                </div>

                <button
                  onClick={() => buyBuilding(b.id)}
                  disabled={!b.canBuy}
                  title={b.canBuy ? '' : `Need ${b.cost.toFixed(2)} money`}
                >
                  Buy ({b.cost.toFixed(2)})
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="footerRow">
          <button className="ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </section>
    </div>
  )
}

export default App

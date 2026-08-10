import React, { useMemo } from 'react'
import { buildSnakeOrder } from '../utils/draftOrder.js'

export default function SnakeStrip({ leagueSettings, picksMade }) {
  const { teams, rounds, myPickSlot } = leagueSettings
  const order = useMemo(() => buildSnakeOrder(teams, Math.min(rounds, 6)), [teams, rounds])

  const rows = useMemo(() => {
    const byRound = {}
    for (const pick of order) {
      if (!byRound[pick.round]) byRound[pick.round] = []
      byRound[pick.round].push(pick)
    }
    return Object.values(byRound)
  }, [order])

  const nextOverall = picksMade + 1

  return (
    <div className="snake-strip">
      <div className="snake-strip-title">
        Pick order (snake, first {Math.min(rounds, 6)} rounds shown) — you're slot {myPickSlot} of {teams}
      </div>
      <div className="snake-rows">
        {rows.map((row, i) => (
          <div key={i} className={`snake-row ${i % 2 === 1 ? 'reverse' : ''}`}>
            {row.map((pick) => {
              const mine = pick.teamSlot === myPickSlot
              const taken = pick.overall < nextOverall
              const onClock = pick.overall === nextOverall
              return (
                <div
                  key={pick.overall}
                  className={`snake-pick ${mine ? 'mine' : ''} ${taken ? 'taken' : ''} ${onClock ? 'on-clock' : ''}`}
                  title={`Pick ${pick.overall} — Team ${pick.teamSlot}${mine ? ' (you)' : ''}`}
                >
                  {pick.overall}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

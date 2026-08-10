import React, { useMemo, useState } from 'react'
import { useDraftState } from '../state/store.jsx'
import { buildSnakeOrder, isMyPick } from '../utils/draftOrder.js'
import { pickForOpponent } from '../utils/mockDraft.js'
import PositionChip from './PositionChip.jsx'

export default function MockDraftModal({ onClose }) {
  const state = useDraftState()
  const { teams, rounds, myPickSlot } = state.leagueSettings

  const order = useMemo(() => buildSnakeOrder(teams, rounds), [teams, rounds])
  const [available, setAvailable] = useState(() => state.players.map((p) => ({ ...p })))
  const [log, setLog] = useState([]) // { overall, round, teamSlot, player }
  const [index, setIndex] = useState(0)
  const [autoPlayMe, setAutoPlayMe] = useState(false)

  const currentPick = order[index]
  const myTeam = log.filter((l) => l.teamSlot === myPickSlot)
  const finished = index >= order.length

  function draftPlayer(player) {
    setAvailable((prev) => prev.filter((p) => p.id !== player.id))
    setLog((prev) => [...prev, { overall: currentPick.overall, round: currentPick.round, teamSlot: currentPick.teamSlot, player }])
    setIndex((i) => i + 1)
  }

  function step() {
    if (!currentPick || available.length === 0) return
    if (isMyPick(currentPick, myPickSlot) && !autoPlayMe) return // wait for manual pick
    const best = isMyPick(currentPick, myPickSlot)
      ? [...available].sort((a, b) => (a.personalRank ?? 9999) - (b.personalRank ?? 9999))[0]
      : pickForOpponent(available, currentPick.round)
    if (best) draftPlayer(best)
  }

  function simulateToMyPick() {
    let i = index
    let pool = [...available]
    const newLog = [...log]
    while (i < order.length) {
      const pick = order[i]
      if (isMyPick(pick, myPickSlot)) break
      const chosen = pickForOpponent(pool, pick.round)
      if (!chosen) break
      pool = pool.filter((p) => p.id !== chosen.id)
      newLog.push({ overall: pick.overall, round: pick.round, teamSlot: pick.teamSlot, player: chosen })
      i++
    }
    setAvailable(pool)
    setLog(newLog)
    setIndex(i)
  }

  function reset() {
    setAvailable(state.players.map((p) => ({ ...p })))
    setLog([])
    setIndex(0)
  }

  const topAvailable = [...available].sort((a, b) => (a.personalRank ?? 9999) - (b.personalRank ?? 9999)).slice(0, 25)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="panel-title">Mock Draft</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="helptext">
            Simulates opponents picking by ADP with realistic reaches/falls, so you can test your rankings and tiers before
            the real thing. This runs on a separate copy of your rankings — it won't touch your live draft board.
          </p>

          {finished ? (
            <div className="empty-state">
              <div className="empty-state-title">Mock draft complete</div>
              <p className="helptext">{myTeam.length} players landed on your mock roster.</p>
            </div>
          ) : (
            <>
              <div className="best-available-banner" style={{ margin: 0 }}>
                <div className="ba-item">
                  <span className="ba-label">On the clock</span>
                  <span className="ba-name">
                    Pick {currentPick.overall} · Round {currentPick.round} · Team {currentPick.teamSlot}
                    {isMyPick(currentPick, myPickSlot) ? ' (you)' : ''}
                  </span>
                </div>
              </div>

              {isMyPick(currentPick, myPickSlot) ? (
                <>
                  <div className="field-row">
                    <label>Your pick — choose from top available by your rank</label>
                  </div>
                  <div className="table-wrap" style={{ maxHeight: 240, overflowY: 'auto' }}>
                    <table className="data-table">
                      <tbody>
                        {topAvailable.map((p) => (
                          <tr key={p.id}>
                            <td className="num">{p.personalRank ?? '—'}</td>
                            <td className="row-name">{p.name || 'Unnamed'}</td>
                            <td>
                              <PositionChip position={p.position} />
                            </td>
                            <td>
                              <button className="btn btn-primary btn-sm" onClick={() => draftPlayer(p)}>
                                Draft
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <button className="btn" onClick={step}>
                  Simulate this pick
                </button>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" onClick={simulateToMyPick}>
                  Simulate to my next pick
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  Reset mock
                </button>
              </div>
            </>
          )}

          {myTeam.length > 0 && (
            <>
              <div className="divider" />
              <div className="field-row">
                <label>Your mock roster</label>
              </div>
              {myTeam.map((l) => (
                <div className="roster-slot" key={l.overall}>
                  <span>
                    <strong>{l.player.name}</strong> <span className="helptext">R{l.round} · #{l.overall}</span>
                  </span>
                  <PositionChip position={l.player.position} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

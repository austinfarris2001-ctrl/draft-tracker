import React, { useMemo } from 'react'
import { useDraftState } from '../state/store.jsx'
import { POSITIONS, ROSTER_TEMPLATE } from '../data/positions.js'
import PositionChip from './PositionChip.jsx'

export default function MyTeam() {
  const state = useDraftState()

  const myPlayers = useMemo(
    () => state.players.filter((p) => p.status === 'drafted_mine').sort((a, b) => (a.overallPick ?? 0) - (b.overallPick ?? 0)),
    [state.players],
  )

  const counts = useMemo(() => {
    const c = {}
    for (const pos of POSITIONS) c[pos] = 0
    for (const p of myPlayers) c[p.position] = (c[p.position] || 0) + 1
    return c
  }, [myPlayers])

  const byeGroups = useMemo(() => {
    const groups = {}
    for (const p of myPlayers) {
      if (!p.bye) continue
      groups[p.bye] = groups[p.bye] || []
      groups[p.bye].push(p)
    }
    return Object.entries(groups).filter(([, players]) => players.length > 1)
  }, [myPlayers])

  const starterTargets = { QB: 1, RB: 2, WR: 2, TE: 1, K: 1, DST: 1 }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">My Team</span>
        <span className="helptext">{myPlayers.length} drafted</span>
      </div>
      <div className="panel-body">
        <div className="roster-summary">
          {POSITIONS.map((pos) => {
            const target = starterTargets[pos] || 1
            const needs = counts[pos] < target
            return (
              <div key={pos} className={`roster-count ${needs ? 'needs' : ''}`}>
                <span className="num">{counts[pos]}</span>
                <span className="lbl">{pos}</span>
              </div>
            )
          })}
        </div>

        {byeGroups.length > 0 && (
          <>
            <div className="helptext" style={{ marginBottom: 6, color: 'var(--danger)' }}>
              Bye week overlap
            </div>
            {byeGroups.map(([bye, players]) => (
              <div key={bye} className="roster-slot">
                <span>Week {bye}</span>
                <span className="helptext">{players.map((p) => p.name).join(', ')}</span>
              </div>
            ))}
            <div className="divider" />
          </>
        )}

        {myPlayers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No picks yet</div>
            <p className="helptext">Mark players as "Mine" on the draft board as you pick them.</p>
          </div>
        ) : (
          myPlayers.map((p) => (
            <div className="roster-slot" key={p.id}>
              <span>
                <strong>{p.name}</strong> <span className="helptext">#{p.overallPick}</span>
              </span>
              <PositionChip position={p.position} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { useDraftDispatch, useDraftState } from '../state/store.jsx'
import { POSITIONS } from '../data/positions.js'
import { computeVBD } from '../utils/vbd.js'
import { buildSnakeOrder } from '../utils/draftOrder.js'
import PositionChip from './PositionChip.jsx'
import FilterBar from './FilterBar.jsx'
import SnakeStrip from './SnakeStrip.jsx'
import MyTeam from './MyTeam.jsx'

export default function DraftBoard() {
  const state = useDraftState()
  const dispatch = useDraftDispatch()
  const [filters, setFilters] = useState({ positions: new Set(), search: '', hideDrafted: false })

  const withVBD = useMemo(() => computeVBD(state.players, state.replacementRanks), [state.players, state.replacementRanks])

  const myByes = useMemo(() => {
    const set = new Set()
    for (const p of state.players) {
      if (p.status === 'drafted_mine' && p.bye) set.add(Number(p.bye))
    }
    return set
  }, [state.players])

  const filtered = useMemo(() => {
    let list = [...withVBD]
    if (filters.positions.size > 0) list = list.filter((p) => filters.positions.has(p.position))
    if (filters.hideDrafted) list = list.filter((p) => p.status === 'available')
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.team?.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      const av = a.personalRank ?? 9999
      const bv = b.personalRank ?? 9999
      return Number(av) - Number(bv)
    })
    return list
  }, [withVBD, filters])

  const bestByRank = useMemo(() => withVBD.filter((p) => p.status === 'available').sort((a, b) => (a.personalRank ?? 9999) - (b.personalRank ?? 9999))[0], [withVBD])
  const bestByVBD = useMemo(
    () =>
      withVBD
        .filter((p) => p.status === 'available' && p.vbd !== null)
        .sort((a, b) => b.vbd - a.vbd)[0],
    [withVBD],
  )

  const onClock = useMemo(() => {
    const { teams, rounds, myPickSlot } = state.leagueSettings
    const order = buildSnakeOrder(teams, rounds)
    const pick = order[state.picks.length]
    return pick ? pick.teamSlot === myPickSlot : false
  }, [state.leagueSettings, state.picks.length])

  function draft(id, by) {
    dispatch({ type: 'DRAFT_PLAYER', id, by })
  }

  function undo() {
    dispatch({ type: 'UNDO_LAST_PICK' })
  }

  return (
    <div className="layout-grid">
      <div>
        <SnakeStrip leagueSettings={state.leagueSettings} picksMade={state.picks.length} />

        <div className="best-available-banner">
          <div className="ba-item">
            <span className="ba-label">Best by your rank</span>
            <span className="ba-name">{bestByRank ? bestByRank.name || 'Unnamed' : '—'}</span>
            {bestByRank && <PositionChip position={bestByRank.position} />}
          </div>
          <div className="ba-item">
            <span className="ba-label">Best by VBD</span>
            <span className="ba-name">{bestByVBD ? bestByVBD.name || 'Unnamed' : '—'}</span>
            {bestByVBD && <PositionChip position={bestByVBD.position} />}
            {bestByVBD && <span className="num">+{bestByVBD.vbd}</span>}
          </div>
          <div className="ba-item" style={{ marginLeft: 'auto' }}>
            <span className={`ba-label ${onClock ? '' : ''}`} style={{ color: onClock ? 'var(--amber)' : undefined }}>
              {onClock ? 'You are on the clock' : `Pick ${state.picks.length + 1} — waiting`}
            </span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Draft Board</span>
            <button className="btn btn-sm" onClick={undo} disabled={state.picks.length === 0}>
              ↺ Undo last pick
            </button>
          </div>
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="panel-body table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No players match</div>
                <p className="helptext">Adjust filters or add players in the Rankings tab.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>Bye</th>
                    <th>ADP</th>
                    <th>VBD</th>
                    <th>Tier</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const rowClass =
                      p.status === 'drafted_mine' ? 'drafted-mine' : p.status === 'drafted_other' ? 'drafted-other' : ''
                    const isBest = bestByRank && p.id === bestByRank.id
                    const byeConflict = p.status === 'available' && p.bye && myByes.has(Number(p.bye))
                    return (
                      <tr key={p.id} className={`${rowClass} ${isBest ? 'best-available' : ''}`}>
                        <td>
                          <span className={`tier-rail tier-${p.tier || 8}`} style={{ display: 'inline-block', height: 18 }} />
                        </td>
                        <td className="num">{p.personalRank ?? '—'}</td>
                        <td className="row-name">
                          {p.name || <em>Unnamed</em>}
                          {p.notes ? <div className="helptext">{p.notes}</div> : null}
                        </td>
                        <td>
                          <PositionChip position={p.position} />
                        </td>
                        <td className="row-team">{p.team || '—'}</td>
                        <td>
                          {p.bye ? <span className={byeConflict ? 'bye-flag' : 'num'}>{p.bye}</span> : '—'}
                        </td>
                        <td className="num">{p.adp ?? '—'}</td>
                        <td className="num">{p.vbd !== null ? (p.vbd > 0 ? `+${p.vbd}` : p.vbd) : '—'}</td>
                        <td>
                          <span className="tier-badge">T{p.tier || '—'}</span>
                        </td>
                        <td>
                          {p.status === 'available' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-primary btn-sm" onClick={() => draft(p.id, 'me')}>
                                Mine
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => draft(p.id, 'other')}>
                                Taken
                              </button>
                            </div>
                          ) : (
                            <span className="helptext">
                              #{p.overallPick} · {p.status === 'drafted_mine' ? 'You' : 'Other'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <MyTeam />
    </div>
  )
}

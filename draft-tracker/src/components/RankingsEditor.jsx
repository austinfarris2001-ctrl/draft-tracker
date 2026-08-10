import React, { useMemo, useState } from 'react'
import { useDraftDispatch, useDraftState, nextId } from '../state/store.jsx'
import { POSITIONS } from '../data/positions.js'
import PositionChip from './PositionChip.jsx'

function EditableText({ value, onCommit, width, placeholder }) {
  return (
    <div className="editable-cell" style={{ width }}>
      <input
        type="text"
        defaultValue={value ?? ''}
        placeholder={placeholder}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur()
        }}
      />
    </div>
  )
}

function EditableNumber({ value, onCommit, width, placeholder }) {
  return (
    <div className="editable-cell" style={{ width }}>
      <input
        type="number"
        defaultValue={value ?? ''}
        placeholder={placeholder}
        onBlur={(e) => onCommit(e.target.value === '' ? null : Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur()
        }}
      />
    </div>
  )
}

export default function RankingsEditor() {
  const state = useDraftState()
  const dispatch = useDraftDispatch()
  const [sortKey, setSortKey] = useState('personalRank')

  const sorted = useMemo(() => {
    const copy = [...state.players]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === null || av === undefined || av === '') return 1
      if (bv === null || bv === undefined || bv === '') return -1
      return Number(av) - Number(bv)
    })
    return copy
  }, [state.players, sortKey])

  function addPlayer() {
    const nextRank = state.players.length
      ? Math.max(...state.players.map((p) => Number(p.personalRank) || 0)) + 1
      : 1
    dispatch({
      type: 'ADD_PLAYER',
      player: {
        id: nextId(),
        name: '',
        position: 'RB',
        team: '',
        bye: null,
        personalRank: nextRank,
        tier: 1,
        adp: null,
        projPoints: null,
        notes: '',
        status: 'available',
        overallPick: null,
      },
    })
  }

  function update(id, patch) {
    dispatch({ type: 'UPDATE_PLAYER', id, patch })
  }

  function remove(id) {
    dispatch({ type: 'REMOVE_PLAYER', id })
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Rankings Editor</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="personalRank">Sort: My Rank</option>
            <option value="adp">Sort: ADP</option>
            <option value="tier">Sort: Tier</option>
            <option value="projPoints">Sort: Proj. Points</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={addPlayer}>
            + Add Player
          </button>
        </div>
      </div>
      <div className="panel-body table-wrap">
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No players yet</div>
            <p className="helptext">Add your first player to start building your board.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Tier</th>
                <th>Name</th>
                <th>Pos</th>
                <th>Team</th>
                <th>Bye</th>
                <th>ADP</th>
                <th>Proj. Pts</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td>
                    <EditableNumber value={p.personalRank} width={48} onCommit={(v) => update(p.id, { personalRank: v })} />
                  </td>
                  <td>
                    <EditableNumber value={p.tier} width={40} onCommit={(v) => update(p.id, { tier: v })} />
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <EditableText value={p.name} placeholder="Player name" onCommit={(v) => update(p.id, { name: v })} />
                  </td>
                  <td>
                    <select value={p.position} onChange={(e) => update(p.id, { position: e.target.value })}>
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <EditableText value={p.team} width={56} placeholder="TM" onCommit={(v) => update(p.id, { team: v.toUpperCase() })} />
                  </td>
                  <td>
                    <EditableNumber value={p.bye} width={44} onCommit={(v) => update(p.id, { bye: v })} />
                  </td>
                  <td>
                    <EditableNumber value={p.adp} width={56} onCommit={(v) => update(p.id, { adp: v })} />
                  </td>
                  <td>
                    <EditableNumber value={p.projPoints} width={64} onCommit={(v) => update(p.id, { projPoints: v })} />
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <EditableText value={p.notes} placeholder="Injury, sleeper, etc." onCommit={(v) => update(p.id, { notes: v })} />
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

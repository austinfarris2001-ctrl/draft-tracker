import React, { useState } from 'react'
import { useDraftDispatch, useDraftState } from '../state/store.jsx'
import { POSITIONS } from '../data/positions.js'

export default function LeagueSettingsModal({ onClose }) {
  const state = useDraftState()
  const dispatch = useDraftDispatch()
  const [settings, setSettings] = useState(state.leagueSettings)
  const [ranks, setRanks] = useState(state.replacementRanks)

  function save() {
    dispatch({ type: 'SET_LEAGUE_SETTINGS', settings })
    dispatch({ type: 'SET_REPLACEMENT_RANKS', ranks })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="panel-title">League Settings</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="field-grid">
            <div className="field-row">
              <label>Teams</label>
              <input
                type="number"
                value={settings.teams}
                onChange={(e) => setSettings({ ...settings, teams: Number(e.target.value) })}
              />
            </div>
            <div className="field-row">
              <label>Rounds</label>
              <input
                type="number"
                value={settings.rounds}
                onChange={(e) => setSettings({ ...settings, rounds: Number(e.target.value) })}
              />
            </div>
            <div className="field-row">
              <label>Your Slot</label>
              <input
                type="number"
                min={1}
                max={settings.teams}
                value={settings.myPickSlot}
                onChange={(e) => setSettings({ ...settings, myPickSlot: Number(e.target.value) })}
              />
            </div>
            <div className="field-row">
              <label>Scoring</label>
              <select value={settings.scoring} onChange={(e) => setSettings({ ...settings, scoring: e.target.value })}>
                <option value="PPR">PPR</option>
                <option value="Half-PPR">Half-PPR</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div className="divider" />

          <div className="field-row">
            <label>VBD replacement rank (per position)</label>
            <p className="helptext">
              The Nth-best projected-points player at each position sets the "replacement level" baseline for VBD.
              Higher = deeper league, more players count as startable.
            </p>
          </div>
          <div className="field-grid">
            {POSITIONS.map((pos) => (
              <div className="field-row" key={pos}>
                <label>{pos}</label>
                <input
                  type="number"
                  value={ranks[pos]}
                  onChange={(e) => setRanks({ ...ranks, [pos]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={save}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

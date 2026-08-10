import React, { useState } from 'react'
import { useDraftDispatch, useDraftState } from './state/store.jsx'
import RankingsEditor from './components/RankingsEditor.jsx'
import DraftBoard from './components/DraftBoard.jsx'
import LeagueSettingsModal from './components/LeagueSettingsModal.jsx'
import MockDraftModal from './components/MockDraftModal.jsx'
import ImportExportBar from './components/ImportExportBar.jsx'

export default function App() {
  const state = useDraftState()
  const dispatch = useDraftDispatch()
  const [tab, setTab] = useState('rankings')
  const [showSettings, setShowSettings] = useState(false)
  const [showMock, setShowMock] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function resetDraft() {
    if (confirm('Reset the live draft? This clears all picks but keeps your rankings.')) {
      dispatch({ type: 'RESET_DRAFT' })
      showToast('Draft reset')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">
            Draft<span>Tracker</span>
          </span>
          <span className="brand-sub">
            {state.leagueSettings.teams}-team · {state.leagueSettings.scoring} · slot {state.leagueSettings.myPickSlot}
          </span>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'rankings' ? 'active' : ''}`} onClick={() => setTab('rankings')}>
            Rankings
          </button>
          <button className={`tab-btn ${tab === 'board' ? 'active' : ''}`} onClick={() => setTab('board')}>
            Draft Board
          </button>
        </div>

        <div className="header-actions">
          <ImportExportBar onToast={showToast} />
          <button className="btn btn-sm" onClick={() => setShowMock(true)}>
            Mock Draft
          </button>
          <button className="btn btn-sm" onClick={() => setShowSettings(true)}>
            League Settings
          </button>
          {tab === 'board' && (
            <button className="btn btn-danger btn-sm" onClick={resetDraft}>
              Reset Draft
            </button>
          )}
        </div>
      </header>

      <main className="main">{tab === 'rankings' ? <RankingsEditor /> : <DraftBoard />}</main>

      {showSettings && <LeagueSettingsModal onClose={() => setShowSettings(false)} />}
      {showMock && <MockDraftModal onClose={() => setShowMock(false)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

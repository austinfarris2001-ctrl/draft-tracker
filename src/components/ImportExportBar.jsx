import React, { useRef } from 'react'
import { useDraftDispatch, useDraftState } from '../state/store.jsx'

export default function ImportExportBar({ onToast }) {
  const state = useDraftState()
  const dispatch = useDraftDispatch()
  const fileInput = useRef(null)

  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `draft-tracker-rankings-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.('Rankings exported')
  }

  function triggerImport() {
    fileInput.current?.click()
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        dispatch({ type: 'IMPORT_STATE', state: parsed })
        onToast?.('Rankings imported')
      } catch (err) {
        onToast?.('Import failed — not a valid file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="btn btn-sm" onClick={exportJson}>
        Export JSON
      </button>
      <button className="btn btn-sm" onClick={triggerImport}>
        Import JSON
      </button>
      <input ref={fileInput} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

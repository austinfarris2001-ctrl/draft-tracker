import React from 'react'
import { POSITIONS } from '../data/positions.js'

export default function FilterBar({ filters, onChange }) {
  function togglePos(pos) {
    const set = new Set(filters.positions)
    if (set.has(pos)) set.delete(pos)
    else set.add(pos)
    onChange({ ...filters, positions: set })
  }

  return (
    <div className="filter-bar">
      {POSITIONS.map((pos) => {
        const active = filters.positions.has(pos)
        return (
          <button
            key={pos}
            className={`filter-chip ${active ? `pos-active-${pos}` : ''}`}
            onClick={() => togglePos(pos)}
            aria-pressed={active}
          >
            {pos}
          </button>
        )
      })}
      <button
        className={`filter-chip ${filters.hideDrafted ? 'active' : ''}`}
        onClick={() => onChange({ ...filters, hideDrafted: !filters.hideDrafted })}
        aria-pressed={filters.hideDrafted}
      >
        Hide drafted
      </button>
      <input
        className="search-input"
        type="text"
        placeholder="Search players..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
    </div>
  )
}

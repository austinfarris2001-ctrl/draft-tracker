import React from 'react'

export default function PositionChip({ position }) {
  return <span className={`pos-chip pos-${position}`}>{position}</span>
}

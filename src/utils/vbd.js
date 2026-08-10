import { POSITIONS } from '../data/positions.js'

/**
 * Computes Value-Based Drafting scores for a list of players.
 * VBD = player's projected points - replacement-level baseline for their position.
 * The baseline is the Nth-best projected-points player at that position,
 * where N comes from replacementRanks (see data/positions.js, editable in League Settings).
 *
 * Players with no projected points entered are skipped (return null VBD)
 * so they don't distort the baseline or sort to the top.
 */
export function computeVBD(players, replacementRanks) {
  const baselines = {}

  for (const pos of POSITIONS) {
    const withPoints = players
      .filter((p) => p.position === pos && isFinite(p.projPoints) && p.projPoints !== null && p.projPoints !== '')
      .map((p) => Number(p.projPoints))
      .sort((a, b) => b - a)

    const rank = replacementRanks[pos] ?? 12
    // baseline = points of the replacement-rank player, or the last available if fewer exist
    baselines[pos] = withPoints.length > 0 ? withPoints[Math.min(rank, withPoints.length) - 1] : 0
  }

  return players.map((p) => {
    const hasPoints = p.projPoints !== null && p.projPoints !== '' && isFinite(p.projPoints)
    if (!hasPoints) return { ...p, vbd: null }
    const baseline = baselines[p.position] ?? 0
    return { ...p, vbd: Math.round((Number(p.projPoints) - baseline) * 10) / 10 }
  })
}

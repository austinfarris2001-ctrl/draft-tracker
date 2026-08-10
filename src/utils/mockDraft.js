/**
 * Picks a player for a simulated opponent using ADP with randomness,
 * so mocks feel like real drafts (reaches and falls) instead of a
 * strict ADP sort.
 *
 * Method: give every available player (that has an ADP entered) a
 * "noisy ADP" of adp + gaussian-ish noise, where the noise's spread
 * grows a little with the round (opponents get less predictable on
 * later, less-consensus picks). Players with no ADP entered fall back
 * to their personal-rank position in the pool so the mock still works
 * on a partially-filled rankings sheet.
 */
function gaussianNoise(stdDev) {
  // Box-Muller, using two uniforms
  const u1 = Math.random() || 1e-6
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z * stdDev
}

export function pickForOpponent(availablePlayers, round) {
  if (availablePlayers.length === 0) return null

  const stdDev = 3 + round * 0.6 // picks get noisier as the draft goes on

  const withScore = availablePlayers.map((p, idx) => {
    const baseline = p.adp !== null && p.adp !== '' && isFinite(p.adp) ? Number(p.adp) : idx + 1
    return { player: p, noisyAdp: baseline + gaussianNoise(stdDev) }
  })

  withScore.sort((a, b) => a.noisyAdp - b.noisyAdp)
  return withScore[0].player
}

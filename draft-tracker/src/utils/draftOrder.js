/**
 * Builds the full snake-draft pick order.
 * Returns an array of { overall, round, teamSlot } where teamSlot is
 * 1-indexed (1..teams). Odd rounds go 1->teams, even rounds reverse.
 */
export function buildSnakeOrder(teams, rounds) {
  const picks = []
  let overall = 1
  for (let round = 1; round <= rounds; round++) {
    const order = []
    for (let t = 1; t <= teams; t++) order.push(t)
    if (round % 2 === 0) order.reverse()
    for (const teamSlot of order) {
      picks.push({ overall, round, teamSlot })
      overall++
    }
  }
  return picks
}

export function isMyPick(pick, myPickSlot) {
  return pick.teamSlot === myPickSlot
}

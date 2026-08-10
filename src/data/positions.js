export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DST']

// How many "starter-level" players at each position define the replacement
// baseline for VBD, at a 12-team league. Roughly: teams * starters-per-team,
// plus a flex cushion for RB/WR. Editable via League Settings.
export const DEFAULT_REPLACEMENT_RANK = {
  QB: 12, // 1 starter x 12 teams
  RB: 30, // 2 starters + flex share x 12 teams
  WR: 36, // 2-3 starters + flex share x 12 teams
  TE: 12,
  K: 12,
  DST: 12,
}

export const DEFAULT_LEAGUE_SETTINGS = {
  teams: 12,
  scoring: 'PPR',
  myPickSlot: 1, // 1-indexed draft position
  rounds: 16,
}

export const ROSTER_TEMPLATE = [
  { slot: 'QB', count: 1 },
  { slot: 'RB', count: 2 },
  { slot: 'WR', count: 2 },
  { slot: 'TE', count: 1 },
  { slot: 'FLEX', count: 1, eligible: ['RB', 'WR', 'TE'] },
  { slot: 'K', count: 1 },
  { slot: 'DST', count: 1 },
  { slot: 'BENCH', count: 7 },
]

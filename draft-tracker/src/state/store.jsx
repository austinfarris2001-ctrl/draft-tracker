import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { DEFAULT_LEAGUE_SETTINGS, DEFAULT_REPLACEMENT_RANK } from '../data/positions.js'

const STORAGE_KEY = 'draft-tracker-state-v1'

const emptyState = {
  players: [],
  leagueSettings: DEFAULT_LEAGUE_SETTINGS,
  replacementRanks: DEFAULT_REPLACEMENT_RANK,
  picks: [], // ordered log of draft actions for undo: { playerId, overall, by }
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw)
    return {
      ...emptyState,
      ...parsed,
      leagueSettings: { ...DEFAULT_LEAGUE_SETTINGS, ...(parsed.leagueSettings || {}) },
      replacementRanks: { ...DEFAULT_REPLACEMENT_RANK, ...(parsed.replacementRanks || {}) },
    }
  } catch (e) {
    console.error('Failed to load saved draft state', e)
    return emptyState
  }
}

let idCounter = 1
export function nextId() {
  return `p${Date.now()}_${idCounter++}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players }

    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.player] }

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
        picks: state.picks.filter((pk) => pk.playerId !== action.id),
      }

    case 'DRAFT_PLAYER': {
      const overall = state.picks.length + 1
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, status: action.by === 'me' ? 'drafted_mine' : 'drafted_other', overallPick: overall } : p,
        ),
        picks: [...state.picks, { playerId: action.id, overall, by: action.by }],
      }
    }

    case 'UNDO_LAST_PICK': {
      if (state.picks.length === 0) return state
      const last = state.picks[state.picks.length - 1]
      return {
        ...state,
        players: state.players.map((p) => (p.id === last.playerId ? { ...p, status: 'available', overallPick: null } : p)),
        picks: state.picks.slice(0, -1),
      }
    }

    case 'RESET_DRAFT':
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, status: 'available', overallPick: null })),
        picks: [],
      }

    case 'SET_LEAGUE_SETTINGS':
      return { ...state, leagueSettings: { ...state.leagueSettings, ...action.settings } }

    case 'SET_REPLACEMENT_RANKS':
      return { ...state, replacementRanks: { ...state.replacementRanks, ...action.ranks } }

    case 'IMPORT_STATE':
      return {
        ...emptyState,
        ...action.state,
        leagueSettings: { ...DEFAULT_LEAGUE_SETTINGS, ...(action.state.leagueSettings || {}) },
        replacementRanks: { ...DEFAULT_REPLACEMENT_RANK, ...(action.state.replacementRanks || {}) },
      }

    default:
      return state
  }
}

const DraftStateContext = createContext(null)
const DraftDispatchContext = createContext(null)

export function DraftProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save draft state', e)
    }
  }, [state])

  return (
    <DraftStateContext.Provider value={state}>
      <DraftDispatchContext.Provider value={dispatch}>{children}</DraftDispatchContext.Provider>
    </DraftStateContext.Provider>
  )
}

export function useDraftState() {
  const ctx = useContext(DraftStateContext)
  if (!ctx) throw new Error('useDraftState must be used within DraftProvider')
  return ctx
}

export function useDraftDispatch() {
  const ctx = useContext(DraftDispatchContext)
  if (!ctx) throw new Error('useDraftDispatch must be used within DraftProvider')
  return ctx
}

import { create } from 'zustand';
import type { GameState } from './types';
import { createInitialData, startGame, nextPhase } from './actions/gameFlowActions';
import { addPlayer, removePlayer, setTotalRounds } from './actions/playerActions';
import {
  acceptDare,
  skipDare,
  acceptPunishment,
  skipPunishment,
  markProofValid,
  markProofInvalid,
} from './actions/dareActions';
import { selectNextPlayer } from './actions/rouletteActions';

export * from './types';
export * from './constants/scoring';
export * from './constants/game';
export * from './utils/scoring';
export * from './mockData';

export const useGameState = create<GameState>((set) => ({
  ...createInitialData(),

  addPlayer: (playerWithoutId) => set((state) => addPlayer(state, playerWithoutId)),

  removePlayer: (id) => set((state) => removePlayer(state, id)),

  setTotalRounds: (rounds) => set(() => setTotalRounds(rounds)),

  startGame: () => {
    const state = useGameState.getState();
    const { success, updates } = startGame(state);
    if (success) {
      set(updates);
    }
    return success;
  },

  acceptDare: () => set((state) => acceptDare(state)),

  skipDare: () => set((state) => skipDare(state)),

  acceptPunishment: () => set((state) => acceptPunishment(state)),

  skipPunishment: () => set((state) => skipPunishment(state)),

  markProofValid: () => set((state) => markProofValid(state)),

  markProofInvalid: () => set((state) => markProofInvalid(state)),

  selectNextPlayer: (playerId) => set((state) => selectNextPlayer(state, playerId)),

  nextPhase: () => set((state) => nextPhase(state)),

  resetGame: () => set(() => ({ ...createInitialData() })),
  // Toggle background music preference. If `enabled` is omitted, toggle current value.
  toggleBgMusic: (enabled?: boolean) =>
    set((state) => ({
      bgMusicEnabled: typeof enabled === 'boolean' ? enabled : !state.bgMusicEnabled,
    })),
}));

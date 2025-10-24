import type { GameData } from '../types';
import { RANDOM_EVENT_PROBABILITY, TOTAL_ROUNDS_DEFAULT } from '../constants/game';
import { RANDOM_EVENT_PROMPTS, pickRandom } from '../utils/prompts';
import { applyScore } from '../utils/scoring';
import { SCORE_EVENT } from '../constants/scoring';

export const createInitialData = (): GameData => ({
  phase: 'setup',
  totalRounds: TOTAL_ROUNDS_DEFAULT,
  currentRound: 0,
  currentDareLevel: 1,
  players: [],
  activePlayer: undefined,
  activePlayerId: undefined,
  latestDare: undefined,
  latestOutcome: undefined,
  latestEvent: undefined,
  skipRollResult: undefined,
  // Enable background music by default. User can toggle it off from the home menu.
  bgMusicEnabled: true,
});

export const startGame = (state: GameData): { success: boolean; updates: Partial<GameData> } => {
  if (state.players.length < 3 || state.players.length > 5) {
    return { success: false, updates: {} };
  }
  return {
    success: true,
    updates: {
      phase: 'pregame',
      currentRound: 0,
      latestOutcome: undefined,
      latestEvent: undefined,
    },
  };
};

export const nextPhase = (state: GameData): Partial<GameData> => {
  switch (state.phase) {
    case 'setup':
      return {
        phase: 'pregame',
        currentRound: 0,
        latestOutcome: undefined,
        latestEvent: undefined,
      };
    case 'pregame':
      return {
        phase: 'roulette',
        currentRound: 0,
      };
    case 'roulette':
      // This should be handled by selectNextPlayer
      return {};
    case 'round':
      // Player should now choose accept/decline, not auto-resolve
      return {};
    case 'proof':
    case 'punishment':
    case 'safe-skip': {
      const hasMoreRounds = state.currentRound < state.totalRounds;
      if (!hasMoreRounds) {
        return {
          phase: 'summary',
          latestEvent: undefined,
          latestDare: undefined,
        };
      }

      const shouldTriggerEvent = Math.random() < RANDOM_EVENT_PROBABILITY;
      if (shouldTriggerEvent) {
        // Track event for active player
        if (state.activePlayer) {
          const player = state.players.find((p) => p.id === state.activePlayer!.id);
          if (player) {
            player.stats.eventsTriggered++;
            applyScore(player, SCORE_EVENT);
          }
        }

        return {
          phase: 'event',
          latestEvent:
            pickRandom(RANDOM_EVENT_PROMPTS) ?? 'Cupid.exe encountered a mysterious glitch.',
          players: [...state.players], // Trigger update
        };
      }

      return {
        phase: 'roulette',
      };
    }
    case 'event': {
      const hasMoreRounds = state.currentRound < state.totalRounds;
      if (!hasMoreRounds) {
        return {
          phase: 'summary',
          latestEvent: undefined,
          latestDare: undefined,
        };
      }

      return {
        phase: 'roulette',
      };
    }
    case 'summary':
    default:
      return {};
  }
};

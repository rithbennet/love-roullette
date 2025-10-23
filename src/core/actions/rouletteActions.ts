import type { GameData } from '../types';
import { getRoundLevel, getFinalLevel } from '../utils/scoring';
import { DARE_PROMPTS, pickRandom } from '../utils/prompts';
import { getRouletteWeights, weightedRandomPick } from '../utils/roulette';
import darePrompts from '../../data/dares.json';

export const selectNextPlayer = (state: GameData, playerId: string): Partial<GameData> => {
  let selectedPlayer = state.players.find((p) => p.id === playerId);

  if (!playerId) {
    // Fair roulette pick
    const weights = getRouletteWeights(state.players, state.activePlayerId);
    selectedPlayer = weightedRandomPick(state.players, weights);
  }

  const nextRound = state.currentRound + 1;
  const roundLevel = getRoundLevel(nextRound);
  const dareLevel = selectedPlayer ? getFinalLevel(selectedPlayer, roundLevel) : 1;
  const darePrompt = String(
    pickRandom((darePrompts as any)[dareLevel] || DARE_PROMPTS) ||
      'Cupid is searching for a dare...'
  );

  return {
    phase: 'round',
    currentRound: nextRound,
    currentDareLevel: dareLevel,
    activePlayer: selectedPlayer,
    activePlayerId: selectedPlayer?.id,
    latestDare: darePrompt,
    latestOutcome: undefined,
    latestEvent: undefined,
    skipRollResult: undefined,
  };
};

import type { GameData, Player } from '../types';
import { createInitialStats } from '../mockData';

export const addPlayer = (
  state: GameData,
  playerWithoutId: Omit<Player, 'id' | 'stats'>
): Partial<GameData> => {
  const newPlayer: Player = {
    ...playerWithoutId,
    id: `player-${Date.now()}-${state.players.length}`,
    stats: createInitialStats(),
  };

  return {
    players: [...state.players, newPlayer],
  };
};

export const removePlayer = (state: GameData, id: string): Partial<GameData> => ({
  players: state.players.filter((p) => p.id !== id),
});

export const setTotalRounds = (rounds: number): Partial<GameData> => ({
  totalRounds: Math.max(1, Math.min(15, rounds)),
});

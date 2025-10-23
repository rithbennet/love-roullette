import type { Player, PlayerStats } from './types';

export const createInitialStats = (): PlayerStats => ({
  points: 0,
  successes: 0,
  failures: 0,
  skips: 0,
  skipStreak: 0,
  punishments: 0,
  eventsTriggered: 0,
});

// Mock players for testing
export const MOCK_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Aria',
    daringLevel: 2,
    crush: 'Jules',
    characterId: 'char-1',
    stats: createInitialStats(),
  },
  {
    id: 'player-2',
    name: 'Jules',
    daringLevel: 3,
    crush: 'Mika',
    characterId: 'char-2',
    stats: createInitialStats(),
  },
  {
    id: 'player-3',
    name: 'Mika',
    daringLevel: 1,
    crush: 'Aria',
    characterId: 'char-3',
    stats: createInitialStats(),
  },
];

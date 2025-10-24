import type { PlayerStats } from './types';

export const createInitialStats = (): PlayerStats => ({
  points: 0,
  successes: 0,
  failures: 0,
  skips: 0,
  skipStreak: 0,
  punishments: 0,
  eventsTriggered: 0,
});

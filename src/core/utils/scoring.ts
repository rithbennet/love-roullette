import type { Player } from '../types';
import { DARING_MULTIPLIERS } from '../constants/scoring';

export const applyScore = (player: Player, basePoints: number) => {
  const multiplier =
    DARING_MULTIPLIERS[player.daringLevel as keyof typeof DARING_MULTIPLIERS] || 1.0;
  player.stats.points += Math.round(basePoints * multiplier);
};

export const getRoundLevel = (currentRound: number): number => {
  return Math.min(3, 1 + Math.floor((currentRound - 1) / 2));
};

export const getFinalLevel = (player: Player, roundLevel: number): number => {
  return Math.max(1, Math.min(3, Math.max(player.daringLevel, roundLevel)));
};

// Helper: Calculate skip outcome odds based on skip streak
export const calculateSkipChances = (streak: number) => {
  const safe = Math.max(40 - 10 * streak, 0);
  const punishment = Math.min(40 + 5 * streak, 70);
  const worseDare = 100 - safe - punishment;
  return { safe, punishment, worseDare };
};

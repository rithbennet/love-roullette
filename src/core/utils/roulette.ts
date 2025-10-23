import type { Player } from '../types';

// Fair roulette: track pick weights
export function getRouletteWeights(players: Player[], lastPickedId?: string): number[] {
  // Each player starts with weight 1
  // If not picked last round, +1 to their weight
  // If picked last round, -0.5 to their weight (min 0.5)
  return players.map((p) => {
    let weight = 1;
    if (p.id === lastPickedId) {
      weight = 0.5;
    } else {
      weight += p.stats.skipStreak; // More skips, more weight
    }
    return Math.max(weight, 0.5);
  });
}

export function weightedRandomPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[0];
}

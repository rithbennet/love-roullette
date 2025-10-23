import type { Phase } from '../types';

export const TOTAL_ROUNDS_DEFAULT = 3;
export const RANDOM_EVENT_PROBABILITY = 0.25;

export const ROUTE_MAP: Record<Phase, string> = {
  setup: '/',
  pregame: '/pregame',
  roulette: '/roulette',
  round: '/round',
  proof: '/proof',
  punishment: '/punishment',
  event: '/event',
  summary: '/summary',
};

export const getRouteForPhase = (phase: Phase): string => ROUTE_MAP[phase] ?? '/';

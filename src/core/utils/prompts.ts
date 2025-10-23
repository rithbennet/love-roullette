import darePrompts from '../../data/dares.json';
import punishmentPrompts from '../../data/punishments.json';
import randomEventPrompts from '../../data/randomEvents.json';
import type { DarePrompt, PunishmentPrompt, RandomEventPrompt } from '../types';

const normalizePrompts = (data: unknown): string[] => {
  if (Array.isArray(data)) {
    return data.filter((item): item is string => typeof item === 'string');
  }

  if (data && typeof data === 'object') {
    return Object.values(data as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : []))
      .filter((value): value is string => typeof value === 'string');
  }

  return [];
};

export const DARE_PROMPTS = normalizePrompts(darePrompts) as DarePrompt[];
export const PUNISHMENT_PROMPTS = normalizePrompts(punishmentPrompts) as PunishmentPrompt[];
export const RANDOM_EVENT_PROMPTS = normalizePrompts(randomEventPrompts) as RandomEventPrompt[];

export const pickRandom = <T>(items: T[], fallback: T | undefined = undefined): T | undefined => {
  if (items.length === 0) {
    return fallback;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

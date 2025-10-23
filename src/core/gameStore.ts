import { create } from 'zustand';

import { CHARACTERS } from '../data/characters';
import darePrompts from '../data/dares.json';
import punishmentPrompts from '../data/punishments.json';
import randomEventPrompts from '../data/randomEvents.json';

export type Phase = 'setup' | 'pregame' | 'round' | 'proof' | 'punishment' | 'event' | 'summary';

type Character = (typeof CHARACTERS)[number];

type DarePrompt = string;
type PunishmentPrompt = string;
type RandomEventPrompt = string;

export interface Player {
  id: string;
  name: string;
  daringLevel: number;
  crush: string;
  characterId: string;
  character?: Character;
}

interface GameData {
  phase: Phase;
  totalRounds: number;
  currentRound: number;
  players: Player[];
  activePlayer?: Player;
  activePlayerId?: string;
  latestDare?: DarePrompt;
  latestOutcome?: string;
  latestEvent?: RandomEventPrompt;
}

interface GameActions {
  addPlayer: (player: Omit<Player, 'id'>) => void;
  nextPhase: () => void;
  resetGame: () => void;
}

export type GameState = GameData & GameActions;

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

const DARE_PROMPTS = normalizePrompts(darePrompts) as DarePrompt[];
const PUNISHMENT_PROMPTS = normalizePrompts(punishmentPrompts) as PunishmentPrompt[];
const RANDOM_EVENT_PROMPTS = normalizePrompts(randomEventPrompts) as RandomEventPrompt[];

const TOTAL_ROUNDS_DEFAULT = 3;
const ACCEPT_DARE_PROBABILITY = 0.65;
const RANDOM_EVENT_PROBABILITY = 0.25;

const ROUTE_MAP: Record<Phase, string> = {
  setup: '/',
  pregame: '/pregame',
  round: '/round',
  proof: '/proof',
  punishment: '/punishment',
  event: '/event',
  summary: '/summary',
};

const createInitialPlayers = (): Player[] => {
  const fallbackCharacter = CHARACTERS[0];
  const names = ['Aria', 'Jules', 'Mika'];
  const daringLevels = [3, 4, 2];
  const crushes = ['Jules', 'Mika', 'Aria'];

  return names.map((name, index) => {
    const character = CHARACTERS[index] ?? fallbackCharacter;

    return {
      id: `player-${index + 1}`,
      name,
      daringLevel: daringLevels[index] ?? 3,
      crush: crushes[index] ?? names[(index + 1) % names.length],
      characterId: character?.id ?? `character-${index + 1}`,
      character,
    } satisfies Player;
  });
};

const createInitialData = (): GameData => ({
  phase: 'setup',
  totalRounds: TOTAL_ROUNDS_DEFAULT,
  currentRound: 0,
  players: createInitialPlayers(),
  activePlayer: undefined,
  activePlayerId: undefined,
  latestDare: undefined,
  latestOutcome: undefined,
  latestEvent: undefined,
});

const pickRandom = <T>(items: T[], fallback: T | undefined = undefined): T | undefined => {
  if (items.length === 0) {
    return fallback;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

const chooseNextActivePlayer = (players: Player[], previousId?: string) => {
  if (players.length === 0) {
    return undefined;
  }

  const pool =
    previousId && players.length > 1 ? players.filter((p) => p.id !== previousId) : players;
  return pickRandom(pool, players[0]);
};

const prepareNextRound = (state: GameData): Partial<GameData> => {
  const nextRound = state.currentRound + 1;
  const activePlayer = chooseNextActivePlayer(state.players, state.activePlayerId);

  return {
    phase: 'round',
    currentRound: nextRound,
    activePlayer,
    activePlayerId: activePlayer?.id,
    latestDare: pickRandom(DARE_PROMPTS) ?? 'Cupid.exe is searching for a dare...',
    latestOutcome: undefined,
    latestEvent: undefined,
  };
};

export const useGameState = create<GameState>((set) => ({
  ...createInitialData(),
  addPlayer: (playerWithoutId) =>
    set((state) => {
      const newPlayer: Player = {
        ...playerWithoutId,
        id: `player-${state.players.length + 1}`,
      };

      return {
        players: [...state.players, newPlayer],
      };
    }),
  nextPhase: () => {
    set((state) => {
      switch (state.phase) {
        case 'setup':
          return {
            phase: 'pregame',
            currentRound: 0,
            latestOutcome: undefined,
            latestEvent: undefined,
          };
        case 'pregame':
          return prepareNextRound(state);
        case 'round': {
          const activePlayer = state.activePlayer ?? chooseNextActivePlayer(state.players);
          const accepted = Math.random() < ACCEPT_DARE_PROBABILITY;
          const outcome = accepted
            ? `${activePlayer?.name ?? 'Someone'} rose to the challenge! Share the proof.`
            : `${activePlayer?.name ?? 'Someone'} skipped the dare. Punishment incoming.`;
          const punishmentDetail = pickRandom(PUNISHMENT_PROMPTS);

          return {
            phase: accepted ? 'proof' : 'punishment',
            activePlayer,
            activePlayerId: activePlayer?.id,
            latestOutcome: accepted ? outcome : (punishmentDetail ?? outcome),
          };
        }
        case 'proof':
        case 'punishment': {
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
            return {
              phase: 'event',
              latestEvent:
                pickRandom(RANDOM_EVENT_PROMPTS) ?? 'Cupid.exe encountered a mysterious glitch.',
            };
          }

          return prepareNextRound(state);
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

          return prepareNextRound(state);
        }
        case 'summary':
        default:
          return {};
      }
    });
  },
  resetGame: () => set(() => ({ ...createInitialData() })),
}));

export const getRouteForPhase = (phase: Phase): string => ROUTE_MAP[phase] ?? '/';

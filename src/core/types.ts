import { CHARACTERS } from '../data/characters';

export type Phase =
  | 'setup'
  | 'pregame'
  | 'roulette'
  | 'round'
  | 'proof'
  | 'punishment'
  | 'event'
  | 'summary';

export type Character = (typeof CHARACTERS)[number];

export type DarePrompt = string;
export type PunishmentPrompt = string;
export type RandomEventPrompt = string;

export interface PlayerStats {
  points: number;
  successes: number;
  failures: number;
  skips: number;
  skipStreak: number;
  punishments: number;
  eventsTriggered: number;
}

export interface Player {
  id: string;
  name: string;
  daringLevel: number;
  crush: string;
  characterId: string;
  character?: Character;
  stats: PlayerStats;
}

export interface GameData {
  phase: Phase;
  totalRounds: number;
  currentRound: number;
  currentDareLevel: number;
  players: Player[];
  activePlayer?: Player;
  activePlayerId?: string;
  latestDare?: DarePrompt;
  latestOutcome?: string;
  latestEvent?: RandomEventPrompt;
  skipRollResult?: 'safe' | 'punishment' | 'worseDare';
}

export interface GameActions {
  addPlayer: (player: Omit<Player, 'id' | 'stats'>) => void;
  removePlayer: (id: string) => void;
  setTotalRounds: (rounds: number) => void;
  startGame: () => boolean;
  acceptDare: () => void;
  skipDare: () => void;
  acceptPunishment: () => void;
  skipPunishment: () => void;
  markProofValid: () => void;
  markProofInvalid: () => void;
  selectNextPlayer: (playerId: string) => void;
  nextPhase: () => void;
  resetGame: () => void;
}

export type GameState = GameData & GameActions;

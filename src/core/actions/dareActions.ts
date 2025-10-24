import type { GameData, Phase } from '../types';
import {
  SCORE_DARE_SUCCESS,
  SCORE_FAIL,
  SCORE_SAFE_SKIP,
  SCORE_PUNISHMENT,
  DARING_MULTIPLIERS,
} from '../constants/scoring';
import { applyScore, calculateSkipChances, getRoundLevel, getFinalLevel } from '../utils/scoring';
import { DARE_PROMPTS, PUNISHMENT_PROMPTS, pickRandom } from '../utils/prompts';
import darePrompts from '../../data/dares.json';
import punishmentPrompts from '../../data/punishments.json';

export const acceptDare = (state: GameData): Partial<GameData> => {
  const activePlayer = state.activePlayer;
  const outcome = `${activePlayer?.name ?? 'Someone'} rose to the challenge! Share the proof.`;

  return {
    phase: 'proof',
    latestOutcome: outcome,
  };
};

export const skipDare = (state: GameData): Partial<GameData> => {
  if (!state.activePlayer) return {};
  const player = state.players.find((p) => p.id === state.activePlayer!.id);
  if (!player) return {};

  // Allow multiple skips per round, up to skip limit (4)
  if (player.stats.skipStreak >= 4) {
    const roundLevel = getRoundLevel(state.currentRound);
    const finalLevel = getFinalLevel(player, roundLevel);
    const punishmentDetail = String(
      pickRandom((punishmentPrompts as any)[finalLevel] || PUNISHMENT_PROMPTS) ||
        'Cupid is thinking of a punishment...'
    );
    applyScore(player, SCORE_PUNISHMENT);
    player.stats.skips++;
    player.stats.skipStreak++;
    player.stats.punishments++;
    return {
      phase: 'punishment',
      skipRollResult: 'punishment',
      latestOutcome: `Cupid.exe is WRATHFUL! Forced punishment! 😈\n\n${punishmentDetail}`,
      players: [...state.players],
    };
  }

  // Calculate skip chances based on skip streak
  const chances = calculateSkipChances(player.stats.skipStreak);
  const roll = Math.random() * 100;
  let result: 'safe' | 'punishment' | 'worseDare';
  let outcome: string;
  let newPhase: Phase;
  let newDareLevel = state.currentDareLevel;

  if (roll < chances.safe) {
    result = 'safe';
    const penalty = SCORE_SAFE_SKIP * (1 + 0.5 * player.stats.skipStreak);
    applyScore(player, penalty);
    player.stats.skips++;
    player.stats.skipStreak++;
    outcome =
      player.stats.skipStreak === 1
        ? `${player.name} dodged Cupid's arrow... for now. 😅`
        : player.stats.skipStreak === 2
          ? `${player.name} slips away again. Cupid is getting annoyed... 😒`
          : `${player.name} escapes once more. Cupid's patience is wearing thin! 😠`;
    // Safe skip goes to safe-skip screen
    return {
      phase: 'safe-skip',
      skipRollResult: result,
      latestOutcome: outcome,
      players: [...state.players],
    };
  } else if (roll < chances.safe + chances.punishment) {
    result = 'punishment';
    const roundLevel = getRoundLevel(state.currentRound);
    const finalLevel = getFinalLevel(player, roundLevel);
    const punishmentDetail = String(
      pickRandom((punishmentPrompts as any)[finalLevel] || PUNISHMENT_PROMPTS) ||
        'Cupid is thinking of a punishment...'
    );
    applyScore(player, SCORE_PUNISHMENT);
    player.stats.skips++;
    player.stats.skipStreak++;
    player.stats.punishments++;
    outcome =
      player.stats.skipStreak >= 3
        ? `Cupid.exe is FURIOUS! 😈\n\n${punishmentDetail}`
        : (punishmentDetail ?? `${player.name} must face the consequences!`);
    newPhase = 'punishment';
  } else {
    result = 'worseDare';
    const newLevel = Math.min(3, state.currentDareLevel + 1);
    newDareLevel = newLevel;
    const worseDare = String(
      pickRandom((darePrompts as any)[newLevel] || DARE_PROMPTS) ||
        'Cupid is thinking of something worse...'
    );
    player.stats.skips++;
    player.stats.skipStreak++;
    outcome =
      player.stats.skipStreak >= 3
        ? `Cupid doubles down! 🔥🔥\n\nYou tried to run, but love finds a way...`
        : `Cupid won't let you escape that easily! 🔥`;
    // Stay in round phase with new dare
    return {
      skipRollResult: result,
      latestOutcome: outcome,
      latestDare: worseDare,
      currentDareLevel: newDareLevel,
      players: [...state.players],
    };
  }

  return {
    phase: newPhase,
    skipRollResult: result,
    latestOutcome: outcome,
    currentDareLevel: newDareLevel,
    players: [...state.players],
  };
};

export const markProofValid = (state: GameData): Partial<GameData> => {
  if (!state.activePlayer) return {};

  const player = state.players.find((p) => p.id === state.activePlayer!.id);
  if (!player) return {};

  // Success! Reset skip streak and award points
  applyScore(player, SCORE_DARE_SUCCESS);
  player.stats.successes++;
  player.stats.skipStreak = 0;

  const outcome = `${player.name} completed the dare! Cupid is impressed! 💘 (+${Math.round(
    SCORE_DARE_SUCCESS *
      (DARING_MULTIPLIERS[player.daringLevel as keyof typeof DARING_MULTIPLIERS] || 1)
  )} pts)`;

  return {
    latestOutcome: outcome,
    players: [...state.players],
  };
};

export const markProofInvalid = (state: GameData): Partial<GameData> => {
  if (!state.activePlayer) return {};

  const player = state.players.find((p) => p.id === state.activePlayer!.id);
  if (!player) return {};

  // Failed proof
  applyScore(player, SCORE_FAIL);
  player.stats.failures++;
  // Don't reset skip streak on failure

  const outcome = `${player.name} couldn't prove it... Cupid is disappointed. 😔 (${SCORE_FAIL} pts)`;

  return {
    latestOutcome: outcome,
    players: [...state.players],
  };
};

export const acceptPunishment = (state: GameData): Partial<GameData> => {
  const activePlayer = state.activePlayer;
  const outcome = `${activePlayer?.name ?? 'Someone'} accepted the punishment! Share the proof.`;

  return {
    phase: 'proof',
    latestOutcome: outcome,
  };
};

export const skipPunishment = (state: GameData): Partial<GameData> => {
  if (!state.activePlayer) return {};
  const player = state.players.find((p) => p.id === state.activePlayer!.id);
  if (!player) return {};

  // Skip punishment uses the same roll system
  const chances = calculateSkipChances(player.stats.skipStreak);
  const roll = Math.random() * 100;
  let result: 'safe' | 'punishment' | 'worseDare';
  let outcome: string;
  let newPhase: Phase = 'punishment';

  if (roll < chances.safe) {
    result = 'safe';
    const penalty = SCORE_SAFE_SKIP * (1 + 0.5 * player.stats.skipStreak);
    applyScore(player, penalty);
    player.stats.skips++;
    player.stats.skipStreak++;
    outcome =
      player.stats.skipStreak === 1
        ? `${player.name} narrowly escaped punishment... Cupid's eye twitches. 😅`
        : player.stats.skipStreak === 2
          ? `${player.name} slips away from punishment. Cupid's patience wears thin... 😒`
          : `${player.name} dodges punishment again. Cupid is SEETHING! 😠`;
    // Safe skip from punishment goes to safe-skip screen
    return {
      phase: 'safe-skip',
      skipRollResult: result,
      latestOutcome: outcome,
      players: [...state.players],
    };
  } else if (roll < chances.safe + chances.punishment) {
    result = 'punishment';
    const roundLevel = getRoundLevel(state.currentRound);
    const finalLevel = getFinalLevel(player, roundLevel);
    const punishmentDetail = String(
      pickRandom((punishmentPrompts as any)[finalLevel] || PUNISHMENT_PROMPTS) ||
        'Cupid is thinking of an even WORSE punishment...'
    );
    applyScore(player, SCORE_PUNISHMENT * 1.5); // Worse penalty for skipping punishment
    player.stats.skips++;
    player.stats.skipStreak++;
    player.stats.punishments++;
    outcome =
      player.stats.skipStreak >= 3
        ? `Cupid.exe is ABSOLUTELY LIVID! 😈🔥\n\nYou think you can escape ME?!\n\n${punishmentDetail}`
        : `Cupid catches you! The punishment just got WORSE!\n\n${punishmentDetail}`;
    newPhase = 'punishment';
  } else {
    result = 'worseDare';
    const newLevel = Math.min(3, state.currentDareLevel + 1);
    const worsePunishment = String(
      pickRandom((punishmentPrompts as any)[newLevel] || PUNISHMENT_PROMPTS) ||
        'Cupid is thinking of an even WORSE punishment...'
    );
    player.stats.skips++;
    player.stats.skipStreak++;
    player.stats.punishments++;
    outcome =
      player.stats.skipStreak >= 3
        ? `Cupid.exe EXPLODES with rage! 🔥💀🔥\n\nYou've gone TOO FAR!\n\n${worsePunishment}`
        : `Cupid INTENSIFIES the punishment! 🔥\n\n${worsePunishment}`;
    // Stay in punishment phase with worse punishment
    return {
      skipRollResult: result,
      latestOutcome: outcome,
      latestDare: worsePunishment,
      players: [...state.players],
    };
  }

  return {
    phase: newPhase,
    skipRollResult: result,
    latestOutcome: outcome,
    players: [...state.players],
  };
};

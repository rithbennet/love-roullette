import { CHARACTERS } from '../data/characters';

export function getActivePlayerId(state: any): string | undefined {
  if (!state) {
    return undefined;
  }

  if (typeof state.activePlayerId === 'string') {
    return state.activePlayerId;
  }

  const active = state.activePlayer;
  if (typeof active === 'string') {
    return active;
  }

  if (active && typeof active === 'object' && typeof active.id === 'string') {
    return active.id;
  }

  return undefined;
}

export function getPlayerCharacterId(player: any): string | undefined {
  if (!player) {
    return undefined;
  }

  if (typeof player.characterId === 'string') {
    return player.characterId;
  }

  if (typeof player.character === 'string') {
    return player.character;
  }

  if (
    player.character &&
    typeof player.character === 'object' &&
    typeof player.character.id === 'string'
  ) {
    return player.character.id;
  }

  return undefined;
}

export function getCharacterById(characterId?: string) {
  if (!characterId) {
    return undefined;
  }

  return CHARACTERS.find((char) => char.id === characterId);
}

export function isPlayerSetupComplete(player: any): boolean {
  if (!player) {
    return false;
  }

  const name = typeof player.name === 'string' ? player.name.trim() : '';
  if (!name) {
    return false;
  }

  const characterId = getPlayerCharacterId(player);
  if (!characterId) {
    return false;
  }

  const crush = typeof player.crush === 'string' ? player.crush.trim() : '';
  if (!crush) {
    return false;
  }

  return true;
}

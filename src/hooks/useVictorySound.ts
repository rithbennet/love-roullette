import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

// Hook to play victory sound when game ends.
// Returns a function `playVictory` that will seek-to-start and play the victory sound.
export function useVictorySound(enabled = true, src?: any) {
  const source = src ?? require('../assets/sounds/victory.mp3');
  // Always call the audio hook (don't conditionally call hooks)
  const player = useAudioPlayer(source);

  const playVictory = useCallback(async () => {
    if (!enabled || !player) return;
    try {
      if (player.seekTo) await player.seekTo(0);
      await player.play();
    } catch (err) {
      // swallow - log for dev
      console.error('useVictorySound: error playing victory sound', err);
    }
  }, [player, enabled]);

  return playVictory;
}

// Note: intentionally only provide named export `useVictorySound` to keep imports explicit.

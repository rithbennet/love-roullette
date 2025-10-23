import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

// Simple hook to centralize click sound behavior.
// Returns a function `playClick` that will seek-to-start and play the short click sound.
export function useClickSound(enabled = true, src?: any) {
  const source = src ?? require('../assets/sounds/click-sound.mp3');
  // Always call the audio hook (don't conditionally call hooks)
  const player = useAudioPlayer(source);

  const playClick = useCallback(async () => {
    if (!enabled || !player) return;
    try {
      if (player.seekTo) await player.seekTo(0);
      await player.play();
    } catch (err) {
      // swallow - log for dev
      console.error('useClickSound: error playing click', err);
    }
  }, [player, enabled]);

  return playClick;
}

// Note: intentionally only provide named export `useClickSound` to keep imports explicit.

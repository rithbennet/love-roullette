import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

// Hook to play spin sound when roulette spins.
// Returns a function `playSpin` that will seek-to-start and play the spin sound.
export function useSpinSound(enabled = true, src?: any) {
  const source = src ?? require('../assets/sounds/spin.mp3');
  // Always call the audio hook (don't conditionally call hooks)
  const player = useAudioPlayer(source);

  const playSpin = useCallback(async () => {
    if (!enabled || !player) return;
    try {
      if (player.seekTo) await player.seekTo(0);
      await player.play();
    } catch (err) {
      // swallow - log for dev
      console.error('useSpinSound: error playing spin sound', err);
    }
  }, [player, enabled]);

  return playSpin;
}

// Note: intentionally only provide named export `useSpinSound` to keep imports explicit.

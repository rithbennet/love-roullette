import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useGameState } from '../core/gameStore';

// Global background music manager. Mount this once (for example in app/_layout)
// It observes `bgMusicEnabled` from the store and plays/stops the provided BGM asset.
export default function BgMusicProvider() {
    // IMPORTANT: hooks must be called unconditionally, so keep this mounted always
    const player = useAudioPlayer(require('../assets/sounds/bgm.mp3'));
    const enabled = useGameState((s) => !!s.bgMusicEnabled);

    useEffect(() => {
        let mounted = true;
        if (!player) return;

        (async () => {
            try {
                if (!mounted) return;

                if (enabled) {
                    // Try to ensure it loops where supported, then play from start
                    try {
                        // best-effort set looping (APIs vary)
                        if ((player as any).setIsLooping) {
                            // some implementations are sync
                            (player as any).setIsLooping(true);
                        }
                        if ((player as any).setIsLoopingAsync) {
                            await (player as any).setIsLoopingAsync(true);
                        }
                    } catch (err) {
                        // ignore if not supported
                        console.warn('setIsLooping not supported on player', err);
                    }

                    if ((player as any).seekTo) {
                        await (player as any).seekTo(0);
                    }

                    // Play (many expo-audio players provide a play() method)
                    if ((player as any).play) {
                        await (player as any).play();
                    }
                } else {
                    // Try to stop or pause when disabling
                    if ((player as any).stop) {
                        await (player as any).stop();
                    } else if ((player as any).pause) {
                        await (player as any).pause();
                    }
                }
            } catch (err) {
                // Log, but don't crash the app because audio is non-critical
                console.warn('BgMusicProvider audio error', err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [enabled, player]);

    return null;
}

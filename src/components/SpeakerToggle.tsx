import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../core/gameStore';
import { useClickSound } from '../hooks/useClickSound';

export function SpeakerToggle({ size = 26 }: { size?: number }) {
    const enabled = useGameState((s) => !!s.bgMusicEnabled);
    const toggle = useGameState((s) => s.toggleBgMusic);
    const playClick = useClickSound(true);

    const onPress = async () => {
        try {
            await playClick();
        } catch (err) {
            // ignore click sound errors
            console.warn('SpeakerToggle click sound error', err);
        }
        toggle(!enabled);
    };

    return (
        <Pressable onPress={onPress} className="p-2 rounded-md" accessibilityLabel={enabled ? 'Mute' : 'Unmute'}>
            <Ionicons name={enabled ? 'volume-high' : 'volume-mute'} size={size} color="#622135" />
        </Pressable>
    );
}

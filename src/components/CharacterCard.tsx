import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import type { Character } from '../data/characters';

type Props = {
    character: Character;
    selected?: boolean;
    onPress?: () => void;
};

export function CharacterCard({ character, selected, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <MotiView
                from={{ scale: 0.95, opacity: 0.9 }}
                animate={{ scale: selected ? 1.05 : 1, opacity: selected ? 1 : 0.95 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{
                    width: 120,
                    height: 150,
                    borderRadius: 12,
                    backgroundColor: selected ? '#fff4f4' : '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 8,
                    borderWidth: selected ? 2 : 1,
                    borderColor: selected ? '#622135' : '#eee',
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                }}

            >
                <Image source={character.asset} style={{ width: 88, height: 88, resizeMode: 'contain' }} />
                <Text style={{ marginTop: 8, color: '#622135', fontWeight: '700' }}>{character.name}</Text>
            </MotiView>
        </TouchableOpacity>
    );
}

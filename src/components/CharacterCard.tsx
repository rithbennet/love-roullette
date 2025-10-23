import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import { MotiView } from 'moti';
import type { Character } from '@/data/characters';

type Props = {
    character: Character;
    selected?: boolean;
    onPress?: () => void;
    size?: number; // ✅ <— new prop to control avatar size
};

export default function CharacterCard({
    character,
    selected,
    onPress,
    size = 120, // ✅ smaller default size
}: Props) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <MotiView
                from={{ scale: 0.95, opacity: 0.95 }}
                animate={{
                    scale: selected ? 1.05 : 1,
                    opacity: selected ? 1 : 0.9,
                }}
                transition={{ type: 'spring', damping: 12 }}
            >
                <View
                    style={{
                        width: size,
                        height: size * 1.1, // keeps slightly taller ratio
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selected ? '#fff4f4' : '#fff',
                        borderWidth: selected ? 2 : 1,
                        borderColor: selected ? '#622135' : '#ccc',
                        shadowColor: '#622135',
                        shadowOpacity: 0.15,
                        shadowOffset: { width: 0, height: 3 },
                        shadowRadius: 4,
                    }}
                >
                    <Image
                        source={character.asset}
                        style={{
                            width: size * 0.7,
                            height: size * 0.7,
                            resizeMode: 'contain',
                        }}
                    />
                    <Text
                        style={{
                            marginTop: 4,
                            color: '#622135',
                            fontWeight: '700',
                            fontSize: 14,
                        }}
                    >
                        {character.name}
                    </Text>
                </View>
            </MotiView>
        </TouchableOpacity>
    );
}
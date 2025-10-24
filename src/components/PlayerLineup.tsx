import React from 'react';
import { View, Image, Text } from 'react-native';
import { useGameState } from '../core/gameStore';

const MASCOT_BODIES = [
    require('../assets/mascots/victim1.png'),
    require('../assets/mascots/victim2.png'),
    require('../assets/mascots/victim3.png'),
    require('../assets/mascots/victim4.png'),
    require('../assets/mascots/victim5.png'),
];

const MAX_PLAYERS = 5;

interface PlayerLineupProps {
    maxVisible?: number;
}

export default function PlayerLineup({ maxVisible = 5 }: PlayerLineupProps) {
    const players = useGameState((state) => state.players);

    if (players.length === 0) {
        return null;
    }

    const visiblePlayers = players.slice(0, maxVisible);
    const remainingCount = Math.max(0, players.length - maxVisible);

    return (
        <View className="flex-row items-center justify-center gap-2 py-3">
            {visiblePlayers.map((player, idx) => {
                const avatarIndex = parseInt(player.characterId.split('-')[1] || '0');
                return (
                    <View
                        key={player.id}
                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#622135] bg-white"
                        style={{
                            shadowColor: '#622135',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                    >
                        <Image
                            source={MASCOT_BODIES[avatarIndex % MASCOT_BODIES.length]}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                );
            })}
            {remainingCount > 0 && (
                <View className="w-12 h-12 rounded-full bg-[#622135] items-center justify-center">
                    <Text className="text-white text-sm font-bold">+{remainingCount}</Text>
                </View>
            )}
            <View className="ml-1">
                <Text className="text-[#622135] text-sm font-bold">
                    {players.length}/{MAX_PLAYERS}
                </Text>
                <Text className="text-[#622135] text-xs italic">Players</Text>
            </View>
        </View>
    );
}

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameState } from '../../src/core/gameStore';
import { Button } from '@/components';
import { MotiView } from 'moti';

const MASCOT_BODIES = [
    require('../../src/assets/mascots/victim1.png'),
    require('../../src/assets/mascots/victim2.png'),
    require('../../src/assets/mascots/victim3.png'),
    require('../../src/assets/mascots/victim4.png'),
    require('../../src/assets/mascots/victim5.png'),
];

const DARING_LEVELS = [
    { level: 1, emoji: '🔥', label: 'Mild' },
    { level: 2, emoji: '🔥🔥', label: 'Spicy' },
    { level: 3, emoji: '🔥🔥🔥', label: 'Wild' },
] as const;

const MAX_PLAYERS = 5;
const MIN_PLAYERS = 2;

export default function ReviewPlayersScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const removePlayer = useGameState((state) => state.removePlayer);
    const setTotalRounds = useGameState((state) => state.setTotalRounds);

    const [rounds, setRounds] = useState(5);

    const handleAddAnother = useCallback(() => {
        if (players.length >= MAX_PLAYERS) {
            Alert.alert('Max Players Reached', `You can only have up to ${MAX_PLAYERS} players.`);
            return;
        }
        router.push('/(add-players)');
    }, [players.length, router]);

    const handleRemovePlayer = useCallback((id: string, name: string) => {
        Alert.alert(
            'Remove Player',
            `Are you sure you want to remove ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removePlayer(id),
                },
            ]
        );
    }, [removePlayer]);

    const handleContinue = useCallback(() => {
        if (players.length < MIN_PLAYERS) {
            Alert.alert('Not Enough Players', `You need at least ${MIN_PLAYERS} players to start.`);
            return;
        }
        setTotalRounds(rounds);
        router.push('/pregame');
    }, [players.length, rounds, setTotalRounds, router]);

    const handleRoundsChange = useCallback((delta: number) => {
        setRounds((prev) => Math.max(1, Math.min(20, prev + delta)));
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#ffa8a8]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 24 }}
                bounces={false}
            >
                <View className="px-6 pt-6">
                    {/* Header */}
                    <Text className="text-[34px] font-bold text-[#622135] leading-[34px] mb-2">
                        Love Lineup
                    </Text>
                    <Text className="text-[16px] text-[#622135] italic mb-6">
                        Review your players and set rounds
                    </Text>

                    {/* Player Cards */}
                    <View className="gap-3 mb-6">
                        {players.map((player, index) => {
                            const avatarIndex = parseInt(player.characterId.split('-')[1] || '0');
                            const daringInfo = DARING_LEVELS.find((d) => d.level === player.daringLevel);

                            return (
                                <MotiView
                                    key={player.id}
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 300, delay: index * 100 }}
                                >
                                    <View
                                        className="bg-white rounded-2xl p-4 border-2 border-[#622135]"
                                        style={{
                                            shadowColor: '#622135',
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 4,
                                        }}
                                    >
                                        <View className="flex-row items-center">
                                            {/* Avatar */}
                                            <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#622135] mr-4">
                                                <Image
                                                    source={MASCOT_BODIES[avatarIndex % MASCOT_BODIES.length]}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            </View>

                                            {/* Player Info */}
                                            <View className="flex-1">
                                                <Text className="text-xl font-bold text-[#622135] mb-1">
                                                    {player.name}
                                                </Text>
                                                <View className="flex-row items-center gap-2">
                                                    <Text className="text-sm">{daringInfo?.emoji}</Text>
                                                    <Text className="text-sm text-[#622135]/70">
                                                        {daringInfo?.label}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Remove Button */}
                                            <Button
                                                onPress={() => handleRemovePlayer(player.id, player.name)}
                                                className="bg-red-50 border border-red-300 rounded-lg px-3 py-2"
                                            >
                                                <Text className="text-red-600 text-sm font-bold">✕</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </MotiView>
                            );
                        })}
                    </View>

                    {/* Add Another Player Button */}
                    <Button
                        onPress={handleAddAnother}
                        isDisabled={players.length >= MAX_PLAYERS}
                        className={`rounded-xl py-3 px-4 border-2 border-[#622135] mb-6 ${players.length >= MAX_PLAYERS ? 'bg-gray-300' : 'bg-[#fff0f4]'
                            }`}
                        style={{
                            shadowColor: '#622135',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                        }}
                    >
                        <Text
                            className={`text-center text-lg font-bold ${players.length >= MAX_PLAYERS ? 'text-gray-500' : 'text-[#622135]'
                                }`}
                        >
                            {players.length >= MAX_PLAYERS
                                ? '✓ Max Players Reached'
                                : '+ Add Another Player'}
                        </Text>
                    </Button>

                    {/* Rounds Selector */}
                    <View className="bg-[#fff0f4] rounded-2xl p-6 border-2 border-[#622135] mb-6">
                        <Text className="text-xl font-bold text-[#622135] mb-4 text-center">
                            Number of Rounds
                        </Text>
                        <View className="flex-row items-center justify-center gap-6">
                            <Button
                                onPress={() => handleRoundsChange(-1)}
                                className="w-12 h-12 bg-white border-2 border-[#622135] rounded-full items-center justify-center"
                            >
                                <Text className="text-2xl text-[#622135] font-bold">−</Text>
                            </Button>

                            <View className="bg-white border-2 border-[#622135] rounded-xl px-8 py-3">
                                <Text className="text-3xl font-bold text-[#622135] text-center">
                                    {rounds}
                                </Text>
                            </View>

                            <Button
                                onPress={() => handleRoundsChange(1)}
                                className="w-12 h-12 bg-white border-2 border-[#622135] rounded-full items-center justify-center"
                            >
                                <Text className="text-2xl text-[#622135] font-bold">+</Text>
                            </Button>
                        </View>
                    </View>

                    {/* Continue Button */}
                    <Button
                        onPress={handleContinue}
                        isDisabled={players.length < MIN_PLAYERS}
                        className={`rounded-xl py-4 px-6 border-2 border-[#622135] ${players.length >= MIN_PLAYERS ? 'bg-[#e6f7ff]' : 'bg-gray-300'
                            }`}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 5, height: 7 },
                            shadowOpacity: 0.25,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                    >
                        <Text
                            className={`text-center text-2xl italic font-bold ${players.length >= MIN_PLAYERS ? 'text-[#622135]' : 'text-gray-500'
                                }`}
                        >
                            {players.length < MIN_PLAYERS
                                ? `Need ${MIN_PLAYERS - players.length} More Player${MIN_PLAYERS - players.length > 1 ? 's' : ''}`
                                : "Let's Play! 💘"}
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

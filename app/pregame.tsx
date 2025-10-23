import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function PreGameScreen() {
    const router = useRouter();
    const totalRounds = useGameState((state) => state.totalRounds);
    const players = useGameState((state) => state.players);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView className="flex-1 bg-rose-950">
            <View className="flex-1 justify-between px-6 py-10">
                {/* Header */}
                <View className="items-center gap-4">
                    <Text className="text-6xl">💘</Text>
                    <Text className="text-4xl font-bold text-rose-50 text-center">
                        Get Ready!
                    </Text>
                    <Text className="text-base text-rose-300 text-center">
                        Cupid is locking targets...
                    </Text>
                </View>

                {/* Game Info */}
                <View className="flex-1 justify-center gap-6 px-4">
                    <View className="rounded-3xl bg-rose-900/40 p-6 gap-4">
                        <Text className="text-lg font-semibold text-rose-100 text-center">
                            Game Summary
                        </Text>

                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-base text-rose-300">Total Rounds:</Text>
                                <Text className="text-lg font-semibold text-rose-50">{totalRounds}</Text>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-base text-rose-300">Players:</Text>
                                <Text className="text-lg font-semibold text-rose-50">{players.length}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="rounded-2xl bg-rose-800/30 p-5">
                        <Text className="text-sm text-rose-200 text-center leading-5">
                            🎯 Each round, Cupid will select a player and give them a daring challenge.{'\n\n'}
                            ✅ Accept to prove your courage and share the proof!{'\n\n'}
                            ❌ Decline and face a punishment instead!
                        </Text>
                    </View>

                    {/* Player List */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-rose-400 text-center mb-2">
                            Players in this round:
                        </Text>
                        {players.map((player) => (
                            <View
                                key={player.id}
                                className="flex-row items-center justify-center gap-2"
                            >
                                <Text className="text-base text-rose-200">•</Text>
                                <Text className="text-base text-rose-100">{player.name}</Text>
                                {player.crush && player.crush !== 'Unknown' && (
                                    <Text className="text-sm text-rose-400">💘 {player.crush}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Action Button */}
                <View>
                    <Pressable
                        onPress={handleContinue}
                        className="rounded-full bg-rose-500 active:bg-rose-600 py-4"
                    >
                        <Text className="text-center text-lg font-semibold text-rose-50">
                            Let&apos;s Go! 🚀
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
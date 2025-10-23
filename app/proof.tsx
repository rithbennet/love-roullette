import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function ProofPhaseScreen() {
    const router = useRouter();
    const currentRound = useGameState((state) => state.currentRound);
    const totalRounds = useGameState((state) => state.totalRounds);
    const activePlayer = useGameState((state) => state.activePlayer);
    const latestOutcome = useGameState((state) => state.latestOutcome);
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
                <View className="items-center gap-2">
                    <Text className="text-sm text-rose-400">Round {currentRound} of {totalRounds}</Text>
                    <Text className="text-4xl font-bold text-rose-50 text-center">
                        Proof Time! 📸
                    </Text>
                    <Text className="text-base text-rose-300">
                        {activePlayer ? `${activePlayer.name} accepted the dare!` : 'Show us the proof!'}
                    </Text>
                </View>

                {/* Proof Card */}
                <View className="flex-1 justify-center px-4">
                    <View className="rounded-3xl bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 p-8 border-2 border-emerald-700/50">
                        <View className="items-center mb-6">
                            <Text className="text-7xl mb-2">✅</Text>
                            <Text className="text-lg font-semibold text-emerald-200">Challenge Accepted!</Text>
                        </View>

                        <Text className="text-lg text-emerald-50 text-center leading-6 mb-4">
                            {latestOutcome ?? 'Awaiting proof summary...'}
                        </Text>

                        <View className="mt-4 p-4 rounded-xl bg-emerald-950/40">
                            <Text className="text-sm text-emerald-300 text-center">
                                📸 Time to show everyone what went down! Share your photo or video proof with the group.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Button */}
                <View className="gap-4">
                    <Pressable
                        onPress={handleContinue}
                        className="rounded-full bg-rose-500 active:bg-rose-600 py-4"
                    >
                        <Text className="text-center text-lg font-semibold text-rose-50">
                            Continue to Next Round
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
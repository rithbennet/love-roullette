import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function PunishmentScreen() {
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
                        Punishment Time! 💀
                    </Text>
                    <Text className="text-base text-rose-300">
                        {activePlayer
                            ? `${activePlayer.name} chickened out...`
                            : 'Time to face the consequences!'}
                    </Text>
                </View>

                {/* Punishment Card */}
                <View className="flex-1 justify-center px-4">
                    <View className="rounded-3xl bg-gradient-to-br from-red-900/60 to-red-800/40 p-8 border-2 border-red-700/50">
                        <View className="items-center mb-6">
                            <Text className="text-7xl mb-2">⚠️</Text>
                            <Text className="text-lg font-semibold text-red-200">Consequences Incoming</Text>
                        </View>

                        <Text className="text-lg text-red-50 text-center leading-6 mb-4">
                            {latestOutcome ?? 'Awaiting punishment details...'}
                        </Text>

                        <View className="mt-4 p-4 rounded-xl bg-red-950/40">
                            <Text className="text-sm text-red-300 text-center">
                                🔥 No backing out now! Complete your punishment to continue the game.
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
                            Punishment Complete
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function DareRoundScreen() {
    const router = useRouter();
    const currentRound = useGameState((state) => state.currentRound);
    const totalRounds = useGameState((state) => state.totalRounds);
    const activePlayer = useGameState((state) => state.activePlayer);
    const latestDare = useGameState((state) => state.latestDare);
    const skipRollResult = useGameState((state) => state.skipRollResult);
    const latestOutcome = useGameState((state) => state.latestOutcome);
    const acceptDare = useGameState((state) => state.acceptDare);
    const skipDare = useGameState((state) => state.skipDare);

    const handleAccept = useCallback(() => {
        acceptDare();
        router.replace(getRouteForPhase(useGameState.getState().phase));
    }, [acceptDare, router]);

    const handleSkip = useCallback(() => {
        skipDare();
        const { skipRollResult } = useGameState.getState();
        // If worse dare, stay on this screen
        if (skipRollResult !== 'worseDare') {
            router.replace(getRouteForPhase(useGameState.getState().phase));
        }
    }, [skipDare, router]);

    // Show skip result if it was "worse dare"
    const showSkipResult = skipRollResult === 'worseDare' && latestOutcome;

    return (
        <SafeAreaView className="flex-1 bg-rose-950">
            <View className="flex-1 justify-between px-6 py-10">
                {/* Header */}
                <View className="items-center gap-2">
                    <Text className="text-sm text-rose-400">
                        Round {currentRound} of {totalRounds}
                    </Text>
                    <Text className="text-4xl font-bold text-rose-50 text-center">
                        {activePlayer ? activePlayer.name : 'TBD'}
                    </Text>
                    <Text className="text-base text-rose-300">Cupid has a dare for you... 💘</Text>
                    {activePlayer?.stats.skipStreak > 0 && (
                        <Text className="text-sm text-orange-400">
                            ⚠️ Skip Streak: {activePlayer.stats.skipStreak}
                        </Text>
                    )}
                </View>

                {/* Dare Card */}
                <View className="flex-1 justify-center px-4">
                    {showSkipResult && (
                        <View className="rounded-2xl bg-orange-900/60 p-4 mb-4 border border-orange-700">
                            <Text className="text-base text-orange-100 text-center">{latestOutcome}</Text>
                        </View>
                    )}

                    <View className="rounded-3xl bg-gradient-to-br from-rose-900/60 to-rose-800/40 p-8 border-2 border-rose-700/50">
                        <View className="items-center mb-4">
                            <Text className="text-6xl mb-2">🎯</Text>
                            <Text className="text-lg font-semibold text-rose-200">Your Dare</Text>
                        </View>

                        <Text className="text-xl text-rose-50 text-center leading-7">
                            {latestDare ?? 'Waiting for dare generation...'}
                        </Text>

                        {activePlayer?.crush && activePlayer.crush !== 'Unknown' && (
                            <View className="mt-6 pt-4 border-t border-rose-700/30">
                                <Text className="text-sm text-rose-400 text-center">
                                    💘 Target: {activePlayer.crush}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-4">
                    <Text className="text-center text-sm text-rose-400 mb-2">
                        Will you take the challenge?
                    </Text>

                    <Pressable
                        onPress={handleAccept}
                        className="rounded-full bg-rose-500 active:bg-rose-600 py-4"
                    >
                        <Text className="text-center text-lg font-semibold text-rose-50">
                            ✅ Accept Dare
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleSkip}
                        className="rounded-full bg-rose-900/60 active:bg-rose-800/60 py-4 border border-rose-700"
                    >
                        <Text className="text-center text-lg font-semibold text-rose-300">
                            🎲 Skip (Roll Cupid&apos;s Fate)
                        </Text>
                    </Pressable>

                    {activePlayer && activePlayer.stats.skipStreak >= 4 && (
                        <Text className="text-center text-xs text-red-400">
                            ⚠️ Warning: Cupid is WRATHFUL! Safe skip impossible!
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
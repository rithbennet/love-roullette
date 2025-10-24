import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { Button } from '../src/components/Button';

export default function PreGameScreen() {
    const router = useRouter();
    const totalRounds = useGameState((state) => state.totalRounds);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFA3A3', '#FFE2E2', '#FFC2DD']}
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <View className="flex-1 justify-between px-6 py-10">
                    {/* Header */}
                    <View className="items-center mb-6">
                        <Text className="text-6xl mb-4">💘</Text>
                        <Text
                            className="text-3xl font-bold text-center"
                            style={{
                                color: '#622135',
                                textShadowColor: 'rgba(230, 230, 230, 0.46)',
                                textShadowOffset: { width: 0, height: 4 },
                                textShadowRadius: 5,
                            }}
                        >
                            How to Play
                        </Text>
                    </View>

                    {/* Instructions */}
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="bg-white/30 rounded-3xl p-6 mb-4">
                            <View className="mb-6">
                                <Text className="text-xl font-bold text-[#622135] mb-2">
                                    🎯 The Goal
                                </Text>
                                <Text className="text-base text-[#622135] leading-6">
                                    Earn the most points by completing dares and proving your courage in {totalRounds} rounds of love and chaos!
                                </Text>
                            </View>

                            <View className="mb-6">
                                <Text className="text-xl font-bold text-[#622135] mb-2">
                                    🎡 How It Works
                                </Text>
                                <Text className="text-base text-[#622135] leading-6 mb-2">
                                    • Cupid&apos;s roulette selects a player each round
                                </Text>
                                <Text className="text-base text-[#622135] leading-6 mb-2">
                                    • Accept the dare or skip for a worse one
                                </Text>
                                <Text className="text-base text-[#622135] leading-6 mb-2">
                                    • Prove you completed it to the group
                                </Text>
                                <Text className="text-base text-[#622135] leading-6">
                                    • Fail and face a punishment!
                                </Text>
                            </View>

                            <View className="mb-6">
                                <Text className="text-xl font-bold text-[#622135] mb-2">
                                    ⚠️ Skip at Your Risk
                                </Text>
                                <Text className="text-base text-[#622135] leading-6">
                                    Skipping gives you a 50% chance of getting an even worse dare. Or you might get lucky and skip safely!
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xl font-bold text-[#622135] mb-2">
                                    🎊 Random Events
                                </Text>
                                <Text className="text-base text-[#622135] leading-6">
                                    Expect the unexpected! Cupid might throw in surprise twists to keep things interesting.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Buttons */}
                    <View className="gap-3 mt-4">
                        <Button onPress={handleContinue} variant="secondary">
                            Let&apos;s Play!
                        </Button>
                        <Button onPress={handleBack} variant="secondary">
                            Back
                        </Button>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
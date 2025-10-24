import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { Button } from '../src/components/Button';

export default function SafeSkipScreen() {
    const router = useRouter();
    const activePlayer = useGameState((state) => state.activePlayer);
    const latestOutcome = useGameState((state) => state.latestOutcome);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#A8E6CF', '#DCEDC8', '#F0F4C3']}
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <View className="flex-1 justify-between px-5 py-10">
                    {/* Header */}
                    <View className="items-center">
                        <Text
                            className="text-[34px] font-bold text-center leading-[39px]"
                            style={{
                                color: '#2E7D32',
                                letterSpacing: 0.374,
                            }}
                        >
                            You&apos;re Safe!
                        </Text>
                        {activePlayer?.name && (
                            <Text
                                className="text-[24px] font-semibold text-center mt-2"
                                style={{ color: '#2E7D32' }}
                            >
                                {activePlayer.name}
                            </Text>
                        )}
                    </View>

                    {/* Safe message */}
                    <View className="flex-1 items-center justify-center">
                        <View className="items-center mb-8">
                            <Text className="text-[120px] mb-4">✅</Text>
                            <Text className="text-[80px]">🎉</Text>
                        </View>

                        <View
                            className="w-full rounded-3xl px-6 py-8"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderWidth: 2,
                                borderColor: 'rgba(46, 125, 50, 0.3)',
                            }}
                        >
                            <Text
                                className="text-[28px] font-bold text-center leading-[36px]"
                                style={{
                                    color: '#2E7D32',
                                    letterSpacing: 0.3,
                                }}
                            >
                                {latestOutcome ||
                                    'Cupid decided to spare you this time... 😅'}
                            </Text>
                        </View>
                    </View>

                    {/* Continue Button */}
                    <View className="pb-5">
                        <Button
                            onPress={handleContinue}
                            variant="secondary"
                            backgroundColor="#C8E6C9"
                            borderColor="#2E7D32"
                            textColor="#2E7D32"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 6,
                            }}
                        >
                            Continue to Next Round
                        </Button>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

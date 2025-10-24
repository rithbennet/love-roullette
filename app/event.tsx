import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { Button } from '../src/components';

export default function RandomEventScreen() {
    const router = useRouter();
    const currentRound = useGameState((state) => state.currentRound);
    const totalRounds = useGameState((state) => state.totalRounds);
    const latestEvent = useGameState((state) => state.latestEvent);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFA8A8', '#FFCBCB', '#FFA8A8']}
                locations={[0, 0.173, 1]}
                style={{ flex: 1 }}
            >
                {/* Fixed Header */}
                <View className="pt-6 pb-4 px-5">
                    <Text
                        className="text-sm text-center mb-1"
                        style={{
                            color: '#622135',
                            opacity: 0.7,
                        }}
                    >
                        Round {currentRound} of {totalRounds}
                    </Text>
                    <Text
                        className="text-[28px] font-bold text-center"
                        style={{
                            color: '#622135',
                            letterSpacing: 0.374,
                        }}
                    >
                        Random Event! ⚡
                    </Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Glitch Mascot */}
                    <View className="items-center mb-6">
                        <Image
                            source={require('../src/assets/mascots/cupid.png')}
                            style={{ width: 180, height: 137 }}
                            resizeMode="contain"
                        />
                        <Text
                            className="text-base mt-2"
                            style={{
                                color: '#8B3A52',
                            }}
                        >
                            Cupid.exe encountered a glitch...
                        </Text>
                    </View>

                    {/* Event Card */}
                    <View className="mb-6">
                        {/* Layered background effect */}
                        <View
                            className="absolute w-full h-full rounded-3xl"
                            style={{
                                backgroundColor: '#FEECF1',
                                transform: [{ translateX: -8 }, { translateY: -6 }],
                            }}
                        />
                        <View
                            className="absolute w-full h-full rounded-3xl"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.49)',
                            }}
                        />

                        {/* Event Content */}
                        <View
                            className="bg-white rounded-3xl p-6 min-h-[280px] justify-center"
                            style={{
                                shadowColor: '#622135',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className="items-center mb-4">
                                <Text className="text-6xl mb-2">🎲</Text>
                                <Text
                                    className="text-lg font-semibold"
                                    style={{ color: '#8B3A52' }}
                                >
                                    Plot Twist!
                                </Text>
                            </View>

                            <Text
                                className="text-[22px] font-bold text-center leading-[30px] mb-4"
                                style={{
                                    color: '#622135',
                                    letterSpacing: 0.2,
                                }}
                            >
                                {latestEvent ?? 'Cupid.exe is thinking...'}
                            </Text>

                            <View
                                className="mt-2 p-3 rounded-xl"
                                style={{
                                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                }}
                            >
                                <Text
                                    className="text-sm text-center"
                                    style={{ color: '#8B3A52' }}
                                >
                                    ✨ Resolve this mysterious event before continuing!
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Fixed Action Button */}
                <View className="px-5 pb-6 pt-4">
                    <Button onPress={handleContinue} variant="secondary">
                        Continue Game 💘
                    </Button>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { IconButton } from '../src/components';

export default function DareRoundScreen() {
    const router = useRouter();
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
        if (skipRollResult !== 'worseDare') {
            router.replace(getRouteForPhase(useGameState.getState().phase));
        }
    }, [skipDare, router]);

    const showSkipResult = skipRollResult === 'worseDare' && latestOutcome;

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
                        className="text-[28px] font-bold text-center"
                        style={{
                            color: '#622135',
                            letterSpacing: 0.374,
                        }}
                    >
                        Cupid says...
                    </Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Skip Result Alert */}
                    {showSkipResult && (
                        <View className="rounded-xl bg-orange-100 p-4 mb-4 border-2 border-orange-400">
                            <View className="flex-row items-center gap-2 mb-2">
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={20}
                                    color="#9A3412"
                                />
                                <Text className="text-base text-orange-900 font-bold">
                                    Oh no!
                                </Text>
                            </View>
                            <Text className="text-sm text-orange-800">
                                {latestOutcome}
                            </Text>
                        </View>
                    )}

                    {/* Cupid Character */}
                    <View className="items-center mb-6">
                        <Image
                            source={require('../src/assets/mascots/cupid.png')}
                            style={{ width: 180, height: 137 }}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Dare Card */}
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

                        {/* Dare Content */}
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
                            <Text
                                className="text-[26px] font-bold text-center leading-[34px]"
                                style={{
                                    color: '#622135',
                                    letterSpacing: 0.2,
                                }}
                            >
                                {latestDare ??
                                    'Waiting for dare generation...'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Fixed Action Buttons */}
                <View className="px-5 pb-6 pt-4">
                    <View className="flex-row gap-3 justify-center">
                        {/* Skip Button */}
                        <View className="flex-1 max-w-[160px] items-center">
                            <IconButton
                                onPress={handleSkip}
                                backgroundColor="rgba(239, 68, 68, 0.15)"
                                borderColor="rgba(239, 68, 68, 0.3)"
                                size={96}
                            >
                                <MaterialCommunityIcons
                                    name="flag-variant"
                                    size={40}
                                    color="#DC2626"
                                />
                            </IconButton>
                            <Text
                                className="text-base font-bold mt-3"
                                style={{ color: '#622135' }}
                            >
                                Skip
                            </Text>
                        </View>

                        {/* Accept Button */}
                        <View className="flex-1 max-w-[160px] items-center">
                            <IconButton
                                onPress={handleAccept}
                                backgroundColor="rgba(236, 72, 153, 0.15)"
                                borderColor="rgba(236, 72, 153, 0.3)"
                                size={96}
                            >
                                <MaterialCommunityIcons
                                    name="heart-multiple"
                                    size={42}
                                    color="#DB2777"
                                />
                            </IconButton>
                            <Text
                                className="text-base font-bold mt-3"
                                style={{ color: '#622135' }}
                            >
                                Accept
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
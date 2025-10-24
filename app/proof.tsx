import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { Button } from '../src/components/Button';

// Import character head assets
const HEAD_ASSETS = [
    require('../src/assets/mascots/head/victim-head-1.png'),
    require('../src/assets/mascots/head/victim-head-2.png'),
    require('../src/assets/mascots/head/victim-head-3.png'),
    require('../src/assets/mascots/head/victim-head-4.png'),
    require('../src/assets/mascots/head/victime-head-5.png'),
];

export default function ProofPhaseScreen() {
    const router = useRouter();
    const activePlayer = useGameState((state) => state.activePlayer);
    const players = useGameState((state) => state.players);
    const skipRollResult = useGameState((state) => state.skipRollResult);
    const markProofValid = useGameState((state) => state.markProofValid);
    const nextPhase = useGameState((state) => state.nextPhase);
    const skipDare = useGameState((state) => state.skipDare);

    const handleGroupAccepts = useCallback(() => {
        // Mark proof as valid, then advance the game phase (so we don't stay on proof)
        markProofValid();
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [markProofValid, nextPhase, router]);

    const handleFake = useCallback(() => {
        Alert.alert(
            'Proof Rejected!',
            'The group has deemed this proof fake. Time for the punishment!',
            [
                {
                    text: 'Continue',
                    onPress: () => {
                        // Treat as skip/decline - go to punishment
                        skipDare();
                        const { phase: updatedPhase } = useGameState.getState();
                        router.replace(getRouteForPhase(updatedPhase));
                    },
                },
            ]
        );
    }, [skipDare, router]);

    // Get active player's head asset safely
    const activePlayerIndex = Math.max(
        0,
        players.findIndex((p) => p.id === activePlayer?.id)
    );
    const headAsset = HEAD_ASSETS[activePlayerIndex % HEAD_ASSETS.length];

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFA3A3', '#FFE2E2', '#FFC2DD']}
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <View className="flex-1 justify-between px-5 py-10">
                    {/* Header */}
                    <View className="items-center">
                        <Text
                            className="text-[34px] font-bold text-center leading-[39px]"
                            style={{
                                color: '#622135',
                                letterSpacing: 0.374,
                            }}
                        >
                            Is It True?
                        </Text>
                        {activePlayer?.name && (
                            <Text
                                className="text-[24px] font-semibold text-center mt-2"
                                style={{ color: '#622135' }}
                            >
                                {activePlayer.name}
                            </Text>
                        )}
                    </View>

                    {/* Character with Heart */}
                    <View className="flex-1 items-center justify-center -mt-8">
                        {/* If a skip failed and produced a worse dare, show an indicator */}
                        {skipRollResult === 'worseDare' && (
                            <View
                                className="w-full mb-4 rounded-2xl px-4 py-3"
                                style={{
                                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                                    borderWidth: 2,
                                    borderColor: 'rgba(152, 33, 53, 0.3)',
                                }}
                            >
                                <Text
                                    className="text-base font-bold text-center"
                                    style={{ color: '#622135', letterSpacing: 0.3 }}
                                >
                                    You failed to skip — Your new dare 😈
                                </Text>
                            </View>
                        )}
                        <View className="relative items-center">
                            {/* Character Circle */}
                            <View
                                className="w-[267px] h-[239px] rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: '#D88B6F',
                                }}
                            >
                                <Image
                                    source={headAsset}
                                    style={{ width: 200, height: 200 }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Heart Icon */}
                            <View
                                className="absolute bottom-8 right-0 w-[94px] h-[94px] items-center justify-center"
                                style={{
                                    shadowColor: '#fff',
                                    shadowOffset: { width: -8, height: -3 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                }}
                            >
                                <Text className="text-[70px]">💗</Text>
                            </View>
                        </View>

                        {/* Question Text */}
                        <Text
                            className="text-[34px] font-bold text-center leading-[42px] mt-8"
                            style={{
                                color: '#622135',
                                letterSpacing: 0.374,
                            }}
                        >
                            Sooo… did they{'\n'}text back? 👀
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3 pb-5">
                        <Button
                            onPress={handleGroupAccepts}
                            variant="secondary"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 5, height: 7 },
                                shadowOpacity: 0.25,
                                shadowRadius: 5,
                            }}
                        >
                            Group accepts
                        </Button>
                        <Button
                            onPress={handleFake}
                            variant="secondary"
                            borderColor="#020202"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 5, height: 7 },
                                shadowOpacity: 0.25,
                                shadowRadius: 5,
                            }}
                        >
                            Fake
                        </Button>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
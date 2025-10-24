import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image } from 'react-native';
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

export default function PunishmentScreen() {
    const router = useRouter();
    const latestOutcome = useGameState((state) => state.latestOutcome);
    const activePlayer = useGameState((state) => state.activePlayer);
    const players = useGameState((state) => state.players);
    const nextPhase = useGameState((state) => state.nextPhase);

    // Get active player's head asset
    const activePlayerIndex = Math.max(
        0,
        players.findIndex((p) => p.id === activePlayer?.id)
    );
    const headAsset = HEAD_ASSETS[activePlayerIndex % HEAD_ASSETS.length];

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFA8A8', '#FF6565', '#471D1D']}
                locations={[0, 0.135, 1]}
                style={{ flex: 1 }}
            >
                {/* Blood splatter background */}
                <Image
                    source={require('../src/assets/prison/blood-spatter.png')}
                    className="absolute -top-8 -left-[91px] w-[606px] h-[606px] opacity-[0.21]"
                    resizeMode="cover"
                />

                <View className="flex-1 px-5">
                    {/* Header */}
                    <View className="items-center pt-[72px]">
                        <Text
                            className="text-[34px] font-bold text-center w-[279px]"
                            style={{
                                color: '#020202',
                                letterSpacing: 0.374,
                                lineHeight: 31,
                            }}
                        >
                            Punishment time
                        </Text>
                    </View>

                    {/* Prison bars with character - Fixed position container */}
                    <View className="absolute left-0 right-0 items-center" style={{ top: 200 }}>
                        <View className="relative items-center justify-center">
                            {/* Character behind bars with backdrop circle */}
                            <View
                                className="absolute items-center justify-center"
                                style={{ width: 200, height: 200, zIndex: 1 }}
                            >
                                <View
                                    className="absolute w-[200px] h-[200px] rounded-full"
                                    style={{
                                        backgroundColor: '#CD8773',
                                        opacity: 0.9,
                                    }}
                                />
                                <Image
                                    source={headAsset}
                                    style={{
                                        width: 160,
                                        height: 160,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>

                            {/* Prison bars overlay */}
                            <Image
                                source={require('../src/assets/prison/bars.png')}
                                style={{
                                    width: 260,
                                    height: 260,
                                    resizeMode: 'contain',
                                    zIndex: 2,
                                }}
                            />
                        </View>
                    </View>

                    {/* Devil mascot - Behind everything */}
                    <View className="absolute right-3 top-[100px]" style={{ zIndex: 2 }}>
                        <Image
                            source={require('../src/assets/prison/devil.png')}
                            className="w-[224px] h-[202px]"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Punishment Text - Fixed position with controlled height */}
                    <View
                        className="absolute left-0 right-0 items-center px-10"
                        style={{ top: 550, height: 120 }}
                    >
                        <Text
                            className="text-[28px] font-bold text-center"
                            style={{
                                color: '#B26D6D',
                                letterSpacing: 0.374,
                                lineHeight: 34,
                            }}
                            numberOfLines={3}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {latestOutcome || '[Punishment here]'}
                        </Text>
                    </View>

                    {/* Action Button - Fixed position at bottom */}
                    <View className="absolute left-5 right-5 bottom-[50px]">
                        <Button
                            onPress={handleContinue}
                            variant="secondary"
                            backgroundColor="#020202"
                            borderColor="#B26D6D"
                            textColor="#B26D6D"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                            }}
                        >
                            FORGIVE ME!
                        </Button>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
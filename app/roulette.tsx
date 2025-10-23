import { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function RouletteScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const currentRound = useGameState((state) => state.currentRound);
    const totalRounds = useGameState((state) => state.totalRounds);
    const selectNextPlayer = useGameState((state) => state.selectNextPlayer);

    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const spinValue = useRef(new Animated.Value(0)).current;
    const rotationRef = useRef(0);

    useEffect(() => {
        // Auto-start spin after a brief delay
        const timer = setTimeout(() => {
            handleSpin();
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSpin = useCallback(() => {
        if (isSpinning || players.length === 0) return;

        setIsSpinning(true);

        // Random number of full rotations (3-5) plus random final position
        const randomIndex = Math.floor(Math.random() * players.length);
        const fullRotations = 3 + Math.floor(Math.random() * 3); // 3-5 full spins
        const degreesPerPlayer = 360 / players.length;
        const targetRotation = fullRotations * 360 + randomIndex * degreesPerPlayer;

        spinValue.setValue(0);

        Animated.timing(spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setSelectedIndex(randomIndex);
            setIsSpinning(false);
            rotationRef.current = targetRotation % 360;
        });
    }, [isSpinning, players.length, spinValue]);

    const handleContinue = useCallback(() => {
        if (isSpinning || players.length === 0) return;

        const selectedPlayer = players[selectedIndex];
        if (selectedPlayer) {
            selectNextPlayer(selectedPlayer.id);
            const { phase: updatedPhase } = useGameState.getState();
            router.replace(getRouteForPhase(updatedPhase));
        }
    }, [isSpinning, players, selectedIndex, selectNextPlayer, router]);

    const rotation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1080deg'], // 3 full rotations base
    });

    if (players.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-rose-950 items-center justify-center px-6">
                <Text className="text-2xl font-bold text-rose-50 text-center">
                    No players found!
                </Text>
            </SafeAreaView>
        );
    }

    const selectedPlayer = players[selectedIndex];

    return (
        <SafeAreaView className="flex-1 bg-rose-950">
            <View className="flex-1 justify-between px-6 py-10">
                {/* Header */}
                <View className="items-center gap-2">
                    <Text className="text-3xl font-bold text-rose-50">
                        {currentRound === 0 ? 'First Player' : `Round ${currentRound + 1}`}
                    </Text>
                    <Text className="text-sm text-rose-300">
                        Cupid is choosing... 💘
                    </Text>
                </View>

                {/* Roulette Wheel */}
                <View className="items-center justify-center flex-1">
                    <View className="relative">
                        {/* Pointer at top */}
                        <View className="absolute -top-12 left-1/2 -ml-3 z-10">
                            <Text className="text-4xl">👇</Text>
                        </View>

                        {/* Spinning wheel */}
                        <Animated.View
                            style={{
                                transform: [{ rotate: rotation }],
                                width: 280,
                                height: 280,
                                borderRadius: 140,
                                overflow: 'hidden',
                            }}
                            className="bg-rose-900/20 border-4 border-rose-700"
                        >
                            {players.map((player, index) => {
                                const degreesPerPlayer = 360 / players.length;
                                const startAngle = index * degreesPerPlayer;

                                return (
                                    <View
                                        key={player.id}
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            transform: [
                                                { rotate: `${startAngle}deg` },
                                            ],
                                        }}
                                    >
                                        <View className="absolute top-4 left-1/2 -ml-12 w-24">
                                            <Text
                                                className="text-sm font-semibold text-rose-100 text-center"
                                                numberOfLines={1}
                                            >
                                                {player.name}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </Animated.View>
                    </View>

                    {/* Selected Player Display */}
                    {!isSpinning && (
                        <View className="mt-12 items-center gap-2">
                            <Text className="text-lg text-rose-300">Selected:</Text>
                            <Text className="text-3xl font-bold text-rose-50">
                                {selectedPlayer?.name}
                            </Text>
                            {selectedPlayer?.crush && selectedPlayer.crush !== 'Unknown' && (
                                <Text className="text-base text-rose-400">
                                    💘 Crushing on {selectedPlayer.crush}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View className="gap-4">
                    <Text className="text-center text-sm text-rose-400">
                        Round {currentRound + 1} of {totalRounds}
                    </Text>

                    {!isSpinning && (
                        <Pressable
                            onPress={handleContinue}
                            className="rounded-full bg-rose-500 active:bg-rose-600 py-4"
                        >
                            <Text className="text-center text-lg font-semibold text-rose-50">
                                Begin Challenge
                            </Text>
                        </Pressable>
                    )}

                    {isSpinning && (
                        <View className="rounded-full bg-rose-900/50 py-4">
                            <Text className="text-center text-lg font-semibold text-rose-400">
                                Spinning...
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

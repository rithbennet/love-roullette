import { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, Animated, Easing, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';
import { Button } from '../src/components/Button';
import { useSpinSound } from '../src/hooks/useSpinSound';

const HEAD_ASSETS = [
    require('../src/assets/mascots/head/victim-head-1.png'),
    require('../src/assets/mascots/head/victim-head-2.png'),
    require('../src/assets/mascots/head/victim-head-3.png'),
    require('../src/assets/mascots/head/victim-head-4.png'),
    require('../src/assets/mascots/head/victime-head-5.png'),
];

const CIRCLE_COLORS = ['#B794F6', '#FFA07A', '#FFD93D', '#98D8C8', '#87CEEB'];

export default function RouletteScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const currentRound = useGameState((state) => state.currentRound);
    const selectNextPlayer = useGameState((state) => state.selectNextPlayer);

    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);

    const highlightIndex = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const playSpin = useSpinSound();

    // Spinning highlight animation
    useEffect(() => {
        if (isSpinning) {
            // Fast cycling through players
            const cycleSpeed = 100;
            let currentIdx = 0;

            const interval = setInterval(() => {
                currentIdx = (currentIdx + 1) % players.length;
                setSelectedIndex(currentIdx);
            }, cycleSpeed);

            return () => clearInterval(interval);
        }
    }, [isSpinning, players.length]);

    // Pulse animation for selected player
    useEffect(() => {
        if (hasSpun && !isSpinning) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.15,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
            glowAnim.setValue(0);
        }
    }, [hasSpun, isSpinning, pulseAnim, glowAnim]);

    const handleSpin = useCallback(() => {
        if (isSpinning || players.length === 0) return;

        setIsSpinning(true);
        setHasSpun(false);

        // Play spin sound
        playSpin();

        // Determine final selection
        const finalIndex = Math.floor(Math.random() * players.length);

        // Spin for 3 seconds then land on selection
        setTimeout(() => {
            setSelectedIndex(finalIndex);
            setIsSpinning(false);
            setHasSpun(true);
        }, 3000);
    }, [isSpinning, players.length, playSpin]);

    const handleContinue = useCallback(() => {
        if (isSpinning || players.length === 0 || !hasSpun) return;

        const selectedPlayer = players[selectedIndex];
        if (selectedPlayer) {
            selectNextPlayer(selectedPlayer.id);
            const { phase: updatedPhase } = useGameState.getState();
            router.replace(getRouteForPhase(updatedPhase));
        }
    }, [isSpinning, players, selectedIndex, selectNextPlayer, router, hasSpun]);

    const handleBack = useCallback(() => {
        if (currentRound > 0) {
            Alert.alert(
                'Cannot Go Back',
                'You cannot go back once the game has started!',
                [{ text: 'OK' }]
            );
            return;
        }
        router.back();
    }, [router, currentRound]);

    const handleEndEarly = useCallback(() => {
        Alert.alert(
            'End Game Early?',
            'Are you sure you want to end the game early? All progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'End Game',
                    style: 'destructive',
                    onPress: () => {
                        router.replace('/LeaderScreen');
                    },
                },
            ]
        );
    }, [router]);

    const getPlayerPosition = (index: number, total: number) => {
        const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { x, y, angle };
    };

    if (players.length === 0) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center px-6">
                <Text className="text-2xl font-bold text-center">
                    No players found!
                </Text>
            </SafeAreaView>
        );
    }

    const selectedPlayer = players[selectedIndex];

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFA8A8', '#FF6565', '#FFA8A8']}
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
                                textShadowColor: 'rgba(230, 230, 230, 0.46)',
                                textShadowOffset: { width: 0, height: 4 },
                                textShadowRadius: 5,
                            }}
                        >
                            {isSpinning
                                ? "Cupid's choosing…"
                                : hasSpun
                                    ? `${selectedPlayer?.name} is chosen!`
                                    : 'Summon Cupid'}
                        </Text>
                        {hasSpun && !isSpinning && (
                            <Text
                                className="text-xl mt-2 font-semibold"
                                style={{
                                    color: '#8B3A52',
                                    textShadowColor: 'rgba(255, 255, 255, 0.3)',
                                    textShadowOffset: { width: 0, height: 2 },
                                    textShadowRadius: 3,
                                }}
                            >
                                💘 Time to shine! 💘
                            </Text>
                        )}
                    </View>

                    {/* Roulette Circle */}
                    <View className="flex-1 items-center justify-center">
                        <View className="relative w-80 h-80 items-center justify-center">
                            {/* Center decoration */}
                            <View className="absolute z-10">
                                <View
                                    className="w-16 h-16 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: 'rgba(98, 33, 53, 0.2)',
                                        borderWidth: 3,
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    }}
                                >
                                    <Text className="text-4xl">
                                        {isSpinning ? '🎯' : hasSpun ? '💖' : '🏹'}
                                    </Text>
                                </View>
                            </View>

                            {/* Spotlight indicator (arrow pointing to selected) */}
                            {(isSpinning || hasSpun) && (
                                <View
                                    className="absolute z-20"
                                    style={{
                                        transform: [
                                            {
                                                rotate: `${((selectedIndex * 360) / players.length - 90) *
                                                    -1
                                                    }deg`,
                                            },
                                        ],
                                    }}
                                >
                                    <View style={{ marginTop: -85 }}>
                                        <Text className="text-5xl">👇</Text>
                                    </View>
                                </View>
                            )}

                            {/* Players in circle */}
                            <View className="w-80 h-80">
                                {players.map((player, index) => {
                                    const position = getPlayerPosition(
                                        index,
                                        players.length
                                    );
                                    const headAsset = HEAD_ASSETS[index % HEAD_ASSETS.length];
                                    const circleColor =
                                        CIRCLE_COLORS[index % CIRCLE_COLORS.length];
                                    const isSelected = index === selectedIndex;
                                    const isHighlighted =
                                        isSelected && (isSpinning || hasSpun);

                                    return (
                                        <Animated.View
                                            key={player.id}
                                            style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                marginLeft: position.x - 40,
                                                marginTop: position.y - 40,
                                                transform: [
                                                    {
                                                        scale:
                                                            isHighlighted && hasSpun
                                                                ? pulseAnim
                                                                : isHighlighted
                                                                    ? 1.1
                                                                    : 1,
                                                    },
                                                ],
                                            }}
                                        >
                                            {/* Glow effect for selected */}
                                            {isHighlighted && (
                                                <Animated.View
                                                    className="absolute inset-0 rounded-full"
                                                    style={{
                                                        backgroundColor: '#FFD700',
                                                        opacity: hasSpun
                                                            ? glowAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0.3, 0.7],
                                                            })
                                                            : 0.5,
                                                        transform: [{ scale: 1.4 }],
                                                        shadowColor: '#FFD700',
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 0,
                                                        },
                                                        shadowOpacity: 0.8,
                                                        shadowRadius: 20,
                                                    }}
                                                />
                                            )}

                                            {/* Player avatar */}
                                            <View
                                                className="w-20 h-20 rounded-full items-center justify-center"
                                                style={{
                                                    backgroundColor: circleColor,
                                                    borderWidth: isHighlighted ? 4 : 2,
                                                    borderColor: isHighlighted
                                                        ? '#FFD700'
                                                        : 'rgba(255, 255, 255, 0.6)',
                                                    shadowColor: isHighlighted
                                                        ? '#FFD700'
                                                        : '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: isHighlighted ? 0.8 : 0.3,
                                                    shadowRadius: isHighlighted ? 10 : 4,
                                                    elevation: isHighlighted ? 8 : 3,
                                                }}
                                            >
                                                <Image
                                                    source={headAsset}
                                                    className="w-16 h-16"
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            {/* Player name below avatar */}
                                            {isHighlighted && hasSpun && (
                                                <View className="absolute -bottom-8 left-1/2 -ml-12 w-24">
                                                    <Text
                                                        className="text-center font-bold text-sm"
                                                        style={{
                                                            color: '#622135',
                                                            textShadowColor:
                                                                'rgba(255, 255, 255, 0.8)',
                                                            textShadowOffset: {
                                                                width: 0,
                                                                height: 1,
                                                            },
                                                            textShadowRadius: 2,
                                                        }}
                                                        numberOfLines={1}
                                                    >
                                                        {player.name}
                                                    </Text>
                                                </View>
                                            )}
                                        </Animated.View>
                                    );
                                })}
                            </View>

                            {/* Decorative hearts floating around when selected */}
                            {hasSpun && !isSpinning && (
                                <>
                                    {[...Array(8)].map((_, i) => (
                                        <Animated.View
                                            key={i}
                                            className="absolute"
                                            style={{
                                                opacity: glowAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.3, 0.8],
                                                }),
                                                transform: [
                                                    {
                                                        translateY: glowAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, -15],
                                                        }),
                                                    },
                                                    {
                                                        rotate: `${i * 45}deg`,
                                                    },
                                                    { translateX: 140 },
                                                ],
                                            }}
                                        >
                                            <Text className="text-2xl">
                                                {i % 3 === 0 ? '💕' : i % 3 === 1 ? '💖' : '💗'}
                                            </Text>
                                        </Animated.View>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>

                    {/* Buttons */}
                    <View className="gap-3">
                        {!hasSpun && (
                            <>
                                <Button
                                    onPress={handleSpin}
                                    variant="secondary"
                                    isDisabled={isSpinning}
                                >
                                    {isSpinning ? '🎯 Spinning...' : '🏹 Summon Cupid'}
                                </Button>
                                {currentRound === 0 && (
                                    <Button onPress={handleBack} variant="secondary">
                                        Back
                                    </Button>
                                )}
                                {currentRound > 0 && (
                                    <Button onPress={handleEndEarly} variant="secondary">
                                        End Game Early
                                    </Button>
                                )}
                            </>
                        )}
                        {hasSpun && !isSpinning && (
                            <Button onPress={handleContinue} variant="secondary">
                                Continue 💘
                            </Button>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
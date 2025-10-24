import { useState, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClickSound } from '../../src/hooks/useClickSound';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';
import { useGameState } from '../../src/core/gameStore';
import { Button, PlayerLineup, AnimatedMascot } from '@/components';

const MASCOT_BODIES = [
    require('../../src/assets/mascots/victim1.png'),
    require('../../src/assets/mascots/victim2.png'),
    require('../../src/assets/mascots/victim3.png'),
    require('../../src/assets/mascots/victim4.png'),
    require('../../src/assets/mascots/victim5.png'),
];

const DARING_LEVELS = [
    { level: 1, emoji: '🔥', label: 'Mild', description: 'Keep it tame' },
    { level: 2, emoji: '🔥🔥', label: 'Spicy', description: 'Turn up the heat' },
    { level: 3, emoji: '🔥🔥🔥', label: 'Wild', description: 'No holding back!' },
] as const;

const MAX_PLAYERS = 5;

export default function DaringLevelScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players = useGameState((state) => state.players);
    const addPlayer = useGameState((state) => state.addPlayer);

    const playerName = params.name as string;
    const avatarIndex = parseInt(params.avatarIndex as string || '0');
    const crush = params.crush as string;

    const [daringLevel, setDaringLevel] = useState(1);
    const playClickSound = useClickSound(true, require('../../src/assets/sounds/click-sound.mp3'));

    const handleAddPlayer = useCallback(() => {
        if (players.length >= MAX_PLAYERS) {
            Alert.alert('Max Players', `You can only add up to ${MAX_PLAYERS} players.`);
            return;
        }

        addPlayer({
            name: playerName,
            crush: crush || 'Unknown',
            daringLevel,
            characterId: `character-${avatarIndex}`,
        });

        // Navigate to review page
        router.push('/(add-players)/review');
    }, [playerName, crush, daringLevel, avatarIndex, addPlayer, players.length, router]);

    const handleDaringLevelSelect = useCallback(async (level: number) => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch { }
        playClickSound();
        setDaringLevel(level);
    }, [playClickSound]);

    return (
        <SafeAreaView className="flex-1 bg-[#ffa8a8]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 bg-gradient-to-b from-[#fff0f4] to-[#ee97ad] rounded-b-[50px] px-6 pt-4 pb-6">
                    {/* Player Lineup */}
                    <PlayerLineup maxVisible={5} />

                    {/* Avatar */}
                    <View className="items-center mb-2">
                        <AnimatedMascot source={MASCOT_BODIES[avatarIndex % MASCOT_BODIES.length]} keyProp={avatarIndex} width={140} height={175} />
                    </View>

                    {/* Player Info */}
                    <View className="items-center mb-4">
                        <Text className="text-[24px] text-black italic font-thin mb-0.5">
                            Player {players.length + 1}
                        </Text>
                        <Text className="text-[26px] text-black font-thin">[{playerName}]</Text>
                        {crush && crush !== 'Unknown' && (
                            <Text className="text-[16px] text-[#622135] font-thin mt-0.5">
                                💘 {crush}
                            </Text>
                        )}
                    </View>

                    {/* Title */}
                    <Text className="text-[28px] font-bold text-[#622135] leading-[28px] mb-4">
                        Choose Your Daring Level
                    </Text>

                    {/* Daring Level Options */}
                    <View className="gap-2.5 mb-5 flex-1">
                        {DARING_LEVELS.map(({ level, emoji, label, description }) => {
                            const isSelected = daringLevel === level;
                            return (
                                <MotiPressable
                                    key={level}
                                    animate={({ pressed }) => {
                                        'worklet';
                                        return {
                                            scale: pressed ? 0.96 : 1,
                                            opacity: pressed ? 0.9 : 1,
                                            translateY: pressed ? 2 : 0,
                                        };
                                    }}
                                    transition={{ type: 'timing', duration: 140 }}
                                    onPress={() => handleDaringLevelSelect(level)}
                                >
                                    <View
                                        className="rounded-2xl border-2 p-4 flex-row items-center justify-between"
                                        style={{
                                            backgroundColor: isSelected ? '#ffffff' : '#fff0f4',
                                            borderColor: isSelected ? '#622135' : '#ee97ad',
                                            shadowColor: '#622135',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: isSelected ? 0.2 : 0.1,
                                            shadowRadius: 4,
                                            elevation: isSelected ? 4 : 2,
                                        }}
                                    >
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-[#622135] mb-0.5">
                                                {label}
                                            </Text>
                                            <View className="flex-row items-center gap-1">
                                                <Text className="text-sm">{emoji}</Text>
                                                <Text className="text-xs text-[#622135]/70">
                                                    {description}
                                                </Text>
                                            </View>
                                        </View>
                                        {isSelected && (
                                            <View className="w-6 h-6 rounded-full bg-[#622135] items-center justify-center ml-2">
                                                <Text className="text-white text-sm font-bold">✓</Text>
                                            </View>
                                        )}
                                    </View>
                                </MotiPressable>
                            );
                        })}
                    </View>

                    {/* Add Player Button */}
                    <Button
                        onPress={handleAddPlayer}
                        className="rounded-[7px] py-3 px-4 border border-[#622135] bg-[#e6f7ff]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 5, height: 7 },
                            shadowOpacity: 0.25,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                    >
                        <Text className="text-center text-xl italic text-[#622135]">
                            Add Player
                        </Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
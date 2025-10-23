import { useState, useCallback } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClickSound } from '../../src/hooks/useClickSound';
import { MotiView } from 'moti';
import { useGameState } from '../../src/core/gameStore';

const MASCOT_HEADS = [
    require('../../src/assets/mascots/head/victim-head-1.png'),
    require('../../src/assets/mascots/head/victim-head-2.png'),
    require('../../src/assets/mascots/head/victim-head-3.png'),
    require('../../src/assets/mascots/head/victim-head-4.png'),
    require('../../src/assets/mascots/head/victime-head-5.png'),
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
        playClickSound();

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

        Alert.alert(
            'Player Added!',
            `${playerName} has been added to the game.`,
            [
                {
                    text: 'Add Another',
                    onPress: () => router.push('/(add-players)'),
                },
                {
                    text: 'Done',
                    onPress: () => router.back(),
                },
            ]
        );
    }, [playerName, crush, daringLevel, avatarIndex, addPlayer, players.length, router, playClickSound]);

    const handleDaringLevelSelect = useCallback((level: number) => {
        playClickSound();
        setDaringLevel(level);
    }, [playClickSound]);

    return (
        <SafeAreaView className="flex-1 bg-[#ffa8a8]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    {/* Top Section */}
                    <View className="bg-gradient-to-b from-[#fff0f4] to-[#ee97ad] rounded-b-[50px] px-6 pt-8 pb-12">
                        {/* Home Indicator */}
                        <View className="items-center mb-4">
                            <View className="w-[134px] h-[5px] bg-[#622135] rounded-full" />
                        </View>

                        {/* Avatar */}
                        <View className="items-center mb-4">
                            <Image
                                source={MASCOT_HEADS[avatarIndex % MASCOT_HEADS.length]}
                                className="w-[191px] h-[238px]"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Player Info */}
                        <View className="items-center mb-8">
                            <Text className="text-[29px] text-black italic font-thin mb-1">Player {players.length + 1}</Text>
                            <Text className="text-[30px] text-black font-thin">[{playerName}]</Text>
                            {crush && crush !== 'Unknown' && (
                                <Text className="text-[20px] text-[#622135] font-thin mt-1">💘 {crush}</Text>
                            )}
                        </View>

                        {/* Title */}
                        <Text className="text-[34px] font-bold text-[#622135] leading-[34px] mb-6">
                            Choose Your Daring Level
                        </Text>

                        {/* Daring Level Options */}
                        <View className="gap-3 mb-6">
                            {DARING_LEVELS.map(({ level, emoji, label, description }) => (
                                <Pressable
                                    key={level}
                                    onPress={() => handleDaringLevelSelect(level)}
                                >
                                    <MotiView
                                        animate={{
                                            scale: daringLevel === level ? 1.02 : 1,
                                            backgroundColor: daringLevel === level ? '#e6f7ff' : '#ffffff',
                                        }}
                                        transition={{
                                            type: 'spring',
                                            damping: 15,
                                        }}
                                        className="rounded-xl border-2 border-[#622135] p-4 flex-row items-center justify-between"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 2, height: 3 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 3,
                                            elevation: 3,
                                        }}
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <Text className="text-3xl">{emoji}</Text>
                                            <View>
                                                <Text className="text-xl font-bold text-[#622135]">{label}</Text>
                                                <Text className="text-sm text-[#622135] font-thin">{description}</Text>
                                            </View>
                                        </View>
                                        {daringLevel === level && (
                                            <View className="w-6 h-6 rounded-full bg-[#622135] items-center justify-center">
                                                <Text className="text-white text-sm">✓</Text>
                                            </View>
                                        )}
                                    </MotiView>
                                </Pressable>
                            ))}
                        </View>

                        {/* Add Player Button */}
                        <Pressable
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
                            <Text className="text-center text-2xl italic text-[#622135]">
                                Add Player
                            </Text>
                        </Pressable>

                        {/* Home Indicator */}
                        <View className="items-center mt-8">
                            <View className="w-[134px] h-[5px] bg-[#622135] rounded-full" />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

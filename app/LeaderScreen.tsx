import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { useGameState, Player } from '../src/core/gameStore';
import { Button } from '../src/components/Button';
import { useVictorySound } from '../src/hooks/useVictorySound';

const HEAD_ASSETS = [
    require('../src/assets/mascots/head/victim-head-1.png'),
    require('../src/assets/mascots/head/victim-head-2.png'),
    require('../src/assets/mascots/head/victim-head-3.png'),
    require('../src/assets/mascots/head/victim-head-4.png'),
    require('../src/assets/mascots/head/victime-head-5.png'),
];

const CIRCLE_COLORS = ['#B794F6', '#FFA07A', '#FFD93D', '#98D8C8', '#87CEEB'];

function getTopPlayers(players: Player[]) {
    return [...players]
        .sort((a, b) => b.stats.points - a.stats.points)
        .slice(0, 3);
}

export default function LeaderboardScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const topPlayers = getTopPlayers(players);

    // Play victory sound when leaderboard screen loads
    const playVictory = useVictorySound();

    useEffect(() => {
        playVictory();
    }, [playVictory]);

    const first = topPlayers[0];
    const second = topPlayers[1];
    const third = topPlayers[2];

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFC2DD', '#D19BA8', '#8B4A5E', '#622135']}
                locations={[0, 0.3, 0.7, 1]}
                style={{ flex: 1 }}
            >
                <View className="flex-1 px-6 pt-8 pb-6">
                    {/* Title */}
                    <View className="items-center mb-8">
                        <Text className="text-4xl font-bold text-[#622135] mb-2">
                            LeaderBoard
                        </Text>
                    </View>

                    {/* Podium */}
                    <View className="flex-1 items-center justify-center">
                        <View className="relative w-full h-[500px]">
                            {/* 1st Place - Center */}
                            {first && (
                                <View className="absolute left-1/2 top-0 items-center -ml-[60px]">
                                    <Text className="text-4xl mb-2">👑</Text>
                                    <View
                                        className="w-[120px] h-[120px] rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: '#87CEEB' }}
                                    >
                                        <Image
                                            source={HEAD_ASSETS[0]}
                                            className="w-[100px] h-[100px]"
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-white text-base mb-4">
                                        {first.name}
                                    </Text>
                                    <View className="bg-[#FFCDD2] rounded-3xl w-32 h-48 items-center justify-center">
                                        <Text className="text-5xl font-bold text-[#622135]">
                                            1st
                                        </Text>
                                        <View className="bg-white rounded-full px-4 py-1 mt-2">
                                            <Text className="text-teal-600 font-semibold">
                                                {first.stats.points} Pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* 2nd Place - Left */}
                            {second && (
                                <View className="absolute left-4 top-32 items-center">
                                    <View
                                        className="w-[90px] h-[90px] rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: '#B794F6' }}
                                    >
                                        <Image
                                            source={HEAD_ASSETS[1]}
                                            className="w-[75px] h-[75px]"
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-white text-sm mb-4">
                                        {second.name}
                                    </Text>
                                    <View className="bg-[#F8BBD0] rounded-3xl w-28 h-40 items-center justify-center">
                                        <Text className="text-4xl font-bold text-[#622135]">
                                            2nd
                                        </Text>
                                        <View className="bg-white rounded-full px-3 py-1 mt-2">
                                            <Text className="text-teal-600 font-medium text-sm">
                                                {second.stats.points} Pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* 3rd Place - Right */}
                            {third && (
                                <View className="absolute right-4 top-32 items-center">
                                    <View
                                        className="w-[90px] h-[90px] rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: '#FFD93D' }}
                                    >
                                        <Image
                                            source={HEAD_ASSETS[2]}
                                            className="w-[75px] h-[75px]"
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-white text-sm mb-4">
                                        {third.name}
                                    </Text>
                                    <View className="bg-[#FFE4E1] rounded-3xl w-28 h-40 items-center justify-center">
                                        <Text className="text-4xl font-bold text-[#622135]">
                                            3rd
                                        </Text>
                                        <View className="bg-white rounded-full px-3 py-1 mt-2">
                                            <Text className="text-teal-600 font-medium text-sm">
                                                {third.stats.points} Pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Awards Button */}
                    <Button
                        onPress={() => router.push('/awards')}
                        className="rounded-2xl py-4 px-6 border-2 border-[#622135]"
                        style={{ backgroundColor: 'rgba(98, 33, 53, 0.7)' }}
                    >
                        <Text className="text-center text-xl italic text-white font-light">
                            Awards {'>'}
                        </Text>
                    </Button>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
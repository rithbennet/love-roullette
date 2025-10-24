import { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClickSound } from '../../src/hooks/useClickSound';
import { useGameState } from '../../src/core/gameStore';
import { Button, PlayerLineup, AnimatedMascot } from '@/components';
import CrushList from '../../src/components/CrushList';

const MASCOT_BODIES = [
    require('../../src/assets/mascots/victim1.png'),
    require('../../src/assets/mascots/victim2.png'),
    require('../../src/assets/mascots/victim3.png'),
    require('../../src/assets/mascots/victim4.png'),
    require('../../src/assets/mascots/victim5.png'),
];

export default function CrushInputScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players = useGameState((state) => state.players);

    const playerName = params.name as string;
    const avatarIndex = parseInt(params.avatarIndex as string || '0');

    const [crush, setCrush] = useState('');
    const playClickSound = useClickSound(true, require('../../src/assets/sounds/click-sound.mp3'));
    const crushListRef = useRef<any>(null);

    const handleNext = useCallback(() => {
        playClickSound();
        router.push({
            pathname: '/(add-players)/daring-level',
            params: { name: playerName, avatarIndex, crush: crush.trim() || 'Unknown' },
        });
    }, [crush, playerName, avatarIndex, router, playClickSound]);

    const handleSelectFromList = useCallback(() => {
        playClickSound();
        crushListRef.current?.show?.();
    }, [playClickSound]);

    const handleCrushSelected = useCallback((name: string) => {
        playClickSound();
        // set crush name to selected value
        setCrush(name);
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

                        {/* Player Lineup */}
                        <PlayerLineup maxVisible={5} />

                        {/* Avatar */}
                        <View className="items-center mb-4">
                            <AnimatedMascot source={MASCOT_BODIES[avatarIndex % MASCOT_BODIES.length]} keyProp={avatarIndex} width={191} height={238} />
                        </View>

                        {/* Player Info */}
                        <View className="items-center mb-8">
                            <Text className="text-[29px] text-black italic font-thin mb-1">Player {players.length + 1}</Text>
                            <Text className="text-[30px] text-black font-thin">[{playerName}]</Text>
                        </View>

                        {/* Title */}
                        <Text className="text-[34px] font-bold text-[#622135] leading-[34px] mb-6">
                            And Who&apos;s Your Crush?
                        </Text>

                        {/* Crush Input */}
                        <TextInput
                            value={crush}
                            onChangeText={setCrush}
                            placeholder="Crush Name Here..."
                            placeholderTextColor="#622135"
                            className="bg-[#e6f7ff] border border-[#622135] rounded-[4px] h-[40px] px-4 text-[20px] text-[#622135] mb-6"
                        />

                        {/* Next Button */}
                        <Button
                            onPress={handleNext}
                            isDisabled={!crush.trim()}
                            className={`rounded-[7px] py-3 px-4 border border-[#622135] ${crush.trim() ? 'bg-[#e6f7ff]' : 'bg-gray-300'} mb-4`}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 5, height: 7 },
                                shadowOpacity: 0.25,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Text className={`text-center text-2xl italic ${crush.trim() ? 'text-[#622135]' : 'text-gray-500'}`}>
                                Next
                            </Text>
                        </Button>

                        {/* Or Text */}
                        <Text className="text-center text-[24px] text-[#622135] font-thin mb-4">or</Text>

                        {/* Select from List Button */}
                        <Button
                            onPress={handleSelectFromList}
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
                                Select from list
                            </Text>
                        </Button>


                    </View>
                </ScrollView>
                {/* Crush list action sheet */}
                <CrushList ref={crushListRef} onSelect={handleCrushSelected} />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

export default function AvatarSelectionScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const playClickSound = useClickSound(true, require('../../src/assets/sounds/click-sound.mp3'));

    const handleNext = useCallback(() => {
        playClickSound();
        if (!name.trim()) {
            return;
        }
        router.push({
            pathname: '/(add-players)/crush',
            params: { name: name.trim(), avatarIndex: selectedAvatar },
        });
    }, [name, selectedAvatar, router, playClickSound]);

    const handlePrevAvatar = useCallback(() => {
        playClickSound();
        setSelectedAvatar((prev) => (prev === 0 ? MASCOT_HEADS.length - 1 : prev - 1));
    }, [playClickSound]);

    const handleNextAvatar = useCallback(() => {
        playClickSound();
        setSelectedAvatar((prev) => (prev === MASCOT_HEADS.length - 1 ? 0 : prev + 1));
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
                    {/* Background Blobs */}
                    <View className="absolute left-[-100px] top-[130px]">
                        <View className="absolute left-[204px] top-0 w-[297px] h-[296px] rounded-full bg-[#fff4f4] opacity-46" style={{ filter: 'blur(35px)' }} />
                        <View className="absolute left-0 top-0 w-[297px] h-[296px] rounded-full bg-[#fff4f4] opacity-46" style={{ filter: 'blur(35px)' }} />
                    </View>

                    {/* Header */}
                    <View className="px-6 pt-4">
                        <Text className="text-[34px] font-bold text-[#622135] leading-[34px]" style={{ textShadowColor: 'rgba(255,255,255,0.49)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4 }}>
                            Avatar Selection
                        </Text>
                    </View>

                    {/* Avatar Carousel */}
                    <View className="items-center justify-center mt-8 mb-8">
                        <View className="flex-row items-center justify-center gap-4 w-full px-6">
                            {/* Left Arrow */}
                            <Pressable
                                onPress={handlePrevAvatar}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Text className="text-[#622135] text-3xl font-bold transform rotate-180">›</Text>
                            </Pressable>

                            {/* Avatar Display */}
                            <MotiView
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                key={selectedAvatar}
                                className="w-[212px] h-[265px]"
                            >
                                <Image
                                    source={MASCOT_HEADS[selectedAvatar]}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </MotiView>

                            {/* Right Arrow */}
                            <Pressable
                                onPress={handleNextAvatar}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Text className="text-[#622135] text-3xl font-bold">›</Text>
                            </Pressable>
                        </View>

                        {/* Show existing players if any */}
                        {players.length > 0 && (
                            <View className="flex-row items-center gap-2 mt-4">
                                {players.slice(0, 3).map((player, idx) => (
                                    <View key={player.id} className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                                        <Image
                                            source={MASCOT_HEADS[parseInt(player.characterId.split('-')[1] || '0') % MASCOT_HEADS.length]}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                ))}
                                <Text className="text-[#622135] text-sm italic ml-2">Love Lineup...</Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom Card */}
                    <View className="flex-1 bg-gradient-to-b from-[#fff0f4] to-[#ee97ad] rounded-t-[50px] px-6 pt-12 pb-8">
                        {/* Title */}
                        <Text className="text-[34px] font-bold text-[#622135] leading-[34px] mb-6">
                            Enter Your Name, Mortal
                        </Text>

                        {/* Name Input */}
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name Here..."
                            placeholderTextColor="#622135"
                            className="bg-white border border-[#622135] rounded-[4px] h-[40px] px-4 text-[20px] text-[#622135] mb-6"
                        />

                        {/* Next Button */}
                        <Pressable
                            onPress={handleNext}
                            disabled={!name.trim()}
                            className={`rounded-[7px] py-3 px-4 border border-[#622135] ${name.trim() ? 'bg-[#e6f7ff]' : 'bg-gray-300'
                                }`}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 5, height: 7 },
                                shadowOpacity: 0.25,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Text className={`text-center text-2xl italic ${name.trim() ? 'text-[#622135]' : 'text-gray-500'}`}>
                                Next
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

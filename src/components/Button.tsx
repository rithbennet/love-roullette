import { MotiPressable } from 'moti/interactions';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Text, View } from 'react-native';
import { useClickSound } from '../hooks/useClickSound';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    playSound?: boolean;
    haptics?: boolean;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    backgroundColor = '#e6f7ff',
    borderColor,
    textColor,
    playSound = true,
    haptics = true,
}: ButtonProps) {
    const playClick = useClickSound(playSound);

    // Default colors based on variant
    const defaultBorderColor = variant === 'primary' ? '#631f38' : '#622135';
    const defaultTextColor = variant === 'primary' ? '#631f38' : '#622135';

    const handlePress = async () => {
        if (haptics) {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {
                // ignore
            }
        }
        if (playSound) await playClick();
        onPress();
    };

    return (
        <MotiPressable
            animate={({ pressed }) => {
                'worklet';
                return {
                    scale: pressed ? 0.96 : 1,
                    opacity: pressed ? 0.9 : 1,
                    translateY: pressed ? 2 : 0,
                };
            }}
            transition={{ type: 'timing', duration: 140 }}
            onPress={handlePress}
        >
            <View
                className="rounded-xl py-4 shadow-md border-2"
                style={{
                    backgroundColor,
                    borderColor: borderColor || defaultBorderColor,
                }}
            >
                <Text
                    className="text-center text-lg font-bold italic"
                    style={{ color: textColor || defaultTextColor }}
                >
                    {title}
                </Text>
            </View>
        </MotiPressable>
    );
}


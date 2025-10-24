import { MotiPressable } from 'moti/interactions';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import { useClickSound } from '../hooks/useClickSound';

interface IconButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    isDisabled?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    size?: number;
    playSound?: boolean;
    haptics?: boolean;
    className?: string;
    style?: any;
}

export function IconButton({
    children,
    onPress,
    disabled = false,
    isDisabled = false,
    backgroundColor = 'rgba(236, 72, 153, 0.15)',
    borderColor = 'rgba(236, 72, 153, 0.3)',
    size = 96,
    playSound = true,
    haptics = true,
    className,
    style: passthroughStyle,
}: IconButtonProps) {
    const effectiveDisabled = !!(disabled || isDisabled);
    const playClick = useClickSound(playSound && !effectiveDisabled);

    const handlePress = async () => {
        if (effectiveDisabled) return;

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
                if (effectiveDisabled) {
                    return {
                        scale: 1,
                        opacity: 0.6,
                        translateY: 0,
                    };
                }
                return {
                    scale: pressed ? 0.92 : 1,
                    opacity: pressed ? 0.85 : 1,
                    translateY: pressed ? 2 : 0,
                };
            }}
            transition={{ type: 'timing', duration: 140 }}
            onPress={handlePress}
        >
            <View
                className={className ?? 'rounded-full items-center justify-center'}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: effectiveDisabled ? '#d1d5db' : backgroundColor,
                    borderWidth: 3,
                    borderColor: effectiveDisabled ? '#9ca3af' : borderColor,
                    opacity: effectiveDisabled ? 0.9 : 1,
                    ...(passthroughStyle || {}),
                }}
            >
                {children}
            </View>
        </MotiPressable>
    );
}

import { MotiPressable } from 'moti/interactions';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Text, View } from 'react-native';
import { useClickSound } from '../hooks/useClickSound';

interface ButtonProps {
    title?: string;
    children?: React.ReactNode;
    onPress: () => void;
    /** Legacy name and explicit flag to mark button disabled */
    disabled?: boolean;
    /** Preferred prop name to mark button disabled */
    isDisabled?: boolean;
    variant?: 'primary' | 'secondary';
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    playSound?: boolean;
    haptics?: boolean;
    // Allow passthrough props (className, style, etc.) used across the app
    [key: string]: any;
}

export function Button({
    title,
    children,
    onPress,
    disabled = false,
    isDisabled = false,
    variant = 'primary',
    backgroundColor = '#e6f7ff',
    borderColor,
    textColor,
    playSound = true,
    haptics = true,
    // accept common passthrough visual props
    className,
    style: passthroughStyle,
}: ButtonProps) {
    const effectiveDisabled = !!(disabled || isDisabled);
    const playClick = useClickSound(playSound && !effectiveDisabled);

    // Default colors based on variant
    const defaultBorderColor = variant === 'primary' ? '#631f38' : '#622135';
    const defaultTextColor = variant === 'primary' ? '#631f38' : '#622135';

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

    // When disabled, visually dim and prevent scale/translate animations
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
                    scale: pressed ? 0.96 : 1,
                    opacity: pressed ? 0.9 : 1,
                    translateY: pressed ? 2 : 0,
                };
            }}
            transition={{ type: 'timing', duration: 140 }}
            onPress={handlePress}
        >
            <View
                className={className ?? 'rounded-xl py-4 shadow-md border-2'}
                style={{
                    backgroundColor: effectiveDisabled ? '#d1d5db' : backgroundColor,
                    borderColor: borderColor || defaultBorderColor,
                    opacity: effectiveDisabled ? 0.9 : 1,
                    ...(passthroughStyle || {}),
                }}
            >
                {children ? (
                    <Text
                        className="text-center text-lg font-bold italic"
                        style={{ color: textColor || defaultTextColor }}
                    >
                        {children}
                    </Text>
                ) : (
                    <Text
                        className="text-center text-lg font-bold italic"
                        style={{ color: textColor || defaultTextColor }}
                    >
                        {title}
                    </Text>
                )}
            </View>
        </MotiPressable>
    );
}


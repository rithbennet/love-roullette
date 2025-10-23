import React, { useState } from 'react';
import { Text, TextInput, Pressable, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

/**
 * A floating input box that appears above the keyboard when focused.
 * Can be used for compact forms or responsive bottom sections.
 */
export function FloatingInputBox({
    value,
    onChangeText,
    placeholder = 'Your name...',
    onSubmit,
}: {
    value: string;
    onChangeText: (v: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
}) {
    const [focused, setFocused] = useState(false);
    const translateY = useSharedValue(300);
    const overlayOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(focused ? 0 : 300, { duration: 250 }),
            },
        ],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: withTiming(focused ? 1 : 0, { duration: 250 }),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }));

    // simplified onBlur handler
    const handleDone = () => {
        onSubmit?.();
        setFocused(false);
    };

    // Hidden field when not focused (acts as "trigger")
    if (!focused) {
        return (
            <Pressable
                onPress={() => setFocused(true)}
                className="bg-white border border-[#622135]/70 rounded-xl px-4 py-3 mb-4 active:scale-[0.98]"
            >
                <Text className="text-center text-[#622135]/80 text-base">
                    {value ? value : placeholder}
                </Text>
            </Pressable>
        );
    }

    // Floating panel (animated)
    return (
        <>
            <Animated.View style={overlayStyle} />
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        shadowColor: '#622135',
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: -3 },
                        elevation: 8,
                    },
                ]}
                className="bg-white/95 border-t border-[#622135] rounded-t-3xl px-5 pt-5 pb-8"
            >
                <Text className="text-lg font-extrabold text-center text-[#622135] mb-3">
                    Enter Your Name
                </Text>

                <TextInput
                    autoFocus
                    placeholder={placeholder}
                    placeholderTextColor="#986070"
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={() => setFocused(false)}
                    onSubmitEditing={handleDone}
                    className="border border-[#622135] bg-white rounded-xl px-4 py-3 text-[#622135] text-lg text-center mb-4"
                    returnKeyType="done"
                />

                <Pressable
                    onPress={handleDone}
                    className="bg-[#e6f7ff] border border-[#622135] rounded-xl py-3 active:scale-95 items-center"
                >
                    <Text className="text-lg font-semibold text-[#622135]">Done</Text>
                </Pressable>
            </Animated.View>
        </>
    );
}
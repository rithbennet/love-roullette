import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MotiView } from 'moti';

interface RoundCounterProps {
    rounds: number;
    onIncrement: () => void;
    onDecrement: () => void;
    minRounds?: number;
    maxRounds?: number;
}

export default function RoundCounter({
    rounds,
    onIncrement,
    onDecrement,
    minRounds = 1,
    maxRounds = 30,
}: RoundCounterProps) {
    const [isPressedPlus, setIsPressedPlus] = React.useState(false);
    const [isPressedMinus, setIsPressedMinus] = React.useState(false);

    return (
        <View className="flex-row items-center justify-center gap-5 py-4">
            {/* Minus Button */}
            <MotiView
                animate={{
                    scale: isPressedMinus ? 0.9 : 1,
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 300,
                }}
            >
                <Pressable
                    onPress={onDecrement}
                    onPressIn={() => setIsPressedMinus(true)}
                    onPressOut={() => setIsPressedMinus(false)}
                    disabled={rounds <= minRounds}
                    className={`w-[50px] h-[50px] rounded-full border-2 border-cupid-primary justify-center items-center ${rounds <= minRounds ? 'bg-cupid-light/50' : 'bg-cupid-light'
                        }`}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 3, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                >
                    <Text
                        className={`text-[32px] leading-8 ${rounds <= minRounds ? 'text-cupid-primary/50' : 'text-cupid-primary'
                            }`}
                    >
                        −
                    </Text>
                </Pressable>
            </MotiView>

            {/* Round Display */}
            <View className="min-w-20 items-center">
                <Text className="text-5xl text-cupid-primary text-center">
                    {rounds}
                </Text>
                <Text className="text-sm text-cupid-tertiary text-center -mt-1">
                    rounds
                </Text>
            </View>

            {/* Plus Button */}
            <MotiView
                animate={{
                    scale: isPressedPlus ? 0.9 : 1,
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 300,
                }}
            >
                <Pressable
                    onPress={onIncrement}
                    onPressIn={() => setIsPressedPlus(true)}
                    onPressOut={() => setIsPressedPlus(false)}
                    disabled={rounds >= maxRounds}
                    className={`w-[50px] h-[50px] rounded-full border-2 border-cupid-primary justify-center items-center ${rounds >= maxRounds ? 'bg-cupid-light/50' : 'bg-cupid-light'
                        }`}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 3, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                >
                    <Text
                        className={`text-[28px] leading-7 ${rounds >= maxRounds ? 'text-cupid-primary/50' : 'text-cupid-primary'
                            }`}
                    >
                        +
                    </Text>
                </Pressable>
            </MotiView>
        </View>
    );
}

import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface AnimatedCupidProps {
    source: ImageSourcePropType;
    size?: number;
}

export default function AnimatedCupid({ source, size = 291 }: AnimatedCupidProps) {
    return (
        <MotiView
            from={{
                rotate: '-5deg',
            }}
            animate={{
                rotate: '5deg',
            }}
            transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                loop: true,
                repeatReverse: true,
            }}
        >
            <Image
                source={source}
                style={{
                    width: size,
                    height: size * 0.76, // Maintain aspect ratio from Figma (222/291)
                }}
                resizeMode="contain"
            />
        </MotiView>
    );
}

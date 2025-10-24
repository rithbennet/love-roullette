import React from 'react';
import { Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface Props {
    source: ImageSourcePropType;
    width?: number | string;
    height?: number | string;
    style?: ViewStyle;
    className?: string;
    // keyProp used to trigger entry animation when the character changes
    keyProp?: string | number;
}

export default function AnimatedMascot({ source, width = '100%', height = '100%', style, className, keyProp }: Props) {
    return (
        <MotiView
            // outer entry animation (jump-in)
            key={keyProp}
            from={{ translateY: -30, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 120 }}
            style={[{ width: typeof width === 'string' ? width : (width as any), height: typeof height === 'string' ? height : (height as any) } as any, style]}
        >
            {/* breathing loop */}
            <MotiView
                from={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ loop: true, type: 'timing', duration: 2200 }}
                style={{ flex: 1 }}
            >
                <Image source={source} style={{ width: '100%', height: '100%' }} />
            </MotiView>
        </MotiView>
    );
}

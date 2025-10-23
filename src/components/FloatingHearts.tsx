import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function FloatingHearts() {
    return (
        <View className="absolute inset-0" pointerEvents="none">
            <LottieView
                source={require('../assets/floating-hearts.json')}
                autoPlay
                loop
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

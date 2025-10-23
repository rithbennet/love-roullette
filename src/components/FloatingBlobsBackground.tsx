import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FloatingBlobsBackground() {
    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Main gradient background */}
            <LinearGradient
                colors={['#ffe2e2', '#ffc2e2', '#ffe2e2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Blob 1 - Top Right */}
            <View className="absolute -top-16 left-52 w-[297px] h-[296px] rounded-full bg-cupid-red opacity-36" />

            {/* Blob 2 - Top Left */}
            <View className="absolute -top-16 -left-24 w-[297px] h-[296px] rounded-full bg-cupid-pink opacity-29" />

            {/* Blob 3 - Bottom Left */}
            <View className="absolute top-[551px] -left-24 w-[297px] h-[296px] rounded-full bg-cupid-red opacity-35" />

            {/* Blob 4 - Bottom Right */}
            <View className="absolute top-[551px] left-[186px] w-[297px] h-[296px] rounded-full bg-cupid-pink opacity-34" />
        </View>
    );
}

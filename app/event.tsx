import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function RandomEventScreen() {
    const router = useRouter();
    // Use separate selectors so the selector doesn't return a new object each render
    const phase = useGameState((state) => state.phase);
    const currentRound = useGameState((state) => state.currentRound);
    const latestEvent = useGameState((state) => state.latestEvent);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Random Event!</Text>
            <Text style={styles.phase}>Current Phase: {phase}</Text>
            <View style={styles.eventBox}>
                <Text style={styles.eventText}>{latestEvent ?? 'Cupid.exe is thinking...'}</Text>
            </View>
            <Text style={styles.body}>After resolving the glitch, the next round will begin.</Text>

            <View style={styles.actions}>
                <Button title="Continue" onPress={handleContinue} />
                <Text style={styles.roundInfo}>Upcoming Round: {currentRound + 1}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    phase: {
        textAlign: 'center',
        marginBottom: 16,
    },
    eventBox: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
    },
    eventText: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
    },
    body: {
        marginTop: 16,
        textAlign: 'center',
        color: '#555',
    },
    actions: {
        marginTop: 32,
        alignItems: 'center',
    },
    roundInfo: {
        marginTop: 8,
        color: '#666',
    },
});
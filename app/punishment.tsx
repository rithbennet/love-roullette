import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function PunishmentScreen() {
    const router = useRouter();
    const phase = useGameState((state) => state.phase);
    const currentRound = useGameState((state) => state.currentRound);
    const activePlayer = useGameState((state) => state.activePlayer);
    const latestOutcome = useGameState((state) => state.latestOutcome);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Punishment Phase</Text>
            <Text style={styles.phase}>Current Phase: {phase}</Text>
            <Text style={styles.body}>
                {activePlayer
                    ? `${activePlayer.name} dodged the dare and must face consequences.`
                    : 'No active player found.'}
            </Text>

            <View style={styles.outcomeBox}>
                <Text style={styles.label}>Punishment</Text>
                <Text style={styles.outcome}>{latestOutcome ?? 'Awaiting punishment details...'}</Text>
            </View>

            <View style={styles.actions}>
                <Button title="Continue" onPress={handleContinue} />
                <Text style={styles.roundInfo}>Round {currentRound}</Text>
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
        fontSize: 26,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    phase: {
        textAlign: 'center',
        marginBottom: 16,
    },
    body: {
        textAlign: 'center',
        fontSize: 16,
    },
    outcomeBox: {
        marginTop: 24,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff4f4',
        borderWidth: 1,
        borderColor: '#f5c2c0',
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
    },
    outcome: {
        fontSize: 16,
        lineHeight: 22,
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
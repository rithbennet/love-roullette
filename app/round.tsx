import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function DareRoundScreen() {
    const router = useRouter();
    // Read store values with separate selectors to avoid returning a new object each render
    const phase = useGameState((state) => state.phase);
    const currentRound = useGameState((state) => state.currentRound);
    const totalRounds = useGameState((state) => state.totalRounds);
    const activePlayer = useGameState((state) => state.activePlayer);
    const latestDare = useGameState((state) => state.latestDare);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Dare Round {currentRound}</Text>
            <Text style={styles.phase}>Current Phase: {phase}</Text>
            <Text style={styles.body}>
                Active Player: {activePlayer ? activePlayer.name : 'TBD'}
            </Text>
            <View style={styles.section}>
                <Text style={styles.label}>Dare Prompt</Text>
                <Text style={styles.dare}>{latestDare ?? 'Waiting for dare generation...'}</Text>
            </View>
            <Text style={styles.footer}>
                If the player accepts the dare, we will proceed to proof. If they skip, expect punishment.
            </Text>

            <View style={styles.actions}>
                <Button title="Resolve Dare" onPress={handleContinue} />
                <Text style={styles.roundInfo}>
                    Round {currentRound} of {totalRounds}
                </Text>
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
        marginBottom: 8,
        textAlign: 'center',
    },
    phase: {
        textAlign: 'center',
        marginBottom: 16,
    },
    body: {
        fontSize: 18,
        textAlign: 'center',
    },
    section: {
        marginTop: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    dare: {
        fontSize: 16,
        lineHeight: 22,
    },
    footer: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        color: '#444',
    },
    actions: {
        marginTop: 32,
        alignItems: 'center',
    },
    roundInfo: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
});
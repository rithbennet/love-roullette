import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function SummaryScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const totalRounds = useGameState((state) => state.totalRounds);
    const resetGame = useGameState((state) => state.resetGame);

    const handleRestart = useCallback(() => {
        resetGame();
        router.replace(getRouteForPhase('setup'));
    }, [resetGame, router]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Cupid.exe Summary</Text>
            <Text style={styles.body}>Rounds Completed: {totalRounds}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Player Recap</Text>
                {players.map((player) => (
                    <Text key={player.id} style={styles.player}>
                        • {player.name} survived the love gauntlet.
                    </Text>
                ))}
            </View>

            <Text style={styles.footer}>
                Thanks for testing the Cupid.exe loop! Restart to seed a new batch of chaos.
            </Text>

            <View style={styles.actions}>
                <Button title="Restart Game" onPress={handleRestart} />
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
        marginBottom: 16,
    },
    body: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
    },
    player: {
        fontSize: 16,
        marginBottom: 6,
    },
    footer: {
        textAlign: 'center',
        color: '#555',
        marginBottom: 32,
    },
    actions: {
        alignItems: 'center',
    },
});
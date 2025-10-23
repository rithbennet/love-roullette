import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function PreGameScreen() {
    const router = useRouter();
    const phase = useGameState((state) => state.phase);
    const totalRounds = useGameState((state) => state.totalRounds);
    const currentRound = useGameState((state) => state.currentRound);
    const nextPhase = useGameState((state) => state.nextPhase);

    const handleContinue = useCallback(() => {
        nextPhase();
        const { phase: updatedPhase } = useGameState.getState();
        router.replace(getRouteForPhase(updatedPhase));
    }, [nextPhase, router]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Pre-Game Briefing</Text>
            <Text style={styles.phase}>Current Phase: {phase}</Text>
            <Text style={styles.body}>
                Cupid.exe will run {totalRounds} daring rounds. Gather everyone and press continue whenever you are
                ready to begin round {currentRound + 1}.
            </Text>

            <View style={styles.actions}>
                <Button title="Continue" onPress={handleContinue} />
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
        marginBottom: 12,
        textAlign: 'center',
    },
    phase: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
    },
    actions: {
        marginTop: 32,
        alignSelf: 'center',
    },
});
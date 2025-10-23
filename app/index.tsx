import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { getRouteForPhase, useGameState } from '../src/core/gameStore';

export default function SetupScreen() {
  const router = useRouter();
  const phase = useGameState((state) => state.phase);
  const players = useGameState((state) => state.players);
  const totalRounds = useGameState((state) => state.totalRounds);
  const nextPhase = useGameState((state) => state.nextPhase);
  const resetGame = useGameState((state) => state.resetGame);

  const handleBegin = useCallback(() => {
    nextPhase();
    const { phase: updatedPhase } = useGameState.getState();
    router.replace(getRouteForPhase(updatedPhase));
  }, [nextPhase, router]);

  const handleReset = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Cupid.exe · Setup</Text>
      <Text style={styles.phase}>Current Phase: {phase}</Text>
      <Text style={styles.subHeading}>Configured Rounds: {totalRounds}</Text>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Players</Text>
        {players.map((player) => (
          <Text key={player.id} style={styles.player}>
            • {player.name} (Daring {player.daringLevel})
          </Text>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Start Match" onPress={handleBegin} />
        <View style={styles.spacer} />
        <Button title="Reset" onPress={handleReset} color="#777" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  phase: {
    fontSize: 18,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  player: {
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    marginTop: 'auto',
  },
  spacer: {
    height: 12,
  },
});

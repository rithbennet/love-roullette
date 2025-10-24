import { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useGameState } from '../src/core/gameStore';
import {
  AnimatedCupid,
  Button,
  RoundCounter,
  FloatingBlobsBackground,
  FloatingHearts,
} from '../src/components';

const MIN_ROUNDS = 1;
const MAX_ROUNDS = 30;

export default function HomeScreen() {
  const router = useRouter();
  const totalRounds = useGameState((state) => state.totalRounds);
  const setTotalRounds = useGameState((state) => state.setTotalRounds);
  const startGame = useGameState((state) => state.startGame);

  const handleAdjustRounds = useCallback(
    (delta: number) => {
      const nextValue = Math.max(
        MIN_ROUNDS,
        Math.min(MAX_ROUNDS, totalRounds + delta)
      );
      if (nextValue !== totalRounds) {
        setTotalRounds(nextValue);
      }
    },
    [setTotalRounds, totalRounds]
  );

  const handleStartGame = useCallback(() => {
    const success = startGame();
    if (success) {
      router.push('(add-players)/review');
    }
  }, [router, startGame]);

  const handleCreateRoster = useCallback(() => {
    router.push('/(add-players)');
  }, [router]);

  return (
    <View className="flex-1 bg-cupid-bg">
      <StatusBar style="dark" />

      {/* Background with gradient blobs */}
      <FloatingBlobsBackground />

      {/* Floating Hearts Animation */}
      <FloatingHearts />

      {/* Content */}
      <View className="flex-1 px-5 justify-between">
        {/* Cupid Character */}
        <View className="items-center mt-36">
          <AnimatedCupid
            source={require('../src/assets/mascots/cupid.png')}
            size={291}
          />
        </View>

        {/* Title */}
        <View className="items-center gap-2 -mt-16">
          <Text className="text-[34px] text-cupid-primary text-center tracking-wide">
            Cupid.exe
          </Text>
          <Text className="text-[28px] text-cupid-tertiary text-center tracking-wide">
            Hotseat Love Game
          </Text>
        </View>

        {/* Round Counter */}
        <View className="my-5">
          <RoundCounter
            rounds={totalRounds}
            onIncrement={() => handleAdjustRounds(1)}
            onDecrement={() => handleAdjustRounds(-1)}
            minRounds={MIN_ROUNDS}
            maxRounds={MAX_ROUNDS}
          />
        </View>

        {/* Action Buttons */}
        <View className="w-full mb-5">
          <Button
            title="Take A Shot"
            variant="primary"
            onPress={handleStartGame}
          />

        </View>

        {/* Home Indicator Spacer */}
        <View className="h-9" />
      </View>
    </View>
  );
}

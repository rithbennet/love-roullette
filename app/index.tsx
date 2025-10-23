import { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useGameState } from '../src/core/gameStore';

const MIN_ROUNDS = 1;
const MAX_ROUNDS = 15;

export default function HomeScreen() {
  const router = useRouter();
  const players = useGameState((state) => state.players);
  const totalRounds = useGameState((state) => state.totalRounds);
  const setTotalRounds = useGameState((state) => state.setTotalRounds);
  const startGame = useGameState((state) => state.startGame);

  const playerCount = players.length;

  const canStart = useMemo(
    () => playerCount >= 3 && playerCount <= 5,
    [playerCount]
  );

  const handleAdjustRounds = useCallback(
    (delta: number) => {
      const nextValue = Math.max(MIN_ROUNDS, Math.min(MAX_ROUNDS, totalRounds + delta));
      if (nextValue !== totalRounds) {
        setTotalRounds(nextValue);
      }
    },
    [setTotalRounds, totalRounds]
  );

  const handleStartGame = useCallback(() => {
    if (!canStart) return;

    const success = startGame();
    if (success) {
      router.push('/pregame');
    }
  }, [canStart, router, startGame]);

  return (
    <SafeAreaView className="flex-1 bg-rose-950">
      <View className="flex-1 justify-between px-6 py-10">
        {/* Header */}
        <View className="gap-4">
          <Text className="text-5xl font-bold text-rose-50">Cupid.exe</Text>
          <Text className="text-base text-rose-200">
            Gather your crew, set the heat level, and get ready for a daring
            night of love-fueled challenges. 💘
          </Text>
        </View>

        {/* Settings & Actions */}
        <View className="gap-6">
          {/* Settings Card */}
          <View className="rounded-3xl bg-rose-900/40 p-6 gap-4">
            <Text className="text-lg font-semibold text-rose-100">
              Game Settings
            </Text>

            {/* Round Counter */}
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-rose-200">Rounds</Text>
              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={() => handleAdjustRounds(-1)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-rose-800 active:bg-rose-700"
                  disabled={totalRounds <= MIN_ROUNDS}
                >
                  <Text className="text-2xl font-semibold text-rose-100">−</Text>
                </Pressable>

                <Text className="w-12 text-center text-xl font-semibold text-rose-50">
                  {totalRounds}
                </Text>

                <Pressable
                  onPress={() => handleAdjustRounds(1)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-rose-800 active:bg-rose-700"
                  disabled={totalRounds >= MAX_ROUNDS}
                >
                  <Text className="text-2xl font-semibold text-rose-100">+</Text>
                </Pressable>
              </View>
            </View>

            {/* Player Count */}
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-rose-200">Players</Text>
              <Text className="text-base font-medium text-rose-100">
                {playerCount} / 5
              </Text>
            </View>

            <Text className="text-xs text-rose-400">
              Need 3 to 5 players to launch. Add or remove friends below.
            </Text>
          </View>

          {/* Action Buttons */}
          <Pressable
            className="rounded-full bg-rose-800 py-4 active:bg-rose-700"
            onPress={() => router.push('/add-players')}
          >
            <Text className="text-center text-lg font-semibold text-rose-50">
              Add / Manage Players
            </Text>
          </Pressable>

          <Pressable
            className={`rounded-full py-4 ${canStart ? 'bg-rose-500 active:bg-rose-600' : 'bg-rose-900/50'
              }`}
            onPress={handleStartGame}
            disabled={!canStart}
          >
            <Text
              className={`text-center text-lg font-semibold ${canStart ? 'text-rose-50' : 'text-rose-500'
                }`}
            >
              Start Game
            </Text>
          </Pressable>

          {!canStart && (
            <Text className="text-center text-sm text-rose-400">
              {playerCount < 3
                ? `Add ${3 - playerCount} more player${3 - playerCount > 1 ? 's' : ''} to start`
                : 'Too many players — remove some to continue'}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

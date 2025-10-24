// app/_layout.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

import BgMusicProvider from '../src/components/BgMusicProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        {/* Mount global background music manager so it's present across screens */}
        <BgMusicProvider />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </GestureHandlerRootView>
  );
}
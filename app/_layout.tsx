// app/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";


export default function RootLayout() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </GestureHandlerRootView>
  );
}
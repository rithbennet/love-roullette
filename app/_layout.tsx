// app/_layout.tsx
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  LilitaOne_400Regular,
} from "@expo-google-fonts/lilita-one";
import "../global.css";


export default function RootLayout() {


  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
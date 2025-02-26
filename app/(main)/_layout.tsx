import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { UserProvider } from "../../contexts/UserContext"

import Colors from "@/constants/colors";
import { useColorScheme } from "@/components/useColorScheme";


export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}

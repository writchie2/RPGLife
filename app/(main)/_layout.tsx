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
import { UserProvider } from "../../contexts/UserContext";

import Colors from "@/constants/colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              gestureEnabled: false, 
              }} />
          <Stack.Screen 
            name="settings" 
            options={{ 
              headerShown: false,
              gestureEnabled: false, 
              }} />
          <Stack.Screen 
            name="quests_main" 
            options={{ 
              headerShown: false,
              gestureEnabled: false, 
              }} />
          <Stack.Screen 
            name="skills_main" 
            options={{ 
              headerShown: false,
              gestureEnabled: false, 
              }} />
          <Stack.Screen
            name="character_main"
            options={{ 
              headerShown: false,
              gestureEnabled: false, 
            }}
          />
          <Stack.Screen
            name="achievements_main"
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}

/*
* Layout for the main app. Allows routing to different areas. There is the main tabs, the login section, and quests section 
* This is not an exhaustive list just a start. Also could organize the pages in different ways. I have found that navigation works best when pages are 
* arranged in folders with a main page and related pages in that folder. 
* A lot of existing code is from a boilerplate code that will need to be adjusted.  
*
* TODO: 
* Styling
* Add routing for new pages as they are needed
*/

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

 export const unstable_settings = {
   // Ensure that reloading on `/modal` keeps a back button present.
   initialRouteName: '(login)/',
 };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    
  });
  

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(login)">
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen may already be hidden or unavailable on web
  console.warn('[RootLayout] Could not prevent splash screen auto-hide');
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [forceRender, setForceRender] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.error('[RootLayout] Font loading error:', error);
      setForceRender(true);
      // Hide splash screen even on error to prevent indefinite loading
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log('[RootLayout] Fonts loaded successfully');
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  // Immediate fallback for web - show loading UI right away
  useEffect(() => {
    const immediateTimeout = setTimeout(() => {
      setShowFallback(true);
    }, 100);

    return () => clearTimeout(immediateTimeout);
  }, []);

  // Add timeout to force render after 1 second if fonts don't load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loaded && !error) {
        console.warn('[RootLayout] Font loading timeout - forcing render');
        setForceRender(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [loaded, error]);

  // Always show something - never return null
  if (!loaded && !error && !forceRender) {
    // Show loading UI instead of returning null
    if (showFallback) {
      return (
        <View style={fallbackStyles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={fallbackStyles.text}>Loading Stryde SG...</Text>
        </View>
      );
    }
    // Return null only for first 100ms to let splash screen show
    return null;
  }

  // Continue even if there's a font error - app can work without custom fonts
  return <RootLayoutNav />;
}

const fallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="tutorial" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

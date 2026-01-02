import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Index] Component mounted');
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      console.log('[Index] Checking onboarding status...');
      const onboardingData = await storage.load(STORAGE_KEYS.ONBOARDING) as any;
      console.log('[Index] Onboarding data:', onboardingData);
      
      // Validate data structure
      if (!onboardingData || typeof onboardingData !== 'object') {
        console.log('[Index] No valid data found, navigating to onboarding');
        setTimeout(() => router.replace('/onboarding'), 100);
        return;
      }
      
      if (!onboardingData.onboardingComplete) {
        console.log('[Index] Onboarding not complete, navigating to onboarding');
        setTimeout(() => router.replace('/onboarding'), 100);
      } else if (!onboardingData.tutorialComplete) {
        console.log('[Index] Tutorial not complete, navigating to tutorial');
        setTimeout(() => router.replace('/tutorial'), 100);
      } else {
        console.log('[Index] All complete, navigating to tabs');
        setTimeout(() => router.replace('/(tabs)'), 100);
      }
    } catch (error) {
      console.error('[Index] Error checking onboarding:', error);
      // Storage error or corrupted data - fallback to onboarding
      console.log('[Index] Storage error, falling back to onboarding');
      setTimeout(() => router.replace('/onboarding'), 100);
    } finally {
      setTimeout(() => setIsChecking(false), 50);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Stryde SG...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    padding: 20,
  },
});

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingData = await storage.load(STORAGE_KEYS.ONBOARDING) as any;
      
      if (!onboardingData || !onboardingData.onboardingComplete) {
        router.replace('/onboarding');
      } else if (!onboardingData.tutorialComplete) {
        router.replace('/tutorial');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      // If no data exists, start with onboarding
      router.replace('/onboarding');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
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
});

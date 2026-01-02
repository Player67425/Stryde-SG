import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

const tutorialSteps = [
  { title: 'Learn', description: 'Explore science-backed modules and quizzes with SG content.', icon: '📚' },
  { title: 'Track', description: 'Log daily nutrition, activity, sleep. See 7-day trends and insights.', icon: '📊' },
  { title: 'Scan Meal', description: 'Take photo → Answer questions → Get estimate → Log.', icon: '📸' },
  { title: 'Connect', description: 'Complete quests, earn badges, join teams, discover SG events.', icon: '⭐' },
  { title: 'Reflect', description: 'Journal your thoughts with guided prompts. Track mood patterns.', icon: '📝' },
  { title: 'AI Coach', description: 'Ask questions, scan misinformation, get personalized guidance.', icon: '🤖' },
];

export default function TutorialScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const completeTutorial = async () => {
    const onboardingData = await storage.load(STORAGE_KEYS.ONBOARDING) as any;
    if (onboardingData) {
      await storage.save(STORAGE_KEYS.ONBOARDING, { ...onboardingData, tutorialComplete: true });
    }
    router.replace('/(tabs)');
  };

  const step = tutorialSteps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Getting Started</Text>
        <TouchableOpacity onPress={completeTutorial}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.icon}>{step.icon}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.indicators}>
          {tutorialSteps.map((_, index) => (
            <View key={index} style={[styles.indicator, index === currentStep && styles.indicatorActive]} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  skipText: { fontSize: 16, color: '#4A90E2' },
  content: { flex: 1 },
  contentContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 80 },
  icon: { fontSize: 100, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 18, color: '#666', textAlign: 'center', lineHeight: 26 },
  indicators: { flexDirection: 'row', marginTop: 40, gap: 8 },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  indicatorActive: { backgroundColor: '#4A90E2', width: 24 },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  backButton: { flex: 1, padding: 16, borderWidth: 1, borderColor: '#4A90E2', borderRadius: 8, alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#4A90E2', fontWeight: '600' },
  nextButton: { flex: 2, padding: 16, backgroundColor: '#4A90E2', borderRadius: 8, alignItems: 'center' },
  nextButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

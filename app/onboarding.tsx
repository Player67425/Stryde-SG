import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingData } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const updateData = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const saveAndContinue = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const completeData: OnboardingData = {
        ...data as OnboardingData,
        onboardingComplete: true,
        tutorialComplete: false,
      };
      await storage.save(STORAGE_KEYS.ONBOARDING, completeData);
      router.replace('/tutorial');
    }
  };

  const canContinue = () => {
    if (step === 1) return data.age && data.activityLevel && data.sleepHours;
    if (step === 2) return data.stressLevel && data.primaryGoal;
    if (step === 3) return data.dietaryPreference;
    return false;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Stryde SG</Text>
        <Text style={styles.subtitle}>Empowering teens to flourish—one Stryde at a time</Text>
        <Text style={styles.stepIndicator}>Step {step} of 3</Text>
      </View>

      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.label}>Age (12-19) *</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={data.age?.toString() || ''} 
            onChangeText={(text) => updateData('age', parseInt(text) || 0)} placeholder="Enter your age" />

          <Text style={styles.label}>Activity Level *</Text>
          <View style={styles.buttonGroup}>
            {['Low', 'Medium', 'High'].map((level) => (
              <TouchableOpacity key={level} style={[styles.optionButton, data.activityLevel === level && styles.optionButtonSelected]}
                onPress={() => updateData('activityLevel', level)}>
                <Text style={[styles.optionText, data.activityLevel === level && styles.optionTextSelected]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Average Sleep Hours *</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={data.sleepHours?.toString() || ''}
            onChangeText={(text) => updateData('sleepHours', parseInt(text) || 0)} placeholder="e.g., 7" />

          <Text style={styles.label}>Height (cm)</Text>
          <Text style={styles.helperText}>ⓘ Highly recommended for better accuracy</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={data.height?.toString() || ''}
            onChangeText={(text) => updateData('height', text ? parseInt(text) : undefined)} placeholder="Optional" />

          <Text style={styles.label}>Weight (kg)</Text>
          <Text style={styles.helperText}>ⓘ Highly recommended for better accuracy</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={data.weight?.toString() || ''}
            onChangeText={(text) => updateData('weight', text ? parseInt(text) : undefined)} placeholder="Optional" />

          <Text style={styles.label}>Sex</Text>
          <Text style={styles.helperText}>ⓘ Highly recommended for accurate targets and insights</Text>
          <View style={styles.buttonGroup}>
            {['Male', 'Female', 'Other'].map((sex) => (
              <TouchableOpacity key={sex} style={[styles.optionButton, data.sex === sex && styles.optionButtonSelected]}
                onPress={() => updateData('sex', sex)}>
                <Text style={[styles.optionText, data.sex === sex && styles.optionTextSelected]}>{sex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.label}>Stress Level (1-10) *</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={data.stressLevel?.toString() || ''}
            onChangeText={(text) => updateData('stressLevel', Math.min(10, parseInt(text) || 0))} placeholder="1 (low) to 10 (high)" />

          <Text style={styles.label}>Primary Goal *</Text>
          {['Energy & mood', 'Fitness & performance', 'Healthier habits', 'Healthy weight management'].map((goal) => (
            <TouchableOpacity key={goal} style={[styles.goalOption, data.primaryGoal === goal && styles.goalOptionSelected]}
              onPress={() => updateData('primaryGoal', goal)}>
              <Text style={[styles.goalText, data.primaryGoal === goal && styles.goalTextSelected]}>{goal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={styles.section}>
          <Text style={styles.label}>Dietary Preference *</Text>
          {['None', 'Halal', 'Vegetarian', 'Other'].map((pref) => (
            <TouchableOpacity key={pref} style={[styles.goalOption, data.dietaryPreference === pref && styles.goalOptionSelected]}
              onPress={() => updateData('dietaryPreference', pref)}>
              <Text style={[styles.goalText, data.dietaryPreference === pref && styles.goalTextSelected]}>{pref}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
        onPress={saveAndContinue} disabled={!canContinue()}>
        <Text style={styles.continueButtonText}>{step === 3 ? 'Complete' : 'Continue'}</Text>
      </TouchableOpacity>

      {step > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#4A90E2' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#fff', marginBottom: 16 },
  stepIndicator: { fontSize: 14, color: '#fff', opacity: 0.9 },
  section: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  helperText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  buttonGroup: { flexDirection: 'row', gap: 10 },
  optionButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  optionButtonSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  optionText: { fontSize: 14, color: '#333' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  goalOption: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10 },
  goalOptionSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  goalText: { fontSize: 16, color: '#333' },
  goalTextSelected: { color: '#fff', fontWeight: '600' },
  continueButton: { margin: 20, padding: 16, backgroundColor: '#4A90E2', borderRadius: 8, alignItems: 'center' },
  continueButtonDisabled: { backgroundColor: '#ccc' },
  continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { margin: 20, marginTop: 0, padding: 12, alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#4A90E2' },
});

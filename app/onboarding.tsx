import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingData } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function OnboardingScreen() {
  console.log('[Onboarding] Component rendering');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  
  React.useEffect(() => {
    console.log('[Onboarding] Component mounted');
  }, []);

  const updateData = (field: string, value: any) => {
    console.log(`[Onboarding] Updating ${field}:`, value);
    
    // Validate numeric inputs (now supporting decimals for height, weight, sleepHours)
    if (['age', 'sleepHours', 'stressLevel', 'height', 'weight'].includes(field)) {
      const numValue = parseFloat(value);
      
      // Validate ranges
      if (field === 'age') {
        if (numValue < 12 || numValue > 19) {
          console.warn('[Onboarding] Invalid age:', numValue);
          Alert.alert('Invalid Age', 'Please enter an age between 12 and 19.');
          return;
        }
      } else if (field === 'sleepHours') {
        if (numValue < 1 || numValue > 24) {
          console.warn('[Onboarding] Invalid sleep hours:', numValue);
          Alert.alert('Invalid Input', 'Please enter sleep hours between 1 and 24.');
          return;
        }
      } else if (field === 'stressLevel') {
        if (numValue < 1 || numValue > 10) {
          console.warn('[Onboarding] Invalid stress level:', numValue);
          Alert.alert('Invalid Input', 'Please enter a stress level between 1 and 10.');
          return;
        }
      } else if (field === 'height') {
        if (numValue > 250) {
          console.warn('[Onboarding] Invalid height:', numValue);
          Alert.alert('Invalid Input', 'Please enter a valid height (max 250 cm).');
          return;
        }
      } else if (field === 'weight') {
        if (numValue > 300) {
          console.warn('[Onboarding] Invalid weight:', numValue);
          Alert.alert('Invalid Input', 'Please enter a valid weight (max 300 kg).');
          return;
        }
      }
      
      // Only update if valid
      if (!isNaN(numValue) && numValue > 0) {
        setData({ ...data, [field]: numValue });
      } else if (value === '') {
        // Allow clearing the field
        setData({ ...data, [field]: undefined });
      }
    } else {
      // Non-numeric fields
      setData({ ...data, [field]: value });
    }
  };

  const saveAndContinue = async () => {
    console.log('[Onboarding] saveAndContinue called, step:', step);
    
    // Validate data before proceeding
    if (step === 1) {
      if (data.age && (data.age < 12 || data.age > 19)) {
        Alert.alert('Invalid Age', 'Please enter an age between 12 and 19.');
        return;
      }
      if (data.sleepHours && (data.sleepHours < 1 || data.sleepHours > 24)) {
        Alert.alert('Invalid Input', 'Please enter sleep hours between 1 and 24.');
        return;
      }
      if (data.height && data.height > 250) {
        Alert.alert('Invalid Input', 'Please enter a valid height (max 250 cm).');
        return;
      }
      if (data.weight && data.weight > 300) {
        Alert.alert('Invalid Input', 'Please enter a valid weight (max 300 kg).');
        return;
      }
    }
    
    if (step === 2) {
      if (data.stressLevel && (data.stressLevel < 1 || data.stressLevel > 10)) {
        Alert.alert('Invalid Input', 'Please enter a stress level between 1 and 10.');
        return;
      }
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        console.log('[Onboarding] Saving data:', data);
        const completeData: OnboardingData = {
          ...data as OnboardingData,
          onboardingComplete: true,
          tutorialComplete: false,
        };
        await storage.save(STORAGE_KEYS.ONBOARDING, completeData);
        console.log('[Onboarding] Data saved, navigating to tutorial');
        router.replace('/tutorial');
      } catch (error) {
        console.error('[Onboarding] Error saving onboarding data:', error);
        Alert.alert('Error', 'Failed to save data. Please try again.');
      }
    }
  };

  const canContinue = () => {
    if (step === 1) {
      return data.age && data.age >= 12 && data.age <= 19 && 
             data.activityLevel && 
             data.sleepHours && data.sleepHours > 0 &&
             data.height && data.height > 0 &&
             data.weight && data.weight > 0;
    }
    if (step === 2) {
      return data.stressLevel && data.stressLevel >= 1 && data.stressLevel <= 10 && 
             data.primaryGoal;
    }
    if (step === 3) {
      return data.dietaryPreference;
    }
    return false;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Onboarding Quiz</Text>
        <Text style={styles.stepIndicator}>Step {step} of 3</Text>
      </View>

      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.label}>Age (12-19) *</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="number-pad" 
            value={data.age?.toString() || ''} 
            onChangeText={(text) => {
              // Allow empty string or valid numbers
              if (text === '') {
                setData({ ...data, age: undefined });
              } else {
                const age = parseInt(text);
                if (!isNaN(age) && age >= 0) {
                  setData({ ...data, age });
                }
              }
            }} 
            placeholder="Enter your age (12-19)" 
            maxLength={2}
          />

          <Text style={styles.label}>Activity Level *</Text>
          <View style={styles.buttonGroup}>
            {['Low', 'Medium', 'High'].map((level) => (
              <TouchableOpacity key={level} style={[styles.optionButton, data.activityLevel === level && styles.optionButtonSelected]}
                onPress={() => updateData('activityLevel', level)}>
                <Text style={[styles.optionText, data.activityLevel === level && styles.optionTextSelected]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helperText}>
            Low: Mostly sitting (e.g., studying, gaming) • Medium: Regular walking or light sports • High: Daily intense exercise or sports training
          </Text>

          <Text style={styles.label}>Average Sleep Hours *</Text>
          <View style={styles.inputWithUnit}>
            <TextInput 
              style={styles.inputWithUnitField} 
              keyboardType="decimal-pad" 
              value={data.sleepHours?.toString() || ''}
              onChangeText={(text) => {
                // Allow empty string, numbers, and one decimal point
                if (text === '') {
                  setData({ ...data, sleepHours: undefined });
                } else if (/^\d*\.?\d*$/.test(text)) {
                  const hours = parseFloat(text);
                  if (!isNaN(hours) && hours >= 0) {
                    setData({ ...data, sleepHours: hours });
                  } else if (text.endsWith('.')) {
                    // Allow trailing decimal point while typing
                    setData({ ...data, sleepHours: parseFloat(text.slice(0, -1)) || 0 });
                  }
                }
              }} 
              placeholder="e.g, 7" 
              maxLength={4}
            />
            {data.sleepHours && <Text style={styles.unitLabel}>h</Text>}
          </View>

          <Text style={styles.label}>Height (cm) *</Text>
          <View style={styles.inputWithUnit}>
            <TextInput 
              style={styles.inputWithUnitField} 
              keyboardType="decimal-pad" 
              value={data.height?.toString() || ''}
              onChangeText={(text) => {
                // Allow empty string, numbers, and one decimal point
                if (text === '') {
                  setData({ ...data, height: undefined });
                } else if (/^\d*\.?\d*$/.test(text)) {
                  const height = parseFloat(text);
                  if (!isNaN(height) && height >= 0) {
                    setData({ ...data, height });
                  } else if (text.endsWith('.')) {
                    // Allow trailing decimal point while typing
                    setData({ ...data, height: parseFloat(text.slice(0, -1)) || 0 });
                  }
                }
              }} 
              placeholder="e.g, 175" 
              maxLength={5}
            />
            {data.height && <Text style={styles.unitLabel}>cm</Text>}
          </View>

          <Text style={styles.label}>Weight (kg) *</Text>
          <View style={styles.inputWithUnit}>
            <TextInput 
              style={styles.inputWithUnitField} 
              keyboardType="decimal-pad" 
              value={data.weight?.toString() || ''}
              onChangeText={(text) => {
                // Allow empty string, numbers, and one decimal point
                if (text === '') {
                  setData({ ...data, weight: undefined });
                } else if (/^\d*\.?\d*$/.test(text)) {
                  const weight = parseFloat(text);
                  if (!isNaN(weight) && weight >= 0) {
                    setData({ ...data, weight });
                  } else if (text.endsWith('.')) {
                    // Allow trailing decimal point while typing
                    setData({ ...data, weight: parseFloat(text.slice(0, -1)) || 0 });
                  }
                }
              }} 
              placeholder="e.g, 67" 
              maxLength={5}
            />
            {data.weight && <Text style={styles.unitLabel}>kg</Text>}
          </View>

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
          <TextInput 
            style={styles.input} 
            keyboardType="number-pad" 
            value={data.stressLevel?.toString() || ''}
            onChangeText={(text) => {
              // Allow empty string or valid numbers
              if (text === '') {
                setData({ ...data, stressLevel: undefined });
              } else {
                const stress = parseInt(text);
                if (!isNaN(stress) && stress >= 0) {
                  setData({ ...data, stressLevel: stress });
                }
              }
            }} 
            placeholder="1 (low) to 10 (high)" 
            maxLength={2}
          />

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
  section: { padding: 20, flexGrow: 1 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  helperText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 4, marginTop: 8, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  inputWithUnit: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    backgroundColor: '#fff',
    paddingRight: 12
  },
  inputWithUnitField: { 
    flex: 1, 
    padding: 12, 
    fontSize: 16 
  },
  unitLabel: { 
    fontSize: 16, 
    color: '#666', 
    fontWeight: '500',
    marginLeft: 4
  },
  buttonGroup: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  optionButton: { flex: 1, minWidth: 80, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  optionButtonSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  optionText: { fontSize: 14, color: '#333' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  goalOption: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
  goalOptionSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  goalText: { fontSize: 16, color: '#333' },
  goalTextSelected: { color: '#fff', fontWeight: '600' },
  continueButton: { margin: 20, padding: 16, backgroundColor: '#4A90E2', borderRadius: 8, alignItems: 'center' },
  continueButtonDisabled: { backgroundColor: '#ccc' },
  continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { margin: 20, marginTop: 0, padding: 12, alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#4A90E2' },
});

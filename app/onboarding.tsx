import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingData } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function OnboardingScreen() {
  console.log('[Onboarding] Component rendering');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [stressInputMode, setStressInputMode] = useState<'range' | 'specific'>('range');
  const [goalInfoVisible, setGoalInfoVisible] = useState<string | null>(null);
  const [goalRanks, setGoalRanks] = useState<{[key: string]: number}>({});
  
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
        if (numValue < 0 || numValue > 10) {
          console.warn('[Onboarding] Invalid stress level:', numValue);
          Alert.alert('Invalid Input', 'Please enter a stress level between 0 and 10.');
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
      if (data.stressLevel !== undefined && (data.stressLevel < 0 || data.stressLevel > 10)) {
        Alert.alert('Invalid Input', 'Please enter a stress level between 0 and 10.');
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

  const toggleGoalRank = (goal: string) => {
    const currentRanks = { ...goalRanks };
    if (currentRanks[goal]) {
      // Already ranked, remove it
      delete currentRanks[goal];
    } else {
      // Assign next rank
      const nextRank = Object.keys(currentRanks).length + 1;
      currentRanks[goal] = nextRank;
    }
    setGoalRanks(currentRanks);
    // Store the top priority as primaryGoal for backward compatibility
    const topGoal = Object.entries(currentRanks).find(([_, rank]) => rank === 1)?.[0];
    updateData('primaryGoal', topGoal || '');
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
      return data.stressLevel && data.stressLevel >= 0 && data.stressLevel <= 10 && 
             Object.keys(goalRanks).length > 0;
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
          <Text style={styles.label}>Stress Level (0-10) *</Text>
          <View style={styles.stressModeToggle}>
            <TouchableOpacity 
              style={[styles.modeButton, stressInputMode === 'range' && styles.modeButtonSelected]}
              onPress={() => setStressInputMode('range')}>
              <Text style={[styles.modeButtonText, stressInputMode === 'range' && styles.modeButtonTextSelected]}>Ranges</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, stressInputMode === 'specific' && styles.modeButtonSelected]}
              onPress={() => setStressInputMode('specific')}>
              <Text style={[styles.modeButtonText, stressInputMode === 'specific' && styles.modeButtonTextSelected]}>Specific</Text>
            </TouchableOpacity>
          </View>

          {stressInputMode === 'range' ? (
            <View style={styles.stressRangeContainer}>
              {[
                { range: '0-2', label: 'Very Low', value: 1 },
                { range: '2-4', label: 'Low', value: 3 },
                { range: '4-6', label: 'Moderate', value: 5 },
                { range: '6-8', label: 'High', value: 7 },
                { range: '8-10', label: 'Very High', value: 9 }
              ].map((item) => (
                <TouchableOpacity 
                  key={item.range} 
                  style={[styles.stressRangeButton, data.stressLevel === item.value && styles.stressRangeButtonSelected]}
                  onPress={() => updateData('stressLevel', item.value)}>
                  <Text style={[styles.stressRangeText, data.stressLevel === item.value && styles.stressRangeTextSelected]}>
                    {item.range}
                  </Text>
                  <Text style={[styles.stressRangeLabel, data.stressLevel === item.value && styles.stressRangeLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput 
              style={styles.input} 
              keyboardType="number-pad" 
              value={data.stressLevel?.toString() || ''}
              onChangeText={(text) => {
                if (text === '') {
                  setData({ ...data, stressLevel: undefined });
                } else {
                  const stress = parseInt(text);
                  if (!isNaN(stress) && stress >= 0 && stress <= 10) {
                    setData({ ...data, stressLevel: stress });
                  }
                }
              }} 
              placeholder="Enter 0-10" 
              maxLength={2}
            />
          )}

          <Text style={styles.label}>Your Health Goals (Rank Your Priorities) *</Text>
          <Text style={styles.helperText}>Tap to rank (1 = highest priority)</Text>
          {[
            { 
              goal: 'Living a healthier life', 
              info: 'Better energy, mood, and healthier daily habits'
            },
            { 
              goal: 'Fitness and performance', 
              info: 'Greater strength, endurance, speed, etc.'
            },
            { 
              goal: 'Healthy weight management', 
              info: 'Reach your ideal weight goals'
            }
          ].map(({ goal, info }) => (
            <View key={goal}>
              <TouchableOpacity 
                style={[styles.goalOption, goalRanks[goal] && styles.goalOptionSelected]}
                onPress={() => toggleGoalRank(goal)}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    {goalRanks[goal] && (
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankBadgeText}>{goalRanks[goal]}</Text>
                      </View>
                    )}
                    <Text style={[styles.goalText, goalRanks[goal] && styles.goalTextSelected]}>
                      {goal}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={() => setGoalInfoVisible(goal)}>
                    <Text style={styles.infoButtonText}>ⓘ</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <Modal
                transparent
                visible={goalInfoVisible === goal}
                onRequestClose={() => setGoalInfoVisible(null)}
                animationType="fade">
                <TouchableOpacity 
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setGoalInfoVisible(null)}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{goal}</Text>
                    <Text style={styles.modalText}>{info}</Text>
                    <TouchableOpacity 
                      style={styles.modalButton}
                      onPress={() => setGoalInfoVisible(null)}>
                      <Text style={styles.modalButtonText}>Got it</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
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
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  goalText: { fontSize: 16, color: '#333', flex: 1 },
  goalTextSelected: { color: '#fff', fontWeight: '600' },
  rankBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankBadgeText: { fontSize: 16, fontWeight: 'bold', color: '#4A90E2' },
  infoButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  infoButtonText: { fontSize: 20, color: '#666' },
  stressModeToggle: { flexDirection: 'row', marginBottom: 12, gap: 10 },
  modeButton: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', backgroundColor: '#fff' },
  modeButtonSelected: { backgroundColor: '#E8F4FF', borderColor: '#4A90E2' },
  modeButtonText: { fontSize: 14, color: '#666' },
  modeButtonTextSelected: { color: '#4A90E2', fontWeight: '600' },
  stressRangeContainer: { gap: 8 },
  stressRangeButton: { padding: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
  stressRangeButtonSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  stressRangeText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  stressRangeTextSelected: { color: '#fff' },
  stressRangeLabel: { fontSize: 13, color: '#666' },
  stressRangeLabelSelected: { color: '#fff', opacity: 0.9 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, maxWidth: 400, width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  modalText: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  modalButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  continueButton: { margin: 20, padding: 16, backgroundColor: '#4A90E2', borderRadius: 8, alignItems: 'center' },
  continueButtonDisabled: { backgroundColor: '#ccc' },
  continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { margin: 20, marginTop: 0, padding: 12, alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#4A90E2' },
});

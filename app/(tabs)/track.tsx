import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function TrackScreen() {
  const [todayLog, setTodayLog] = useState<any>(null);
  const [weekLogs, setWeekLogs] = useState<any[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanStep, setScanStep] = useState(1);
  const [editingLog, setEditingLog] = useState<any>({
    nutrition: { caloriesIn: '', protein: '', fibre: '', water: '' },
    activity: { steps: '', activeMinutes: '', exercise: '' },
    recovery: { sleepDuration: '', stress: '', energyLevel: '' },
  });

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    const logs = (await storage.load(STORAGE_KEYS.DAILY_LOGS) || {}) as any;
    const today = new Date().toISOString().split('T')[0];
    setTodayLog(logs[today] || { date: today, nutrition: {}, activity: {}, recovery: {}, bodyMetric: {}, tags: [] });
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(logs[dateStr] || { date: dateStr, nutrition: {}, activity: {}, recovery: {} });
    }
    setWeekLogs(last7Days);
  };

  const calculateAverage = (field: string, subField?: string) => {
    let values = weekLogs.map(log => subField ? log[field]?.[subField] : log[field]).filter(v => v !== undefined && v !== null && v > 0);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const openLogForm = () => {
    setEditingLog({
      nutrition: {
        caloriesIn: todayLog?.nutrition?.caloriesIn?.toString() || '',
        protein: todayLog?.nutrition?.protein?.toString() || '',
        fibre: todayLog?.nutrition?.fibre?.toString() || '',
        water: todayLog?.nutrition?.water?.toString() || '',
      },
      activity: {
        steps: todayLog?.activity?.steps?.toString() || '',
        activeMinutes: todayLog?.activity?.activeMinutes?.toString() || '',
        exercise: todayLog?.activity?.exercise || '',
      },
      recovery: {
        sleepDuration: todayLog?.recovery?.sleepDuration?.toString() || '',
        stress: todayLog?.recovery?.stress?.toString() || '',
        energyLevel: todayLog?.recovery?.energyLevel?.toString() || '',
      },
    });
    setShowLogModal(true);
  };

  const saveLog = async () => {
    const logs = (await storage.load(STORAGE_KEYS.DAILY_LOGS) || {}) as any;
    const today = new Date().toISOString().split('T')[0];
    logs[today] = {
      date: today,
      nutrition: {
        caloriesIn: parseFloat(editingLog.nutrition.caloriesIn) || 0,
        protein: parseFloat(editingLog.nutrition.protein) || 0,
        fibre: parseFloat(editingLog.nutrition.fibre) || 0,
        water: parseFloat(editingLog.nutrition.water) || 0,
      },
      activity: {
        steps: parseInt(editingLog.activity.steps) || 0,
        activeMinutes: parseInt(editingLog.activity.activeMinutes) || 0,
        exercise: editingLog.activity.exercise,
      },
      recovery: {
        sleepDuration: parseFloat(editingLog.recovery.sleepDuration) || 0,
        stress: parseInt(editingLog.recovery.stress) || 0,
        energyLevel: parseInt(editingLog.recovery.energyLevel) || 0,
      },
    };
    await storage.save(STORAGE_KEYS.DAILY_LOGS, logs);
    setShowLogModal(false);
    loadTrackingData();
    Alert.alert('Saved!', 'Your daily log has been saved successfully.');
  };

  const startScan = () => {
    setScanStep(1);
    setShowScanModal(true);
  };

  const completeScan = () => {
    setShowScanModal(false);
    Alert.alert('Meal Scanned!', 'Estimated: 450 calories, 25g protein. Added to today\'s log!', [
      { text: 'OK', onPress: () => loadTrackingData() }
    ]);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Track Your Progress</Text>
          <Text style={styles.subtitle}>Monitor your daily health metrics</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nutrition</Text>
            <Text>Calories: {todayLog?.nutrition?.caloriesIn || 0} kcal</Text>
            <Text>Protein: {todayLog?.nutrition?.protein || 0}g</Text>
            <Text>Fibre: {todayLog?.nutrition?.fibre || 0}g</Text>
            <Text>Water: {todayLog?.nutrition?.water || 0}ml</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Activity</Text>
            <Text>Steps: {todayLog?.activity?.steps || 0}</Text>
            <Text>Active Minutes: {todayLog?.activity?.activeMinutes || 0}</Text>
            <Text>Exercise: {todayLog?.activity?.exercise || 'None logged'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recovery</Text>
            <Text>Sleep: {todayLog?.recovery?.sleepDuration || 0}h</Text>
            <Text>Stress Level: {todayLog?.recovery?.stress || 0}/10</Text>
            <Text>Energy: {todayLog?.recovery?.energyLevel || 0}/10</Text>
          </View>
          <TouchableOpacity style={styles.logButton} onPress={openLogForm}>
            <Text style={styles.logButtonText}>+ Log Today's Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} onPress={startScan}>
            <Text style={styles.scanButtonText}>📸 Scan Meal Assist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Trends</Text>
          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>Average Sleep</Text>
            <Text style={styles.trendValue}>{calculateAverage('recovery', 'sleepDuration')}h</Text>
          </View>
          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>Average Steps</Text>
            <Text style={styles.trendValue}>{calculateAverage('activity', 'steps')}</Text>
          </View>
          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>Average Water</Text>
            <Text style={styles.trendValue}>{calculateAverage('nutrition', 'water')}ml</Text>
          </View>
          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>Average Calories</Text>
            <Text style={styles.trendValue}>{calculateAverage('nutrition', 'caloriesIn')} kcal</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💤 Sleep Pattern</Text>
            <Text>Your average sleep is {calculateAverage('recovery', 'sleepDuration')} hours. {parseFloat(calculateAverage('recovery', 'sleepDuration')) >= 8 ? 'Great job! Keep it up!' : 'Aim for 8-10 hours to support growth and recovery!'}</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💧 Hydration</Text>
            <Text>{parseFloat(calculateAverage('nutrition', 'water')) >= 2000 ? 'Excellent hydration! You\'re doing great!' : 'Try to drink at least 2L of water daily for optimal health.'}</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🏃 Activity</Text>
            <Text>{parseFloat(calculateAverage('activity', 'steps')) >= 8000 ? 'Amazing! You\'re hitting your step goals!' : 'Aim for 8,000-10,000 steps daily for better health.'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Log Data Modal */}
      <Modal visible={showLogModal} animationType="slide" transparent={false}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Today's Data</Text>
            <TouchableOpacity onPress={() => setShowLogModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Nutrition</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Calories In (kcal)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={editingLog.nutrition.caloriesIn}
                onChangeText={(v) => setEditingLog({...editingLog, nutrition: {...editingLog.nutrition, caloriesIn: v}})}
                placeholder="e.g., 1800"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={editingLog.nutrition.protein}
                onChangeText={(v) => setEditingLog({...editingLog, nutrition: {...editingLog.nutrition, protein: v}})}
                placeholder="e.g., 80"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Fibre (g)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={editingLog.nutrition.fibre}
                onChangeText={(v) => setEditingLog({...editingLog, nutrition: {...editingLog.nutrition, fibre: v}})}
                placeholder="e.g., 25"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Water (ml)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={editingLog.nutrition.water}
                onChangeText={(v) => setEditingLog({...editingLog, nutrition: {...editingLog.nutrition, water: v}})}
                placeholder="e.g., 2000"
              />
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Activity</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Steps</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={editingLog.activity.steps}
                onChangeText={(v) => setEditingLog({...editingLog, activity: {...editingLog.activity, steps: v}})}
                placeholder="e.g., 8000"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Active Minutes</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={editingLog.activity.activeMinutes}
                onChangeText={(v) => setEditingLog({...editingLog, activity: {...editingLog.activity, activeMinutes: v}})}
                placeholder="e.g., 60"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Exercise Type</Text>
              <TextInput
                style={styles.textInput}
                value={editingLog.activity.exercise}
                onChangeText={(v) => setEditingLog({...editingLog, activity: {...editingLog.activity, exercise: v}})}
                placeholder="e.g., Basketball, Running"
              />
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Recovery</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Sleep Duration (hours)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                value={editingLog.recovery.sleepDuration}
                onChangeText={(v) => setEditingLog({...editingLog, recovery: {...editingLog.recovery, sleepDuration: v}})}
                placeholder="e.g., 8.5"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Stress Level (1-10)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={editingLog.recovery.stress}
                onChangeText={(v) => setEditingLog({...editingLog, recovery: {...editingLog.recovery, stress: v}})}
                placeholder="e.g., 5"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Energy Level (1-10)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={editingLog.recovery.energyLevel}
                onChangeText={(v) => setEditingLog({...editingLog, recovery: {...editingLog.recovery, energyLevel: v}})}
                placeholder="e.g., 7"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveLog}>
            <Text style={styles.saveButtonText}>Save Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLogModal(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Scan Meal Modal */}
      <Modal visible={showScanModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan Meal Assist</Text>
            <TouchableOpacity onPress={() => setShowScanModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scanContent}>
            {scanStep === 1 && (
              <View style={styles.scanStep}>
                <Text style={styles.scanStepTitle}>Step 1: Take Photo</Text>
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>📸</Text>
                  <Text>Camera would open here</Text>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={() => setScanStep(2)}>
                  <Text style={styles.nextButtonText}>Photo Taken → Next</Text>
                </TouchableOpacity>
              </View>
            )}
            {scanStep === 2 && (
              <View style={styles.scanStep}>
                <Text style={styles.scanStepTitle}>Step 2: Answer Questions</Text>
                <Text style={styles.questionText}>What type of meal is this?</Text>
                <View style={styles.optionsGrid}>
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((opt) => (
                    <TouchableOpacity key={opt} style={styles.optionButton}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.questionText}>Portion size?</Text>
                <View style={styles.optionsGrid}>
                  {['Small', 'Medium', 'Large'].map((opt) => (
                    <TouchableOpacity key={opt} style={styles.optionButton}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={() => setScanStep(3)}>
                  <Text style={styles.nextButtonText}>Next →</Text>
                </TouchableOpacity>
              </View>
            )}
            {scanStep === 3 && (
              <View style={styles.scanStep}>
                <Text style={styles.scanStepTitle}>Step 3: Review Estimate</Text>
                <View style={styles.estimateCard}>
                  <Text style={styles.estimateTitle}>Estimated Nutrition</Text>
                  <Text>Calories: ~450 kcal</Text>
                  <Text>Protein: ~25g</Text>
                  <Text>Carbs: ~55g</Text>
                  <Text>Fat: ~15g</Text>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={completeScan}>
                  <Text style={styles.nextButtonText}>Confirm & Log</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setScanStep(2)}>
                  <Text style={styles.cancelButtonText}>← Back to Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#4A90E2' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' },
  logButton: { backgroundColor: '#4A90E2', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  logButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  scanButton: { backgroundColor: '#50C878', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  scanButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  trendCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendLabel: { fontSize: 14, color: '#666' },
  trendValue: { fontSize: 20, fontWeight: 'bold', color: '#4A90E2' },
  insightCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  insightTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
  
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#4A90E2' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  closeButton: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
  modalSection: { padding: 16, backgroundColor: '#fff', marginBottom: 12 },
  modalSectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  inputRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  textInput: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#ddd' },
  saveButton: { margin: 16, padding: 16, backgroundColor: '#4A90E2', borderRadius: 12, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cancelButton: { margin: 16, marginTop: 0, padding: 14, alignItems: 'center' },
  cancelButtonText: { fontSize: 15, color: '#666', fontWeight: '600' },
  
  // Scan modal styles
  scanContent: { flex: 1, padding: 16 },
  scanStep: { alignItems: 'center' },
  scanStepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  photoPlaceholder: { width: 300, height: 300, backgroundColor: '#f0f0f0', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  photoPlaceholderText: { fontSize: 80 },
  nextButton: { width: '100%', backgroundColor: '#50C878', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  nextButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  questionText: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 12, color: '#333', alignSelf: 'flex-start', width: '100%' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', marginBottom: 16 },
  optionButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#4A90E2' },
  estimateCard: { backgroundColor: '#E8F5E9', padding: 20, borderRadius: 12, marginBottom: 20, width: '100%' },
  estimateTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
});

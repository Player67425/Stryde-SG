import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function TrackScreen() {
  const [todayLog, setTodayLog] = useState<any>(null);
  const [weekLogs, setWeekLogs] = useState<any[]>([]);

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
    let values = weekLogs.map(log => subField ? log[field]?.[subField] : log[field]).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
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
          <Text>Water: {todayLog?.nutrition?.water || 0}ml</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity</Text>
          <Text>Steps: {todayLog?.activity?.steps || 0}</Text>
          <Text>Active Minutes: {todayLog?.activity?.activeMinutes || 0}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recovery</Text>
          <Text>Sleep: {todayLog?.recovery?.sleepDuration || 0}h</Text>
          <Text>Stress Level: {todayLog?.recovery?.stress || 0}/10</Text>
          <Text>Energy: {todayLog?.recovery?.energyLevel || 0}/10</Text>
        </View>
        <TouchableOpacity style={styles.logButton} onPress={() => Alert.alert('Log Data', 'Logging interface: Enter your nutrition, activity, sleep, etc. Full form would appear here.')}>
          <Text style={styles.logButtonText}>+ Log Today's Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={() => Alert.alert('Scan Meal Assist', 'Workflow: 1) Take photo 2) Answer: Meal type? Portion size? Drink? Cooking style? 3) Get estimate 4) Edit & log. Each question has ⓘ info button with "Ask AI" option.')}>
          <Text style={styles.scanButtonText}>📸 Scan Meal Assist</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7-Day Trends</Text>
        <View style={styles.trendCard}>
          <Text>Average Sleep: {calculateAverage('recovery', 'sleepDuration')}h</Text>
        </View>
        <View style={styles.trendCard}>
          <Text>Average Steps: {calculateAverage('activity', 'steps')}</Text>
        </View>
        <View style={styles.trendCard}>
          <Text>Average Water: {calculateAverage('nutrition', 'water')}ml</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💤 Sleep Pattern</Text>
          <Text>Your average sleep is {calculateAverage('recovery', 'sleepDuration')} hours. Aim for 8-10 hours to support growth and recovery!</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💧 Hydration</Text>
          <Text>Keep up staying hydrated! Try to drink water consistently throughout the day.</Text>
        </View>
      </View>
    </ScrollView>
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
  trendCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  insightCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  insightTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
});

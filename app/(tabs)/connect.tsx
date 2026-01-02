import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sgEvents } from '@/data/content';

export default function ConnectScreen() {
  const [quests] = useState([
    { id: '1', title: 'Daily Steps Challenge', description: '8,000 steps today', target: 8000, progress: 5230, difficulty: 'Standard', type: 'daily' },
    { id: '2', title: 'Hydration Hero', description: 'Drink 2L water', target: 2000, progress: 1500, difficulty: 'Easy', type: 'daily' },
  ]);

  const [badges] = useState([
    { id: '1', title: '7-Day Streak', earned: true },
    { id: '2', title: 'First Quest', earned: true },
    { id: '3', title: 'Team Player', earned: false },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect & Grow</Text>
        <Text style={styles.subtitle}>Social Stars: Quests, Teams & Events</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Quests</Text>
        {quests.filter(q => q.type === 'daily').map((quest) => (
          <View key={quest.id} style={styles.questCard}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text>{quest.description}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(quest.progress / quest.target) * 100}%` }]} />
            </View>
            <Text>{quest.progress} / {quest.target}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Quest Difficulty', 'Choose: Easy / Standard / Stretch. AI personalizes based on your last 7 days.')}>
          <Text style={styles.actionButtonText}>⚙️ Adjust Difficulty</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges & Streaks</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={[styles.badge, !badge.earned && styles.badgeLocked]}>
              <Text style={styles.badgeIcon}>{badge.earned ? '🏆' : '🔒'}</Text>
              <Text>{badge.title}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Create Team', 'Create team, add members. Each member gets personalized tasks. Team progress = all complete!')}>
          <Text style={styles.actionButtonText}>+ Create Team</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Singapore Events</Text>
        {sgEvents.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => Alert.alert(event.title, `${event.description}\n\nDate: ${event.date}\nLocation: ${event.location}\n${event.free ? 'FREE' : 'Paid'}`)}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>📅 {event.date}</Text>
            <Text>📍 {event.location}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FF6B6B' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  questCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  questTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: '#eee', borderRadius: 4, marginVertical: 8 },
  progressFill: { height: '100%', backgroundColor: '#FF6B6B', borderRadius: 4 },
  actionButton: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  actionButtonText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '47%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { fontSize: 40, marginBottom: 8 },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
});

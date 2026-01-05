import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { sgEvents } from '@/data/content';

export default function ConnectScreen() {
  const [quests, setQuests] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamGoal, setNewTeamGoal] = useState('');

  useEffect(() => {
    loadConnectData();
  }, []);

  const loadConnectData = async () => {
    // Load quests from storage or initialize defaults
    const storedQuests = await storage.load(STORAGE_KEYS.QUESTS) || [
      { id: '1', title: 'Daily Steps Challenge', description: '8,000 steps today', target: 8000, progress: 0, difficulty: 'Standard', type: 'daily', completed: false },
      { id: '2', title: 'Hydration Hero', description: 'Drink 2L water', target: 2000, progress: 0, difficulty: 'Easy', type: 'daily', completed: false },
      { id: '3', title: 'Sleep Well', description: 'Get 8+ hours sleep for 7 days', target: 7, progress: 0, difficulty: 'Standard', type: 'weekly', completed: false },
    ];
    setQuests(storedQuests);

    // Load badges
    const storedBadges = await storage.load(STORAGE_KEYS.BADGES) || [
      { id: '1', title: '7-Day Streak', earned: false, description: 'Log data for 7 consecutive days' },
      { id: '2', title: 'First Quest', earned: false, description: 'Complete your first quest' },
      { id: '3', title: 'Team Player', earned: false, description: 'Join or create a team' },
      { id: '4', title: 'Hydration Master', earned: false, description: 'Meet water goal for 14 days' },
      { id: '5', title: 'Sleep Champion', earned: false, description: 'Sleep 8+ hours for 30 days' },
      { id: '6', title: 'Step Hero', earned: false, description: 'Reach 10,000 steps in a day' },
    ];
    setBadges(storedBadges);

    // Load teams
    const storedTeams = await storage.load(STORAGE_KEYS.TEAMS) || [];
    setTeams(storedTeams);

    // Load RSVPs
    const storedRsvps = await storage.load(STORAGE_KEYS.EVENT_RSVPS) || [];
    setRsvpEvents(storedRsvps);
  };

  const updateQuestProgress = async (questId: string, newProgress: number) => {
    const updated = quests.map(q => {
      if (q.id === questId) {
        const completed = newProgress >= q.target;
        return { ...q, progress: newProgress, completed };
      }
      return q;
    });
    setQuests(updated);
    await storage.save(STORAGE_KEYS.QUESTS, updated);

    // Check if this was first quest completion
    const justCompleted = updated.find(q => q.id === questId && q.completed);
    if (justCompleted && !badges.find(b => b.id === '2' && b.earned)) {
      earnBadge('2');
    }
  };

  const earnBadge = async (badgeId: string) => {
    const updated = badges.map(b => b.id === badgeId ? { ...b, earned: true } : b);
    setBadges(updated);
    await storage.save(STORAGE_KEYS.BADGES, updated);
    const badge = updated.find(b => b.id === badgeId);
    Alert.alert('🏆 Badge Earned!', `You earned: ${badge?.title}`);
  };

  const adjustDifficulty = (questId: string, difficulty: 'Easy' | 'Standard' | 'Stretch') => {
    const updated = quests.map(q => {
      if (q.id === questId) {
        let newTarget = q.target;
        if (q.title.includes('Steps')) {
          newTarget = difficulty === 'Easy' ? 5000 : difficulty === 'Standard' ? 8000 : 10000;
        } else if (q.title.includes('Hydration')) {
          newTarget = difficulty === 'Easy' ? 1500 : difficulty === 'Standard' ? 2000 : 2500;
        }
        return { ...q, difficulty, target: newTarget };
      }
      return q;
    });
    setQuests(updated);
    storage.save(STORAGE_KEYS.QUESTS, updated);
    Alert.alert('Updated!', `Quest difficulty set to ${difficulty}`);
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    const newTeam = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      goal: newTeamGoal.trim() || 'Stay healthy together',
      members: ['You'],
      created: new Date().toISOString(),
    };
    const updated = [...teams, newTeam];
    setTeams(updated);
    await storage.save(STORAGE_KEYS.TEAMS, updated);
    setShowCreateTeam(false);
    setNewTeamName('');
    setNewTeamGoal('');
    Alert.alert('Team Created!', `${newTeam.name} is ready to go!`);
    
    // Earn team badge if first team
    if (updated.length === 1 && !badges.find(b => b.id === '3' && b.earned)) {
      earnBadge('3');
    }
  };

  const toggleRsvp = async (eventId: string) => {
    const updated = rsvpEvents.includes(eventId)
      ? rsvpEvents.filter(id => id !== eventId)
      : [...rsvpEvents, eventId];
    setRsvpEvents(updated);
    await storage.save(STORAGE_KEYS.EVENT_RSVPS, updated);
    Alert.alert(
      updated.includes(eventId) ? 'RSVP Confirmed!' : 'RSVP Cancelled',
      updated.includes(eventId) ? 'See you at the event!' : 'Your RSVP has been removed.'
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect & Grow</Text>
          <Text style={styles.subtitle}>Quests, Teams & Events</Text>
        </View>

        {/* Daily Quests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          {quests.filter(q => q.type === 'daily').map((quest) => (
            <View key={quest.id} style={[styles.questCard, quest.completed && styles.questCompleted]}>
              <View style={styles.questHeader}>
                <Text style={styles.questTitle}>{quest.completed ? '✅ ' : ''}{quest.title}</Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert('Adjust Difficulty', 'Choose difficulty level:', [
                    { text: 'Easy', onPress: () => adjustDifficulty(quest.id, 'Easy') },
                    { text: 'Standard', onPress: () => adjustDifficulty(quest.id, 'Standard') },
                    { text: 'Stretch', onPress: () => adjustDifficulty(quest.id, 'Stretch') },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}>
                  <Text style={styles.difficultyBadge}>{quest.difficulty}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }]} />
              </View>
              <View style={styles.progressRow}>
                <Text>{quest.progress} / {quest.target}</Text>
                {!quest.completed && (
                  <TouchableOpacity onPress={() => updateQuestProgress(quest.id, quest.progress + Math.floor(quest.target * 0.2))}>
                    <Text style={styles.updateButton}>+ Update Progress</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {/* Weekly Quests */}
          {quests.filter(q => q.type === 'weekly').length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Weekly Quests</Text>
              {quests.filter(q => q.type === 'weekly').map((quest) => (
                <View key={quest.id} style={[styles.questCard, quest.completed && styles.questCompleted]}>
                  <Text style={styles.questTitle}>{quest.completed ? '✅ ' : ''}{quest.title}</Text>
                  <Text style={styles.questDescription}>{quest.description}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }]} />
                  </View>
                  <View style={styles.progressRow}>
                    <Text>Day {quest.progress} / {quest.target}</Text>
                    {!quest.completed && (
                      <TouchableOpacity onPress={() => updateQuestProgress(quest.id, quest.progress + 1)}>
                        <Text style={styles.updateButton}>+ Day Complete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Badges & Streaks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges & Achievements</Text>
          <View style={styles.badgeGrid}>
            {badges.map((badge) => (
              <TouchableOpacity 
                key={badge.id} 
                style={[styles.badge, !badge.earned && styles.badgeLocked]}
                onPress={() => Alert.alert(badge.title, badge.description)}
              >
                <Text style={styles.badgeIcon}>{badge.earned ? '🏆' : '🔒'}</Text>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Teams */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teams</Text>
          {teams.length === 0 ? (
            <Text style={styles.emptyText}>No teams yet. Create one to collaborate!</Text>
          ) : (
            teams.map((team) => (
              <View key={team.id} style={styles.teamCard}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamGoal}>{team.goal}</Text>
                <Text style={styles.teamMembers}>Members: {team.members.join(', ')}</Text>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowCreateTeam(true)}>
            <Text style={styles.actionButtonText}>+ Create Team</Text>
          </TouchableOpacity>
        </View>

        {/* Singapore Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Singapore Events</Text>
          {sgEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>📅 {event.date}</Text>
              <Text style={styles.eventDetail}>📍 {event.location}</Text>
              <Text style={styles.eventDetail}>{event.free ? '🎉 FREE' : '💵 Paid'}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <TouchableOpacity 
                style={[styles.rsvpButton, rsvpEvents.includes(event.id) && styles.rsvpButtonActive]}
                onPress={() => toggleRsvp(event.id)}
              >
                <Text style={[styles.rsvpButtonText, rsvpEvents.includes(event.id) && styles.rsvpButtonTextActive]}>
                  {rsvpEvents.includes(event.id) ? '✓ RSVP\'d' : 'RSVP'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Create Team Modal */}
      <Modal visible={showCreateTeam} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Team</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Team Goal (optional)"
              value={newTeamGoal}
              onChangeText={setNewTeamGoal}
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={createTeam}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowCreateTeam(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FF6B6B' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subsectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 12, color: '#333' },
  questCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  questCompleted: { backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: '#4CAF50' },
  questHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  questTitle: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1 },
  questDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  difficultyBadge: { fontSize: 12, fontWeight: 'bold', color: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FFE0E0', borderRadius: 12 },
  progressBar: { height: 10, backgroundColor: '#eee', borderRadius: 5, marginVertical: 8 },
  progressFill: { height: '100%', backgroundColor: '#FF6B6B', borderRadius: 5 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  updateButton: { color: '#FF6B6B', fontWeight: '600', fontSize: 14 },
  actionButton: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  actionButtonText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '47%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { fontSize: 40, marginBottom: 8 },
  badgeTitle: { fontSize: 12, textAlign: 'center', fontWeight: '600' },
  emptyText: { fontSize: 14, color: '#999', fontStyle: 'italic', marginBottom: 12 },
  teamCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  teamName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  teamGoal: { fontSize: 14, color: '#666', marginBottom: 8 },
  teamMembers: { fontSize: 13, color: '#999' },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 6 },
  eventDetail: { fontSize: 14, color: '#666', marginBottom: 4 },
  eventDescription: { fontSize: 13, color: '#999', marginTop: 6, marginBottom: 10 },
  rsvpButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FF6B6B', borderRadius: 8, alignItems: 'center', marginTop: 8 },
  rsvpButtonActive: { backgroundColor: '#4CAF50' },
  rsvpButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  rsvpButtonTextActive: { color: '#fff' },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333', textAlign: 'center' },
  modalInput: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  modalTextArea: { minHeight: 80, textAlignVertical: 'top' },
  modalButton: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  modalButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  modalCancelButton: { padding: 12, alignItems: 'center' },
  modalCancelButtonText: { fontSize: 15, color: '#666', fontWeight: '600' },
});

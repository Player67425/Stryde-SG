import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function ReflectScreen() {
  const [mood, setMood] = useState(5);
  const [entryMode, setEntryMode] = useState<'1 min' | '5 min' | '10 min' | 'free' | null>(null);
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const journal = (await storage.load(STORAGE_KEYS.JOURNAL) || []) as any[];
    setEntries(journal.slice(0, 5));
  };

  const saveEntry = async () => {
    if (!entryMode || !content.trim()) {
      Alert.alert('Complete Entry', 'Please select a mode and write something.');
      return;
    }
    const newEntry = { id: Date.now().toString(), date: new Date().toISOString(), mood, mode: entryMode, content: content.trim(), tags: [] };
    const journal = (await storage.load(STORAGE_KEYS.JOURNAL) || []) as any[];
    journal.unshift(newEntry);
    await storage.save(STORAGE_KEYS.JOURNAL, journal);
    Alert.alert('Saved!', 'Your reflection has been saved.');
    setContent('');
    setEntryMode(null);
    setMood(5);
    loadEntries();
  };

  const getPromptForMode = () => {
    if (entryMode === '1 min') return 'Quick check-in: How are you feeling right now?';
    if (entryMode === '5 min') return 'What went well today? What was challenging?';
    if (entryMode === '10 min') return 'Reflect deeply: How are your habits supporting your goals?';
    return 'Write freely about whatever is on your mind...';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reflect & Grow</Text>
        <Text style={styles.subtitle}>Journal your journey</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Entry</Text>
        <Text style={styles.label}>Mood (1-10)</Text>
        <View style={styles.moodSlider}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity key={num} style={[styles.moodButton, mood === num && styles.moodButtonSelected]} onPress={() => setMood(num)}>
              <Text style={[styles.moodButtonText, mood === num && styles.moodButtonTextSelected]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Choose Entry Mode</Text>
        <View style={styles.modeButtons}>
          {(['1 min', '5 min', '10 min', 'free'] as const).map((mode) => (
            <TouchableOpacity key={mode} style={[styles.modeButton, entryMode === mode && styles.modeButtonSelected]} onPress={() => setEntryMode(mode)}>
              <Text>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {entryMode && (
          <>
            <Text style={styles.promptText}>{getPromptForMode()}</Text>
            <TextInput style={styles.textInput} multiline placeholder="Write here..." value={content} onChangeText={setContent} numberOfLines={8} />
            <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Support</Text>
        <View style={styles.aiCard}>
          <Text>💡 Based on your tracking, your sleep has been lower this week. How has this affected your energy?</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Patterns</Text>
        <View style={styles.patternCard}>
          <Text style={styles.patternTitle}>Mood vs Sleep</Text>
          <Text>When you sleep 8+ hours, your mood averages 7.5/10. Less than 7 hours: 5.2/10.</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {entries.length === 0 ? (
          <Text>No entries yet. Start journaling above!</Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <Text>Mood: {entry.mood}/10 • {entry.mode}</Text>
              <Text numberOfLines={2}>{entry.content}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#9B59B6' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  moodSlider: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  moodButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  moodButtonSelected: { borderColor: '#9B59B6', backgroundColor: '#9B59B6' },
  moodButtonText: { fontSize: 14, color: '#666', fontWeight: '600' },
  moodButtonTextSelected: { color: '#fff' },
  modeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  modeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  modeButtonSelected: { backgroundColor: '#9B59B6', borderColor: '#9B59B6' },
  promptText: { fontSize: 15, color: '#666', marginBottom: 12, fontStyle: 'italic' },
  textInput: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 15, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#ddd', marginBottom: 12 },
  saveButton: { backgroundColor: '#9B59B6', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  aiCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  patternCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  patternTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
  entryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
});

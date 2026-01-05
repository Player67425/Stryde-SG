import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function ReflectScreen() {
  const [mood, setMood] = useState(5);
  const [entryMode, setEntryMode] = useState<'1 min' | '5 min' | '10 min' | 'free' | null>(null);
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<any>(null);

  const availableTags = ['Grateful', 'Proud', 'Challenged', 'Anxious', 'Energized', 'Tired', 'Social', 'Productive', 'Reflective'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const journal = (await storage.load(STORAGE_KEYS.JOURNAL) || []) as any[];
    setEntries(journal);
  };

  const saveEntry = async () => {
    if (!entryMode || !content.trim()) {
      Alert.alert('Complete Entry', 'Please select a mode and write something.');
      return;
    }
    const newEntry = { 
      id: Date.now().toString(), 
      date: new Date().toISOString(), 
      mood, 
      mode: entryMode, 
      content: content.trim(), 
      tags: selectedTags 
    };
    const journal = (await storage.load(STORAGE_KEYS.JOURNAL) || []) as any[];
    journal.unshift(newEntry);
    await storage.save(STORAGE_KEYS.JOURNAL, journal);
    Alert.alert('Saved!', 'Your reflection has been saved.');
    setContent('');
    setEntryMode(null);
    setMood(5);
    setSelectedTags([]);
    loadEntries();
  };

  const deleteEntry = async (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this reflection?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const filtered = entries.filter(e => e.id !== entryId);
            await storage.save(STORAGE_KEYS.JOURNAL, filtered);
            setEntries(filtered);
            setViewingEntry(null);
            Alert.alert('Deleted', 'Your reflection has been removed.');
          }
        },
      ]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getPromptForMode = () => {
    if (entryMode === '1 min') return 'Quick check-in: How are you feeling right now?';
    if (entryMode === '5 min') return 'What went well today? What was challenging?';
    if (entryMode === '10 min') return 'Reflect deeply: How are your habits supporting your goals?';
    return 'Write freely about whatever is on your mind...';
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const displayedEntries = showAllEntries ? filteredEntries : filteredEntries.slice(0, 5);

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 3) return '😔';
    if (moodValue <= 5) return '😐';
    if (moodValue <= 7) return '🙂';
    return '😊';
  };

  const calculateMoodAverage = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + e.mood, 0);
    return (sum / entries.length).toFixed(1);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reflect & Grow</Text>
          <Text style={styles.subtitle}>Journal your journey</Text>
        </View>
        
        {/* New Entry Section */}
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
                <Text style={entryMode === mode && styles.modeButtonTextSelected}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {entryMode && (
            <>
              <Text style={styles.promptText}>{getPromptForMode()}</Text>
              <TextInput style={styles.textInput} multiline placeholder="Write here..." value={content} onChangeText={setContent} numberOfLines={8} />
              
              <Text style={styles.label}>Tags (optional)</Text>
              <View style={styles.tagsContainer}>
                {availableTags.map(tag => (
                  <TouchableOpacity 
                    key={tag}
                    style={[styles.tagButton, selectedTags.includes(tag) && styles.tagButtonSelected]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagButtonText, selectedTags.includes(tag) && styles.tagButtonTextSelected]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* AI Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.aiCard}>
            <Text style={styles.aiCardText}>💡 Your average mood is {calculateMoodAverage()}/10. {parseFloat(calculateMoodAverage()) >= 7 ? 'You\'re doing great!' : 'Consider what factors might be affecting your mood.'}</Text>
          </View>
          {entries.length >= 3 && (
            <View style={styles.aiCard}>
              <Text style={styles.aiCardText}>📊 You've journaled {entries.length} times. Consistent reflection helps with self-awareness and growth!</Text>
            </View>
          )}
        </View>

        {/* Progress Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Patterns</Text>
          <View style={styles.patternCard}>
            <Text style={styles.patternTitle}>Recent Mood Trend</Text>
            <View style={styles.moodHistory}>
              {entries.slice(0, 7).reverse().map((entry, index) => (
                <View key={entry.id} style={styles.moodHistoryItem}>
                  <Text style={styles.moodHistoryEmoji}>{getMoodEmoji(entry.mood)}</Text>
                  <Text style={styles.moodHistoryValue}>{entry.mood}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Search & Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Reflections ({filteredEntries.length})</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {displayedEntries.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery ? 'No entries match your search.' : 'No entries yet. Start journaling above!'}
            </Text>
          ) : (
            <>
              {displayedEntries.map((entry) => (
                <TouchableOpacity 
                  key={entry.id} 
                  style={styles.entryCard}
                  onPress={() => setViewingEntry(entry)}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryMood}>{getMoodEmoji(entry.mood)} {entry.mood}/10</Text>
                    <Text style={styles.entryMode}>{entry.mode}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.entryPreview}>{entry.content}</Text>
                  {entry.tags && entry.tags.length > 0 && (
                    <View style={styles.entryTags}>
                      {entry.tags.map((tag: string) => (
                        <Text key={tag} style={styles.entryTag}>{tag}</Text>
                      ))}
                    </View>
                  )}
                  <Text style={styles.entryDate}>{new Date(entry.date).toLocaleDateString()}</Text>
                </TouchableOpacity>
              ))}
              {!showAllEntries && filteredEntries.length > 5 && (
                <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllEntries(true)}>
                  <Text style={styles.showMoreText}>Show All ({filteredEntries.length})</Text>
                </TouchableOpacity>
              )}
              {showAllEntries && filteredEntries.length > 5 && (
                <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllEntries(false)}>
                  <Text style={styles.showMoreText}>Show Less</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* View Entry Modal */}
      {viewingEntry && (
        <Modal visible={true} animationType="slide" transparent={false}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reflection</Text>
              <TouchableOpacity onPress={() => setViewingEntry(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalMoodRow}>
                <Text style={styles.modalMoodEmoji}>{getMoodEmoji(viewingEntry.mood)}</Text>
                <Text style={styles.modalMoodText}>Mood: {viewingEntry.mood}/10</Text>
              </View>
              <Text style={styles.modalMode}>{viewingEntry.mode} entry</Text>
              <Text style={styles.modalDate}>{new Date(viewingEntry.date).toLocaleString()}</Text>
              {viewingEntry.tags && viewingEntry.tags.length > 0 && (
                <View style={styles.modalTags}>
                  {viewingEntry.tags.map((tag: string) => (
                    <Text key={tag} style={styles.modalTag}>{tag}</Text>
                  ))}
                </View>
              )}
              <Text style={styles.modalContentText}>{viewingEntry.content}</Text>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => deleteEntry(viewingEntry.id)}
              >
                <Text style={styles.deleteButtonText}>Delete Entry</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
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
  modeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  modeButtonSelected: { backgroundColor: '#9B59B6', borderColor: '#9B59B6' },
  modeButtonTextSelected: { color: '#fff', fontWeight: '600' },
  promptText: { fontSize: 15, color: '#666', marginBottom: 12, fontStyle: 'italic' },
  textInput: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 15, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#ddd', marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  tagButtonSelected: { backgroundColor: '#9B59B6', borderColor: '#9B59B6' },
  tagButtonText: { fontSize: 13, color: '#666' },
  tagButtonTextSelected: { color: '#fff', fontWeight: '600' },
  saveButton: { backgroundColor: '#9B59B6', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  aiCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  aiCardText: { fontSize: 15, color: '#333', lineHeight: 22 },
  patternCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  patternTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  moodHistory: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  moodHistoryItem: { alignItems: 'center' },
  moodHistoryEmoji: { fontSize: 24, marginBottom: 4 },
  moodHistoryValue: { fontSize: 12, color: '#666' },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  emptyText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  entryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  entryMood: { fontSize: 16, fontWeight: '600', color: '#333' },
  entryMode: { fontSize: 13, color: '#9B59B6', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#F3E5F5', borderRadius: 8 },
  entryPreview: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 20 },
  entryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  entryTag: { fontSize: 11, color: '#9B59B6', backgroundColor: '#F3E5F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  entryDate: { fontSize: 12, color: '#999' },
  showMoreButton: { alignItems: 'center', paddingVertical: 12 },
  showMoreText: { fontSize: 15, color: '#9B59B6', fontWeight: '600' },
  
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#9B59B6' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  closeButton: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
  modalContent: { padding: 16 },
  modalMoodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalMoodEmoji: { fontSize: 40, marginRight: 12 },
  modalMoodText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalMode: { fontSize: 14, color: '#9B59B6', fontWeight: '600', marginBottom: 8 },
  modalDate: { fontSize: 13, color: '#999', marginBottom: 16 },
  modalTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  modalTag: { fontSize: 13, color: '#9B59B6', backgroundColor: '#F3E5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontWeight: '600' },
  modalContentText: { fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 24 },
  deleteButton: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  deleteButtonText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
});

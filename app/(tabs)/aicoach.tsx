import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { aiKnowledgeBase } from '@/data/content';

type AIMode = 'Ask' | 'Coach' | 'Scan' | 'Support' | 'Navigator';

export default function AICoachScreen() {
  const [mode, setMode] = useState<AIMode>('Ask');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your AI Coach. Choose a mode:\n• Ask: Questions\n• Coach: Personalized guidance\n• Scan: Check misinformation\n• Support: Motivation\n• Navigator: Find features\n\nWhat would you like?', timestamp: new Date().toISOString() },
  ]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = (await storage.load(STORAGE_KEYS.AI_HISTORY) || []) as any[];
    if (history.length > 0) setMessages(history.slice(-20));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    const aiResponse = generateAIResponse(input.trim(), mode);
    const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() };
    const updatedMessages = [...newMessages, assistantMessage];
    setMessages(updatedMessages);
    await storage.save(STORAGE_KEYS.AI_HISTORY, updatedMessages);
  };

  const generateAIResponse = (query: string, currentMode: AIMode): string => {
    const lowerQuery = query.toLowerCase();
    
    // Safety guardrails
    if (lowerQuery.includes('starve') || lowerQuery.includes('skip meals') || lowerQuery.includes('extreme diet')) {
      return aiKnowledgeBase.safety.refusal_disordered_eating;
    }
    if (lowerQuery.includes('harm myself')) {
      return aiKnowledgeBase.safety.refusal_self_harm;
    }

    // Scan Mode - Misinformation Scanner
    if (currentMode === 'Scan') {
      if (lowerQuery.includes('carbs') && lowerQuery.includes('fat')) {
        return '🔴 MYTH\\n\\nCarbs don\'t make you fat. Excess calories from any source can lead to weight gain. Carbs fuel your brain!\\n\\n📚 Learn more in "Myths & Misinformation Toolkit" module.';
      }
      return '🟡 PARTIAL / NEEDS CONTEXT\\n\\nI need more details to evaluate this claim.';
    }

    // Navigator Mode
    if (currentMode === 'Navigator') {
      if (lowerQuery.includes('quiz') || lowerQuery.includes('learn')) {
        return '📚 Quizzes are in the Learn tab! Check out the 8 beginner modules.\\n\\nGo to: Learn tab → Choose a module → Scroll to quiz';
      }
      if (lowerQuery.includes('track') || lowerQuery.includes('log')) {
        return '📊 Daily logging is in the Track tab!\\n\\nGo to: Track tab → "Log Today\'s Data" button';
      }
    }

    // Topic-based responses
    if (lowerQuery.includes('protein')) {
      return '🥩 Protein:\\n\\n' + aiKnowledgeBase.nutrition.protein + '\\n\\n💡 Next: Track your protein in the Track tab!\\n\\n⚠️ Not medical advice.';
    }
    if (lowerQuery.includes('carb')) {
      return '🍚 Carbs:\\n\\n' + aiKnowledgeBase.nutrition.carbs + '\\n\\n💡 Next: Learn more in modules!\\n\\n⚠️ Not medical advice.';
    }
    if (lowerQuery.includes('sleep')) {
      return '💤 Sleep for Teens:\\n\\nTeens need 8-10 hours nightly. Poor sleep increases hunger and affects mood.\\n\\n💡 Next: Track sleep in Track tab!\\n\\n⚠️ Not medical advice.';
    }
    if (lowerQuery.includes('bubble tea')) {
      return '🧋 Bubble Tea:\\n\\n' + aiKnowledgeBase.singapore_food.bubble_tea + '\\n\\n💡 Smart choice: 0-50% sugar!\\n\\n⚠️ Not medical advice.';
    }
    if (lowerQuery.includes('chicken rice')) {
      return '🍗 Chicken Rice:\\n\\n' + aiKnowledgeBase.singapore_food.chicken_rice + '\\n\\n⚠️ Not medical advice.';
    }

    // Support Mode
    if (currentMode === 'Support') {
      return '🌟 You\'re doing great by being here! Health is a journey, not a destination.\\n\\nRemember:\\n• Progress > Perfection\\n• Small steps > Big unrealistic changes\\n• Your worth isn\'t tied to numbers\\n\\nWhat support do you need?\\n\\n⚠️ Not medical advice.';
    }

    // Coach Mode
    if (currentMode === 'Coach') {
      return '🎯 Personalized Guidance:\\n\\nFocus on:\\n1. Consistent sleep (8-10 hours)\\n2. Eat enough to support growth\\n3. Move daily\\n4. Stay hydrated\\n5. Reflect and manage stress\\n\\nWhat aspect to work on?\\n\\n⚠️ Not medical advice.';
    }

    // Default
    return 'Great question! Check the Learn tab for science-backed modules. Use Track to monitor patterns. I\'m here to help!\\n\\n⚠️ Not medical advice.';
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach</Text>
        <Text style={styles.subtitle}>Your personal health guide</Text>
      </View>
      <View style={styles.modeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['Ask', 'Coach', 'Scan', 'Support', 'Navigator'] as AIMode[]).map((m) => (
            <TouchableOpacity key={m} style={[styles.modeButton, mode === m && styles.modeButtonActive]} onPress={() => setMode(m)}>
              <Text style={[styles.modeButtonText, mode === m && styles.modeButtonTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.modeInfo}>
        <Text style={styles.modeInfoText}>
          {mode === 'Ask' && '💬 Ask me anything about nutrition, exercise, or health'}
          {mode === 'Coach' && '🎯 Get personalized guidance'}
          {mode === 'Scan' && '🔍 Check if health claims are true or myths'}
          {mode === 'Support' && '🌟 Get motivation and support'}
          {mode === 'Navigator' && '🧭 Find features in the app'}
        </Text>
      </View>
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={[styles.messageText, msg.role === 'user' ? styles.userMessageText : styles.aiMessageText]}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder={`Type in ${mode} mode...`} multiline maxLength={500} />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.disclaimer}>⚠️ Not medical advice • Powered by local knowledge base</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#50C878' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  modeSelector: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  modeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#f0f0f0' },
  modeButtonActive: { backgroundColor: '#50C878' },
  modeButtonText: { fontSize: 14, color: '#666', fontWeight: '600' },
  modeButtonTextActive: { color: '#fff' },
  modeInfo: { padding: 12, backgroundColor: '#E8F8F5', borderBottomWidth: 1, borderBottomColor: '#eee' },
  modeInfoText: { fontSize: 13, color: '#666', textAlign: 'center' },
  chatArea: { flex: 1 },
  chatContent: { padding: 16 },
  message: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#4A90E2' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userMessageText: { color: '#fff' },
  aiMessageText: { color: '#333' },
  inputArea: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100, marginRight: 8 },
  sendButton: { backgroundColor: '#50C878', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  disclaimer: { fontSize: 11, color: '#999', textAlign: 'center', padding: 8, backgroundColor: '#fff' },
});

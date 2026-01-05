import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { aiEngine } from '@/utils/aiEngine';

export default function AICoachScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your Ultimate AI Coach powered by Stryde SG\'s comprehensive knowledge base. 💪\n\nI can help you with:\n🥗 Nutrition questions\n🏋️ Exercise guidance\n😴 Sleep & stress advice\n🇸🇬 Singapore food tips\n🔍 Myth-busting\n🧭 App navigation\n🌟 Motivation & support\n🎯 Goal setting\n\nAsk me anything about health and wellness!', timestamp: new Date().toISOString() },
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
    
    const userMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input.trim(), 
      timestamp: new Date().toISOString() 
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    // Generate AI response using the AI engine
    const aiResponse = aiEngine.generateResponse(input.trim(), {
      mode: 'unified', // Unified mode that handles everything
      conversationHistory: messages
    });
    
    const assistantMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...newMessages, assistantMessage];
    setMessages(updatedMessages);
    await storage.save(STORAGE_KEYS.AI_HISTORY, updatedMessages);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Ultimate AI Coach</Text>
        <Text style={styles.subtitle}>Powered by Stryde SG Knowledge Base</Text>
      </View>

      <View style={styles.featureBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureContent}>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🥗 Nutrition</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🏋️ Exercise</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>😴 Sleep</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🔍 Myths</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🇸🇬 SG Food</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🎯 Goals</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🧭 Navigate</Text>
          </View>
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        ref={(ref) => ref?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={[styles.messageText, msg.role === 'user' ? styles.userMessageText : styles.aiMessageText]}>
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder="Ask me anything about health & wellness..."
          placeholderTextColor="#999"
          multiline 
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.disclaimer}>⚠️ Not medical advice • AI-powered by app modules</Text>
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

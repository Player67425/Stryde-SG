import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { beginnerModules, advancedTopics } from '@/data/content';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function LearnScreen() {
  const [moduleProgress, setModuleProgress] = useState<any>({});
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await storage.load(STORAGE_KEYS.LEARN_PROGRESS) || {};
    setModuleProgress(progress);
    const bookmarks = (await storage.load(STORAGE_KEYS.ADVANCED_BOOKMARKS) || []) as string[];
    setBookmarkedTopics(bookmarks);
  };

  const startQuiz = (module: any) => {
    setSelectedModule(module);
    setShowQuiz(true);
    setQuizAnswers([]);
  };

  const submitQuiz = async () => {
    const module = selectedModule;
    if (!module?.quiz) return;
    let correct = 0;
    module.quiz.questions.forEach((q: any, index: number) => {
      if (quizAnswers[index] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / module.quiz.questions.length) * 100);
    const newProgress = {
      ...moduleProgress,
      [module.id]: {
        completed: true,
        bestScore: Math.max(score, moduleProgress[module.id]?.bestScore || 0),
        lastAttempt: new Date().toISOString(),
      },
    };
    await storage.save(STORAGE_KEYS.LEARN_PROGRESS, newProgress);
    setModuleProgress(newProgress);
    Alert.alert('Quiz Complete!', `You scored ${score}%\nCorrect: ${correct}/${module.quiz.questions.length}`, 
      [{ text: 'OK', onPress: () => { setShowQuiz(false); setSelectedModule(null); } }]);
  };

  const toggleBookmark = async (topicId: string) => {
    const updated = bookmarkedTopics.includes(topicId)
      ? bookmarkedTopics.filter(id => id !== topicId)
      : [...bookmarkedTopics, topicId];
    setBookmarkedTopics(updated);
    await storage.save(STORAGE_KEYS.ADVANCED_BOOKMARKS, updated);
  };

  if (showQuiz && selectedModule?.quiz) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizTitle}>Quiz: {selectedModule.title}</Text>
        </View>
        {selectedModule.quiz.questions.map((q: any, qIndex: number) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.question}</Text>
            {q.options.map((option: string, oIndex: number) => (
              <TouchableOpacity key={oIndex}
                style={[styles.optionButton, quizAnswers[qIndex] === oIndex && styles.optionSelected]}
                onPress={() => {
                  const newAnswers = [...quizAnswers];
                  newAnswers[qIndex] = oIndex;
                  setQuizAnswers(newAnswers);
                }}>
                <Text style={[styles.optionText, quizAnswers[qIndex] === oIndex && styles.optionTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
            {quizAnswers[qIndex] !== undefined && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>{quizAnswers[qIndex] === q.correctAnswer ? '✅ Correct!' : '❌ Not quite'}</Text>
                <Text>{q.explanation}</Text>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity style={[styles.submitButton, quizAnswers.length < selectedModule.quiz.questions.length && styles.submitButtonDisabled]}
          onPress={submitQuiz} disabled={quizAnswers.length < selectedModule.quiz.questions.length}>
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => { setShowQuiz(false); setSelectedModule(null); }}>
          <Text style={styles.backButtonText}>Back to Modules</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (selectedModule && !showQuiz) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>{selectedModule.title}</Text>
        </View>
        <View style={styles.contentSection}>
          {selectedModule.content.map((item: any, index: number) => (
            <View key={index}>
              {item.type === 'heading' && <Text style={styles.contentHeading}>{item.content}</Text>}
              {item.type === 'text' && <Text style={styles.contentText}>{item.content}</Text>}
              {item.type === 'bullet' && <Text style={styles.contentBullet}>• {item.content}</Text>}
              {item.type === 'example' && (
                <View style={styles.exampleBox}><Text>{item.content}</Text></View>
              )}
            </View>
          ))}
        </View>
        {selectedModule.quiz && (
          <TouchableOpacity style={styles.startQuizButton} onPress={() => startQuiz(selectedModule)}>
            <Text style={styles.startQuizButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedModule(null)}>
          <Text style={styles.backButtonText}>Back to Learn</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Grow</Text>
        <Text style={styles.subtitle}>Science-backed knowledge for teens</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beginner Modules (8)</Text>
        {beginnerModules.map((module) => (
          <TouchableOpacity key={module.id} style={styles.moduleCard} onPress={() => setSelectedModule(module)}>
            <Text style={styles.moduleCardTitle}>{module.title}</Text>
            {moduleProgress[module.id]?.completed && <Text>✓ Completed</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Research Library</Text>
        {bookmarkedTopics.length > 0 && (
          <>
            <Text style={styles.subsectionTitle}>📌 Bookmarked Topics</Text>
            {advancedTopics.filter(t => bookmarkedTopics.includes(t.id)).map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.topicCard}
                onPress={() => Alert.alert(topic.title, topic.content.explanation.substring(0, 200) + '...')}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                  <Text>📌</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
        <Text style={styles.subsectionTitle}>All Topics</Text>
        {advancedTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard}
            onPress={() => Alert.alert(topic.title, topic.content.explanation.substring(0, 200) + '...')}>
            <View style={styles.topicHeader}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                <Text>{bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.topicCategory}>{topic.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subsectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 12, color: '#333' },
  moduleCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  moduleCardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  topicCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  topicHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  topicTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  topicCategory: { fontSize: 12, color: '#E67E22', marginTop: 4 },
  moduleHeader: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22' },
  moduleTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  contentSection: { padding: 16 },
  contentHeading: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  contentText: { fontSize: 15, color: '#666', lineHeight: 22, marginTop: 8 },
  contentBullet: { fontSize: 15, color: '#666', marginLeft: 8, marginTop: 4 },
  exampleBox: { backgroundColor: '#FFF3CD', padding: 12, borderRadius: 8, marginTop: 8 },
  startQuizButton: { margin: 16, padding: 16, backgroundColor: '#50C878', borderRadius: 12, alignItems: 'center' },
  startQuizButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  backButton: { margin: 16, marginTop: 0, padding: 14, alignItems: 'center' },
  backButtonText: { fontSize: 15, color: '#E67E22', fontWeight: '600' },
  quizHeader: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22' },
  quizTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  questionCard: { backgroundColor: '#fff', padding: 16, margin: 16, borderRadius: 12 },
  questionText: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  optionButton: { padding: 14, borderWidth: 2, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  optionSelected: { borderColor: '#E67E22', backgroundColor: '#FFF3E0' },
  optionText: { fontSize: 15, color: '#333' },
  optionTextSelected: { fontWeight: '600', color: '#E67E22' },
  explanationBox: { marginTop: 8, padding: 12, backgroundColor: '#E8F5E9', borderRadius: 8 },
  explanationText: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  submitButton: { margin: 16, padding: 16, backgroundColor: '#50C878', borderRadius: 12, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#ccc' },
  submitButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

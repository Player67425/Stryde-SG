import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { beginnerModules, advancedTopics } from '@/data/content';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function LearnScreen() {
  const [moduleProgress, setModuleProgress] = useState<any>({});
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // Group topics by category
  const getTopicsByCategory = (category: string) => {
    return advancedTopics.filter(t => t.category === category);
  };

  const getMostRecent = () => {
    return [...advancedTopics].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    ).slice(0, 3);
  };

  const getMostPopular = () => {
    // Simulate popularity based on topic order (in real app, track views)
    return advancedTopics.slice(0, 3);
  };

  const getTeenRelevant = () => {
    return advancedTopics.filter(t => 
      t.title.toLowerCase().includes('teen') || 
      t.title.toLowerCase().includes('puberty') ||
      t.title.toLowerCase().includes('body image') ||
      t.title.toLowerCase().includes('social media')
    );
  };

  // Render topic detail page
  if (selectedTopic) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.topicDetailHeader}>
          <TouchableOpacity onPress={() => setSelectedTopic(null)} style={styles.backButtonTop}>
            <Text style={styles.backButtonTopText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topicDetailTitle}>{selectedTopic.title}</Text>
          <TouchableOpacity onPress={() => toggleBookmark(selectedTopic.id)} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>
              {bookmarkedTopics.includes(selectedTopic.id) ? '📌' : '🔖'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topicDetailContent}>
          <View style={styles.topicMeta}>
            <Text style={styles.topicMetaText}>📂 {selectedTopic.category}</Text>
            <Text style={styles.topicMetaText}>⭐ {selectedTopic.credibility}</Text>
            <Text style={styles.topicMetaText}>🗓️ Updated: {selectedTopic.lastUpdated}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Overview</Text>
            <Text style={styles.explanationText}>{selectedTopic.content.explanation}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Key Findings</Text>
            {selectedTopic.content.keyFindings.map((finding: string, idx: number) => (
              <Text key={idx} style={styles.findingBullet}>• {finding}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Scientific Evidence</Text>
            {selectedTopic.content.evidence.map((study: any, idx: number) => (
              <View key={idx} style={styles.evidenceCard}>
                <Text style={styles.evidenceTitle}>{study.title}</Text>
                <Text style={styles.evidenceAuthors}>{study.authors}</Text>
                <Text style={styles.evidenceStats}><Text style={styles.bold}>Key Stats:</Text> {study.keyStats}</Text>
                <Text style={styles.evidenceLimitations}><Text style={styles.bold}>Limitations:</Text> {study.limitations}</Text>
                <Text style={styles.evidenceLink}>🔗 DOI: {study.doi}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>What This Means for Teens</Text>
            <View style={styles.teenBox}>
              <Text style={styles.teenText}>{selectedTopic.content.forTeens}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // Render advanced topics home with categories
  if (showAdvanced) {
    const bookmarked = advancedTopics.filter(t => bookmarkedTopics.includes(t.id));
    const mostRecent = getMostRecent();
    const mostPopular = getMostPopular();
    const teenRelevant = getTeenRelevant();
    const nutritionScience = getTopicsByCategory('Nutrition Science');
    const trainingScience = getTopicsByCategory('Training Science');
    const sleepStress = getTopicsByCategory('Sleep & Stress');

    return (
      <ScrollView style={styles.container}>
        <View style={styles.advancedHeader}>
          <TouchableOpacity onPress={() => setShowAdvanced(false)} style={styles.backButtonTop}>
            <Text style={styles.backButtonTopText}>← Learn Home</Text>
          </TouchableOpacity>
          <Text style={styles.advancedTitle}>Advanced Research Library</Text>
          <Text style={styles.advancedSubtitle}>In-depth, evidence-based topics</Text>
        </View>

        <View style={styles.content}>
          {/* Bookmarked Topics */}
          {bookmarked.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>📌 Bookmarked Topics ({bookmarked.length})</Text>
              {bookmarked.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                  onPress={() => setSelectedTopic(topic)}>
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                      <Text style={styles.bookmarkIconCard}>📌</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.topicCardCategory}>{topic.category}</Text>
                  <Text style={styles.topicCardPreview} numberOfLines={2}>
                    {topic.content.explanation.substring(0, 120)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Most Recent */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>🆕 Most Recent</Text>
            {mostRecent.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                onPress={() => setSelectedTopic(topic)}>
                <View style={styles.topicCardHeader}>
                  <Text style={styles.topicCardTitle}>{topic.title}</Text>
                  <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                    <Text style={styles.bookmarkIconCard}>
                      {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.topicCardCategory}>{topic.category} • {topic.lastUpdated}</Text>
                <Text style={styles.topicCardPreview} numberOfLines={2}>
                  {topic.content.explanation.substring(0, 120)}...
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Most Popular */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>🔥 Most Popular</Text>
            {mostPopular.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                onPress={() => setSelectedTopic(topic)}>
                <View style={styles.topicCardHeader}>
                  <Text style={styles.topicCardTitle}>{topic.title}</Text>
                  <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                    <Text style={styles.bookmarkIconCard}>
                      {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.topicCardCategory}>{topic.category}</Text>
                <Text style={styles.topicCardPreview} numberOfLines={2}>
                  {topic.content.explanation.substring(0, 120)}...
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Teen-Relevant */}
          {teenRelevant.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>👥 Teen-Relevant</Text>
              {teenRelevant.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                  onPress={() => setSelectedTopic(topic)}>
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                      <Text style={styles.bookmarkIconCard}>
                        {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.topicCardCategory}>{topic.category}</Text>
                  <Text style={styles.topicCardPreview} numberOfLines={2}>
                    {topic.content.explanation.substring(0, 120)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Nutrition Science */}
          {nutritionScience.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>🥗 Nutrition Science</Text>
              {nutritionScience.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                  onPress={() => setSelectedTopic(topic)}>
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                      <Text style={styles.bookmarkIconCard}>
                        {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.topicCardCategory}>{topic.category}</Text>
                  <Text style={styles.topicCardPreview} numberOfLines={2}>
                    {topic.content.explanation.substring(0, 120)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Training Science */}
          {trainingScience.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>🏋️ Training Science</Text>
              {trainingScience.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                  onPress={() => setSelectedTopic(topic)}>
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                      <Text style={styles.bookmarkIconCard}>
                        {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.topicCardCategory}>{topic.category}</Text>
                  <Text style={styles.topicCardPreview} numberOfLines={2}>
                    {topic.content.explanation.substring(0, 120)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sleep & Stress */}
          {sleepStress.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>😴 Sleep & Stress</Text>
              {sleepStress.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.advancedTopicCard}
                  onPress={() => setSelectedTopic(topic)}>
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(topic.id)}>
                      <Text style={styles.bookmarkIconCard}>
                        {bookmarkedTopics.includes(topic.id) ? '📌' : '🔖'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.topicCardCategory}>{topic.category}</Text>
                  <Text style={styles.topicCardPreview} numberOfLines={2}>
                    {topic.content.explanation.substring(0, 120)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

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

      {/* Beginner Modules Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beginner Modules (8)</Text>
        <Text style={styles.sectionDescription}>
          Master the fundamentals with Singapore-specific examples
        </Text>
        {beginnerModules.map((module) => (
          <TouchableOpacity key={module.id} style={styles.moduleCard} onPress={() => setSelectedModule(module)}>
            <View style={styles.moduleCardContent}>
              <Text style={styles.moduleCardTitle}>{module.title}</Text>
              {moduleProgress[module.id]?.completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Completed</Text>
                  <Text style={styles.scoreText}>Best: {moduleProgress[module.id]?.bestScore}%</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Advanced Research Library Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Research Library</Text>
        <Text style={styles.sectionDescription}>
          Dive deep into scientific evidence with {advancedTopics.length} in-depth topics
        </Text>
        
        <TouchableOpacity 
          style={styles.advancedButton}
          onPress={() => setShowAdvanced(true)}
        >
          <Text style={styles.advancedButtonIcon}>🔬</Text>
          <View style={styles.advancedButtonContent}>
            <Text style={styles.advancedButtonTitle}>Browse Advanced Topics</Text>
            <Text style={styles.advancedButtonSubtitle}>
              {bookmarkedTopics.length} bookmarked • {advancedTopics.length} total topics
            </Text>
          </View>
          <Text style={styles.advancedButtonArrow}>→</Text>
        </TouchableOpacity>

        {/* Quick access to bookmarked if any */}
        {bookmarkedTopics.length > 0 && (
          <View style={styles.quickBookmarks}>
            <Text style={styles.quickBookmarksTitle}>📌 Your Bookmarks</Text>
            {advancedTopics
              .filter(t => bookmarkedTopics.includes(t.id))
              .slice(0, 2)
              .map((topic) => (
                <TouchableOpacity 
                  key={topic.id} 
                  style={styles.quickBookmarkCard}
                  onPress={() => {
                    setSelectedTopic(topic);
                    setShowAdvanced(true);
                  }}
                >
                  <Text style={styles.quickBookmarkTitle}>{topic.title}</Text>
                  <Text style={styles.quickBookmarkCategory}>{topic.category}</Text>
                </TouchableOpacity>
              ))}
            {bookmarkedTopics.length > 2 && (
              <TouchableOpacity 
                style={styles.viewAllBookmarks}
                onPress={() => setShowAdvanced(true)}
              >
                <Text style={styles.viewAllBookmarksText}>
                  View all {bookmarkedTopics.length} bookmarked topics →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  sectionDescription: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  subsectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 12, color: '#333' },
  
  // Module cards
  moduleCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  moduleCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moduleCardTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  completedBadge: { alignItems: 'flex-end' },
  completedText: { fontSize: 12, color: '#50C878', fontWeight: '600' },
  scoreText: { fontSize: 11, color: '#666', marginTop: 2 },
  
  // Advanced button
  advancedButton: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  advancedButtonIcon: { fontSize: 32, marginRight: 16 },
  advancedButtonContent: { flex: 1 },
  advancedButtonTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  advancedButtonSubtitle: { fontSize: 13, color: '#666' },
  advancedButtonArrow: { fontSize: 24, color: '#E67E22', fontWeight: 'bold' },
  
  // Quick bookmarks
  quickBookmarks: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginTop: 8 },
  quickBookmarksTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  quickBookmarkCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  quickBookmarkTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  quickBookmarkCategory: { fontSize: 12, color: '#E67E22' },
  viewAllBookmarks: { marginTop: 8, alignItems: 'center' },
  viewAllBookmarksText: { fontSize: 13, color: '#E67E22', fontWeight: '600' },
  
  // Advanced topics home
  advancedHeader: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22' },
  advancedTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  advancedSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
  backButtonTop: { marginBottom: 12 },
  backButtonTopText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  content: { padding: 16 },
  
  // Category sections
  categorySection: { marginBottom: 24 },
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  
  // Advanced topic cards
  advancedTopicCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  topicCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  topicCardTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, lineHeight: 22 },
  bookmarkIconCard: { fontSize: 20, marginLeft: 8 },
  topicCardCategory: { fontSize: 12, color: '#E67E22', marginBottom: 8 },
  topicCardPreview: { fontSize: 14, color: '#666', lineHeight: 20 },
  
  // Topic detail page
  topicDetailHeader: { padding: 20, paddingTop: 60, backgroundColor: '#E67E22', flexDirection: 'row', alignItems: 'center' },
  topicDetailTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, marginHorizontal: 12 },
  bookmarkButton: { padding: 4 },
  bookmarkIcon: { fontSize: 24 },
  topicDetailContent: { padding: 16 },
  topicMeta: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 12 },
  topicMetaText: { fontSize: 12, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  sectionHeading: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12, marginTop: 20 },
  explanationText: { fontSize: 15, color: '#333', lineHeight: 24 },
  findingBullet: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 8, marginLeft: 8 },
  evidenceCard: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#E67E22' },
  evidenceTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  evidenceAuthors: { fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic' },
  evidenceStats: { fontSize: 14, color: '#333', marginBottom: 6, lineHeight: 20 },
  evidenceLimitations: { fontSize: 14, color: '#333', marginBottom: 6, lineHeight: 20 },
  evidenceLink: { fontSize: 12, color: '#E67E22', marginTop: 4 },
  bold: { fontWeight: '600' },
  teenBox: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#50C878' },
  teenText: { fontSize: 15, color: '#333', lineHeight: 24 },
  
  // Legacy styles (keep for module content and quiz)
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

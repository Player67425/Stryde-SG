import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'tracking' | 'social' | 'wellness' | 'consistency';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedDate?: string;
}

const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlocked'>[] = [
  { id: 'first-module', title: 'First Steps', description: 'Complete your first learning module', category: 'learning', tier: 'bronze', icon: '🎓', requirement: 1 },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Complete all 8 learning modules', category: 'learning', tier: 'platinum', icon: '📚', requirement: 8 },
  { id: 'quiz-master', title: 'Quiz Master', description: 'Get 100% on any quiz', category: 'learning', tier: 'gold', icon: '🏆', requirement: 1 },
  { id: 'first-log', title: 'Getting Started', description: 'Log your first day of data', category: 'tracking', tier: 'bronze', icon: '📝', requirement: 1 },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Log 7 days in a row', category: 'tracking', tier: 'silver', icon: '📊', requirement: 7 },
  { id: 'data-detective', title: 'Data Detective', description: 'Log 30 days total', category: 'tracking', tier: 'gold', icon: '🔍', requirement: 30 },
  { id: 'consistency-king', title: 'Consistency Champion', description: 'Log 100 days total', category: 'tracking', tier: 'platinum', icon: '👑', requirement: 100 },
  { id: 'social-start', title: 'Team Player', description: 'Join your first team', category: 'social', tier: 'bronze', icon: '🤝', requirement: 1 },
  { id: 'social-butterfly', title: 'Social Butterfly', description: 'Join 3 teams', category: 'social', tier: 'silver', icon: '🦋', requirement: 3 },
  { id: 'event-explorer', title: 'Event Explorer', description: 'RSVP to 5 events', category: 'social', tier: 'gold', icon: '🎉', requirement: 5 },
  { id: 'quest-starter', title: 'Quest Starter', description: 'Complete your first quest', category: 'wellness', tier: 'bronze', icon: '⭐', requirement: 1 },
  { id: 'quest-crusher', title: 'Quest Crusher', description: 'Complete 20 quests', category: 'wellness', tier: 'gold', icon: '💪', requirement: 20 },
  { id: 'fitness-fanatic', title: 'Fitness Fanatic', description: 'Complete 50 quests', category: 'wellness', tier: 'platinum', icon: '🔥', requirement: 50 },
  { id: 'journal-beginner', title: 'Reflective Start', description: 'Write your first journal entry', category: 'wellness', tier: 'bronze', icon: '✍️', requirement: 1 },
  { id: 'journaling-master', title: 'Journaling Master', description: 'Write 30 journal entries', category: 'wellness', tier: 'gold', icon: '📖', requirement: 30 },
  { id: 'mindful-soul', title: 'Mindful Soul', description: 'Journal for 100 days', category: 'wellness', tier: 'platinum', icon: '🧘', requirement: 100 },
  { id: 'early-bird', title: 'Early Bird', description: 'Log before 9 AM for 7 days', category: 'consistency', tier: 'silver', icon: '🌅', requirement: 7 },
  { id: 'goal-crusher', title: 'Goal Crusher', description: 'Hit weekly goals 4 weeks in a row', category: 'consistency', tier: 'gold', icon: '🎯', requirement: 4 },
];

export default function AchievementsScreen() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      // Load all progress data
      const learnProgress = await storage.load(STORAGE_KEYS.LEARN_PROGRESS) || {};
      const trackLogs = await storage.load(STORAGE_KEYS.TRACK_LOGS) || {};
      const teams = await storage.load(STORAGE_KEYS.TEAMS) || [];
      const rsvps = await storage.load(STORAGE_KEYS.EVENT_RSVPS) || {};
      const quests = await storage.load(STORAGE_KEYS.QUESTS) || [];
      const journals = await storage.load(STORAGE_KEYS.REFLECT_ENTRIES) || [];
      const savedAchievements = await storage.load(STORAGE_KEYS.ACHIEVEMENTS) || {};

      // Calculate progress for each achievement
      const updated = ACHIEVEMENTS.map(ach => {
        let progress = 0;
        let unlocked = false;

        switch (ach.id) {
          case 'first-module':
          case 'knowledge-seeker':
            progress = Object.values(learnProgress).filter((p: any) => p.completed).length;
            break;
          case 'quiz-master':
            progress = Object.values(learnProgress).some((p: any) => p.bestScore === 100) ? 1 : 0;
            break;
          case 'first-log':
          case 'data-detective':
          case 'consistency-king':
            progress = Object.keys(trackLogs).length;
            break;
          case 'week-warrior':
            // Count consecutive days
            const dates = Object.keys(trackLogs).sort();
            let streak = 0;
            let maxStreak = 0;
            for (let i = 0; i < dates.length; i++) {
              if (i === 0 || new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime() === 86400000) {
                streak++;
                maxStreak = Math.max(maxStreak, streak);
              } else {
                streak = 1;
              }
            }
            progress = maxStreak;
            break;
          case 'social-start':
          case 'social-butterfly':
            progress = teams.length;
            break;
          case 'event-explorer':
            progress = Object.values(rsvps).filter(Boolean).length;
            break;
          case 'quest-starter':
          case 'quest-crusher':
          case 'fitness-fanatic':
            progress = quests.filter((q: any) => q.progress >= q.target).length;
            break;
          case 'journal-beginner':
          case 'journaling-master':
          case 'mindful-soul':
            progress = journals.length;
            break;
          case 'early-bird':
            progress = journals.filter((j: any) => {
              const hour = new Date(j.date).getHours();
              return hour < 9;
            }).length;
            break;
        }

        unlocked = progress >= ach.requirement || savedAchievements[ach.id]?.unlocked;

        return {
          ...ach,
          progress,
          unlocked,
          unlockedDate: savedAchievements[ach.id]?.unlockedDate,
        };
      });

      setAchievements(updated);

      // Check for newly unlocked achievements
      const newlyUnlocked = updated.filter(a => a.unlocked && !savedAchievements[a.id]?.unlocked);
      if (newlyUnlocked.length > 0) {
        const updatedSaved = { ...savedAchievements };
        newlyUnlocked.forEach(a => {
          updatedSaved[a.id] = { unlocked: true, unlockedDate: new Date().toISOString() };
          Alert.alert('🎉 Achievement Unlocked!', `${a.icon} ${a.title}\n\n${a.description}`);
        });
        await storage.save(STORAGE_KEYS.ACHIEVEMENTS, updatedSaved);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#999';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return '#E67E22';
      case 'tracking': return '#3498DB';
      case 'social': return '#9B59B6';
      case 'wellness': return '#27AE60';
      case 'consistency': return '#E74C3C';
      default: return '#999';
    }
  };

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked' && !a.unlocked) return false;
    if (filter === 'locked' && a.unlocked) return false;
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    bronze: achievements.filter(a => a.unlocked && a.tier === 'bronze').length,
    silver: achievements.filter(a => a.unlocked && a.tier === 'silver').length,
    gold: achievements.filter(a => a.unlocked && a.tier === 'gold').length,
    platinum: achievements.filter(a => a.unlocked && a.tier === 'platinum').length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>Track your progress and unlock rewards</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.unlocked}/{stats.total}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.tierBadge, { color: '#CD7F32' }]}>🥉 {stats.bronze}</Text>
          <Text style={styles.statLabel}>Bronze</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.tierBadge, { color: '#C0C0C0' }]}>🥈 {stats.silver}</Text>
          <Text style={styles.statLabel}>Silver</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.tierBadge, { color: '#FFD700' }]}>🥇 {stats.gold}</Text>
          <Text style={styles.statLabel}>Gold</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.tierBadge, { color: '#E5E4E2' }]}>💎 {stats.platinum}</Text>
          <Text style={styles.statLabel}>Platinum</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'unlocked', 'locked'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f as any)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.filterDivider} />
          {['all', 'learning', 'tracking', 'social', 'wellness', 'consistency'].map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.filterButton, categoryFilter === c && styles.filterButtonActive]}
              onPress={() => setCategoryFilter(c)}>
              <Text style={[styles.filterText, categoryFilter === c && styles.filterTextActive]}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredAchievements.map(achievement => (
          <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}>
            <View style={styles.achievementIcon}>
              <Text style={styles.iconText}>{achievement.icon}</Text>
              {achievement.unlocked && <View style={styles.unlockedBadge}><Text>✓</Text></View>}
            </View>
            <View style={styles.achievementContent}>
              <View style={styles.achievementHeader}>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.textLocked]}>
                  {achievement.title}
                </Text>
                <View style={[styles.tierBadgeSmall, { backgroundColor: getTierColor(achievement.tier) }]}>
                  <Text style={styles.tierBadgeText}>{achievement.tier.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.achievementDescription, !achievement.unlocked && styles.textLocked]}>
                {achievement.description}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(achievement.category) }]}>
                <Text style={styles.categoryBadgeText}>{achievement.category}</Text>
              </View>
              {!achievement.unlocked && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}/{achievement.requirement}</Text>
                </View>
              )}
              {achievement.unlocked && achievement.unlockedDate && (
                <Text style={styles.unlockedDate}>
                  Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ))}
        {filteredAchievements.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>No achievements match your filters</Text>
            <Text style={styles.emptyHint}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#9B59B6' },
  backButton: { marginBottom: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  statsCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  tierBadge: { fontSize: 18, fontWeight: 'bold' },
  filters: { paddingHorizontal: 16, marginBottom: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8 },
  filterButtonActive: { backgroundColor: '#9B59B6' },
  filterText: { fontSize: 14, color: '#666' },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  filterDivider: { width: 1, backgroundColor: '#ddd', marginHorizontal: 8 },
  scrollView: { flex: 1, padding: 16 },
  achievementCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row' },
  achievementLocked: { opacity: 0.6 },
  achievementIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12, position: 'relative' },
  iconText: { fontSize: 32 },
  unlockedBadge: { position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center' },
  achievementContent: { flex: 1 },
  achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  achievementDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  textLocked: { color: '#999' },
  tierBadgeSmall: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tierBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 },
  categoryBadgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginRight: 8 },
  progressFill: { height: '100%', backgroundColor: '#9B59B6' },
  progressText: { fontSize: 12, color: '#666', fontWeight: '600' },
  unlockedDate: { fontSize: 12, color: '#27AE60', fontStyle: 'italic' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#666' },
});

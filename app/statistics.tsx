import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface Stats {
  totalDaysLogged: number;
  currentStreak: number;
  longestStreak: number;
  modulesCompleted: number;
  quizzesPerfect: number;
  questsCompleted: number;
  teamsJoined: number;
  journalEntries: number;
  eventsRSVPd: number;
  achievementsUnlocked: number;
  avgMood: number;
  totalCalories: number;
  totalSteps: number;
  avgSleep: number;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalDaysLogged: 0,
    currentStreak: 0,
    longestStreak: 0,
    modulesCompleted: 0,
    quizzesPerfect: 0,
    questsCompleted: 0,
    teamsJoined: 0,
    journalEntries: 0,
    eventsRSVPd: 0,
    achievementsUnlocked: 0,
    avgMood: 0,
    totalCalories: 0,
    totalSteps: 0,
    avgSleep: 0,
  });
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    calculateStats();
  }, [timeframe]);

  const calculateStats = async () => {
    try {
      const trackLogs = await storage.load(STORAGE_KEYS.TRACK_LOGS) || {};
      const learnProgress = await storage.load(STORAGE_KEYS.LEARN_PROGRESS) || {};
      const quests = await storage.load(STORAGE_KEYS.QUESTS) || [];
      const teams = await storage.load(STORAGE_KEYS.TEAMS) || [];
      const journals = await storage.load(STORAGE_KEYS.JOURNAL) || [];
      const rsvps = await storage.load(STORAGE_KEYS.EVENT_RSVPS) || {};
      const achievements = await storage.load(STORAGE_KEYS.ACHIEVEMENTS) || {};

      // Get date range
      const now = new Date();
      const cutoffDate = timeframe === '7d' ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) :
                         timeframe === '30d' ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) :
                         new Date(0);

      // Filter data by timeframe
      const logDates = Object.keys(trackLogs).filter(d => new Date(d) >= cutoffDate).sort();
      const filteredJournals = journals.filter((j: any) => new Date(j.date) >= cutoffDate);

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const allDates = Object.keys(trackLogs).sort();
      
      for (let i = allDates.length - 1; i >= 0; i--) {
        const currentDate = new Date(allDates[i]);
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (i === allDates.length - 1) {
          currentStreak = 1;
          tempStreak = 1;
        } else {
          const prevDate = new Date(allDates[i + 1]);
          if (prevDate.getTime() - currentDate.getTime() === 86400000) {
            currentStreak++;
            tempStreak++;
          } else {
            if (i < allDates.length - 1) currentStreak = 0;
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      // Calculate averages and totals
      const totalCalories = logDates.reduce((sum, date) => sum + (trackLogs[date]?.calories || 0), 0);
      const totalSteps = logDates.reduce((sum, date) => sum + (trackLogs[date]?.steps || 0), 0);
      const totalSleep = logDates.reduce((sum, date) => sum + (trackLogs[date]?.sleep || 0), 0);
      const avgSleep = logDates.length > 0 ? totalSleep / logDates.length : 0;

      const moods = filteredJournals.map((j: any) => j.mood).filter((m: number) => m > 0);
      const avgMood = moods.length > 0 ? moods.reduce((a: number, b: number) => a + b, 0) / moods.length : 0;

      // Count completions
      const modulesCompleted = Object.values(learnProgress).filter((p: any) => p.completed).length;
      const quizzesPerfect = Object.values(learnProgress).filter((p: any) => p.bestScore === 100).length;
      const questsCompleted = quests.filter((q: any) => q.progress >= q.target).length;
      const eventsRSVPd = Object.values(rsvps).filter(Boolean).length;
      const achievementsUnlocked = Object.values(achievements).filter((a: any) => a.unlocked).length;

      setStats({
        totalDaysLogged: logDates.length,
        currentStreak,
        longestStreak,
        modulesCompleted,
        quizzesPerfect,
        questsCompleted,
        teamsJoined: teams.length,
        journalEntries: filteredJournals.length,
        eventsRSVPd,
        achievementsUnlocked,
        avgMood: Math.round(avgMood * 10) / 10,
        totalCalories: Math.round(totalCalories),
        totalSteps,
        avgSleep: Math.round(avgSleep * 10) / 10,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const exportData = async () => {
    try {
      // Gather all data
      const onboarding = await storage.load(STORAGE_KEYS.ONBOARDING);
      const trackLogs = await storage.load(STORAGE_KEYS.TRACK_LOGS);
      const learnProgress = await storage.load(STORAGE_KEYS.LEARN_PROGRESS);
      const journals = await storage.load(STORAGE_KEYS.JOURNAL);
      const quests = await storage.load(STORAGE_KEYS.QUESTS);
      const teams = await storage.load(STORAGE_KEYS.TEAMS);
      const achievements = await storage.load(STORAGE_KEYS.ACHIEVEMENTS);

      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        data: {
          profile: onboarding,
          tracking: trackLogs,
          learning: learnProgress,
          journal: journals,
          quests,
          teams,
          achievements,
        },
        statistics: stats,
      };

      const dataString = JSON.stringify(exportData, null, 2);

      // Create CSV for tracking logs
      let csv = 'Date,Calories,Protein,Fiber,Water,Steps,Active Minutes,Sleep,Stress,Energy\n';
      if (trackLogs) {
        Object.entries(trackLogs).forEach(([date, log]: [string, any]) => {
          csv += `${date},${log.calories||''},${log.protein||''},${log.fiber||''},${log.water||''},${log.steps||''},${log.activeMinutes||''},${log.sleep||''},${log.stress||''},${log.energy||''}\n`;
        });
      }

      Alert.alert(
        'Export Data',
        'Choose format:',
        [
          {
            text: 'JSON (Complete)',
            onPress: () => shareData(dataString, 'stryde_export.json'),
          },
          {
            text: 'CSV (Tracking Only)',
            onPress: () => shareData(csv, 'stryde_tracking.csv'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const shareData = async (data: string, filename: string) => {
    try {
      await Share.share({
        message: data,
        title: `Stryde SG - ${filename}`,
      });
    } catch (error) {
      Alert.alert('Share Failed', 'Unable to share data.');
    }
  };

  const generateReport = () => {
    const report = `
📊 STRYDE SG PERSONAL REPORT
Generated: ${new Date().toLocaleDateString()}
Timeframe: ${timeframe === '7d' ? 'Last 7 Days' : timeframe === '30d' ? 'Last 30 Days' : 'All Time'}

🎯 ACTIVITY OVERVIEW
• Days Logged: ${stats.totalDaysLogged}
• Current Streak: ${stats.currentStreak} days 🔥
• Longest Streak: ${stats.longestStreak} days
• Total Steps: ${stats.totalSteps.toLocaleString()}
• Total Calories Logged: ${stats.totalCalories.toLocaleString()}

📚 LEARNING PROGRESS
• Modules Completed: ${stats.modulesCompleted}/8
• Perfect Quiz Scores: ${stats.quizzesPerfect}

💪 WELLNESS & SOCIAL
• Quests Completed: ${stats.questsCompleted}
• Teams Joined: ${stats.teamsJoined}
• Journal Entries: ${stats.journalEntries}
• Events RSVP'd: ${stats.eventsRSVPd}
• Achievements Unlocked: ${stats.achievementsUnlocked}

😊 WELLBEING METRICS
• Average Mood: ${stats.avgMood}/10
• Average Sleep: ${stats.avgSleep} hours

🌟 Keep up the amazing work! You're making great progress toward your health goals.

--
Stryde SG: Empowering teens to flourish
    `.trim();

    Share.share({
      message: report,
      title: 'My Stryde SG Report',
    });
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics & Insights</Text>
        <Text style={styles.subtitle}>Your journey at a glance</Text>
      </View>

      <View style={styles.timeframeSelector}>
        {(['7d', '30d', 'all'] as const).map(tf => (
          <TouchableOpacity
            key={tf}
            style={[styles.timeframeButton, timeframe === tf && styles.timeframeButtonActive]}
            onPress={() => setTimeframe(tf)}>
            <Text style={[styles.timeframeText, timeframe === tf && styles.timeframeTextActive]}>
              {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Activity</Text>
          <StatCard title="Days Logged" value={stats.totalDaysLogged} icon="📝" color="#3498DB" />
          <StatCard title="Current Streak" value={`${stats.currentStreak} 🔥`} icon="📅" color="#E74C3C" />
          <StatCard title="Longest Streak" value={`${stats.longestStreak} days`} icon="🏆" color="#F39C12" />
          <StatCard title="Total Steps" value={stats.totalSteps.toLocaleString()} icon="👟" color="#27AE60" />
          <StatCard title="Calories Logged" value={stats.totalCalories.toLocaleString()} icon="🔥" color="#E67E22" />
          <StatCard title="Avg Sleep" value={`${stats.avgSleep}h`} icon="😴" color="#9B59B6" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Learning</Text>
          <StatCard title="Modules Completed" value={`${stats.modulesCompleted}/8`} icon="✅" color="#E67E22" />
          <StatCard title="Perfect Scores" value={stats.quizzesPerfect} icon="💯" color="#F1C40F" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Wellness & Social</Text>
          <StatCard title="Quests Done" value={stats.questsCompleted} icon="⭐" color="#1ABC9C" />
          <StatCard title="Teams Joined" value={stats.teamsJoined} icon="🤝" color="#3498DB" />
          <StatCard title="Journal Entries" value={stats.journalEntries} icon="✍️" color="#9B59B6" />
          <StatCard title="Events RSVP'd" value={stats.eventsRSVPd} icon="🎉" color="#E74C3C" />
          <StatCard title="Achievements" value={stats.achievementsUnlocked} icon="🏆" color="#F39C12" />
          <StatCard title="Average Mood" value={`${stats.avgMood}/10`} icon="😊" color="#27AE60" />
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={generateReport}>
            <Text style={styles.actionButtonIcon}>📄</Text>
            <Text style={styles.actionButtonText}>Generate Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={exportData}>
            <Text style={styles.actionButtonIcon}>💾</Text>
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            All your data stays on your device. Exports are shared directly from your phone.
            We never upload your personal information to any servers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#3498DB' },
  backButton: { marginBottom: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  timeframeSelector: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  timeframeButton: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
  timeframeButtonActive: { backgroundColor: '#3498DB' },
  timeframeText: { fontSize: 14, fontWeight: '600', color: '#666' },
  timeframeTextActive: { color: '#fff' },
  scrollView: { flex: 1 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  statIcon: { fontSize: 32, marginRight: 16 },
  statContent: { flex: 1 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  statTitle: { fontSize: 14, color: '#666' },
  actionSection: { padding: 16 },
  actionButton: { backgroundColor: '#3498DB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionButtonSecondary: { backgroundColor: '#27AE60' },
  actionButtonIcon: { fontSize: 24, marginRight: 12 },
  actionButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  infoBox: { backgroundColor: '#E8F5E9', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'flex-start' },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 14, color: '#27AE60', lineHeight: 20 },
});

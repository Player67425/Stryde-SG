import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING: '@stryde_onboarding',
  DAILY_LOGS: '@stryde_daily_logs',
  LEARN_PROGRESS: '@stryde_learn_progress',
  ADVANCED_BOOKMARKS: '@stryde_advanced_bookmarks',
  QUESTS: '@stryde_quests',
  BADGES: '@stryde_badges',
  TEAMS: '@stryde_teams',
  JOURNAL: '@stryde_journal',
  AI_HISTORY: '@stryde_ai_history',
  TARGETS: '@stryde_targets',
};

export const storage = {
  async save(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export { STORAGE_KEYS };

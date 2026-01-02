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
      console.log(`[Storage] Saving to key: ${key}`);
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`[Storage] Successfully saved to ${key}`);
    } catch (error) {
      console.error(`[Storage] Error saving data to ${key}:`, error);
      throw error; // Re-throw to let caller handle
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      console.log(`[Storage] Loading from key: ${key}`);
      const data = await AsyncStorage.getItem(key);
      if (!data) {
        console.log(`[Storage] No data found for ${key}`);
        return null;
      }
      const parsed = JSON.parse(data);
      console.log(`[Storage] Successfully loaded from ${key}`);
      return parsed;
    } catch (error) {
      console.error(`[Storage] Error loading data from ${key}:`, error);
      // Try to clear corrupted data
      try {
        await AsyncStorage.removeItem(key);
        console.log(`[Storage] Cleared corrupted data for ${key}`);
      } catch (clearError) {
        console.error(`[Storage] Failed to clear corrupted data:`, clearError);
      }
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      console.log(`[Storage] Removing key: ${key}`);
      await AsyncStorage.removeItem(key);
      console.log(`[Storage] Successfully removed ${key}`);
    } catch (error) {
      console.error(`[Storage] Error removing data from ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      console.log('[Storage] Clearing all storage');
      await AsyncStorage.clear();
      console.log('[Storage] Successfully cleared all storage');
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
    }
  },
};

export { STORAGE_KEYS };

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    dataSharing: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await storage.load('appSettings');
      if (saved) {
        setSettings(saved);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      // Dark mode is a future feature - show alert
      if (key === 'darkMode') {
        Alert.alert(
          'Coming Soon',
          'Dark mode is a planned feature that will be available in a future update!',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const newSettings = { ...settings, [key]: value };
      await storage.save('appSettings', newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleEditOnboarding = () => {
    Alert.alert(
      'Edit Onboarding Answers',
      'This will take you back to the onboarding quiz so you can update your answers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit Answers',
          onPress: async () => {
            try {
              // Remove onboarding data - this will make the app show onboarding again
              await storage.remove(STORAGE_KEYS.ONBOARDING);
              Alert.alert('Success', 'Onboarding reset. You will be redirected.', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/onboarding')
                }
              ]);
            } catch (error) {
              console.error('Error removing onboarding data:', error);
              Alert.alert('Error', 'Failed to reset onboarding');
            }
          },
        },
      ]
    );
  };

  const handleRedoEverything = () => {
    Alert.alert(
      'Redo Everything',
      'This will reset both your onboarding answers and replay the tutorial. Your other data will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset & Redo',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove onboarding and tutorial completion flags
              await storage.remove(STORAGE_KEYS.ONBOARDING);
              await storage.remove(STORAGE_KEYS.TUTORIAL_COMPLETE);
              Alert.alert('Success', 'Onboarding and tutorial reset. You will be redirected.', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/onboarding')
                }
              ]);
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleReplayTutorial = () => {
    router.push('/tutorial');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your data including onboarding, logs, and progress. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clear();
              Alert.alert('Success', 'All data cleared successfully');
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Onboarding & Tutorial</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleEditOnboarding}>
          <View style={styles.settingLeft}>
            <FontAwesome name="edit" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Edit Onboarding Answers</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleReplayTutorial}>
          <View style={styles.settingLeft}>
            <FontAwesome name="refresh" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Replay Tutorial</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleRedoEverything}>
          <View style={styles.settingLeft}>
            <FontAwesome name="repeat" size={20} color="#f59e0b" />
            <Text style={styles.settingLabel}>Redo Everything</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name="bell" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => saveSetting('notifications', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name="moon-o" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => saveSetting('darkMode', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name="share-alt" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Data Sharing</Text>
          </View>
          <Switch
            value={settings.dataSharing}
            onValueChange={(value) => saveSetting('dataSharing', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name="info-circle" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>App Version</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/privacy')}>
          <View style={styles.settingLeft}>
            <FontAwesome name="file-text" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/terms')}>
          <View style={styles.settingLeft}>
            <FontAwesome name="shield" size={20} color="#6366f1" />
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>

        <TouchableOpacity
          style={[styles.settingItem, styles.dangerItem]}
          onPress={handleClearData}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="trash" size={20} color="#ef4444" />
            <Text style={[styles.settingLabel, styles.dangerText]}>Clear All Data</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f9fafb',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
  },
  settingValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  dangerItem: {
    backgroundColor: '#fef2f2',
  },
  dangerText: {
    color: '#ef4444',
  },
});

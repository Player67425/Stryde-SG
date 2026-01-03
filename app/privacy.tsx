import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 3, 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to Stryde SG! We are committed to protecting your privacy and ensuring you have a safe, secure experience while using our app. This Privacy Policy explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          Stryde SG is designed as an <Text style={styles.bold}>offline-first</Text> application. All your data is stored locally on your device using AsyncStorage. We collect and store:
        </Text>
        <Text style={styles.bulletPoint}>• Onboarding information (age, height, weight, activity level, sleep hours, stress level, health goals, dietary preferences, and sex)</Text>
        <Text style={styles.bulletPoint}>• Daily tracking data (nutrition, hydration, exercise, mood, sleep logs)</Text>
        <Text style={styles.bulletPoint}>• Learning progress (module completion, quiz scores)</Text>
        <Text style={styles.bulletPoint}>• Profile information (name, bio, chosen profile icon)</Text>
        <Text style={styles.bulletPoint}>• App preferences (notification settings, theme preferences)</Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          Your information is used solely to provide you with a personalized experience within the app:
        </Text>
        <Text style={styles.bulletPoint}>• To calculate personalized health recommendations</Text>
        <Text style={styles.bulletPoint}>• To track your progress over time</Text>
        <Text style={styles.bulletPoint}>• To provide educational content relevant to your goals</Text>
        <Text style={styles.bulletPoint}>• To generate insights based on your tracking data</Text>

        <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>All your data remains on your device.</Text> We do not transmit your personal information to external servers or third parties. Your data is stored using React Native's AsyncStorage, which keeps information secure on your device.
        </Text>
        <Text style={styles.paragraph}>
          Because data is stored locally, please note that:
        </Text>
        <Text style={styles.bulletPoint}>• Uninstalling the app will delete all your data</Text>
        <Text style={styles.bulletPoint}>• Your data is not synced across devices</Text>
        <Text style={styles.bulletPoint}>• You are responsible for backing up your device</Text>

        <Text style={styles.sectionTitle}>4. Teen Privacy Protection</Text>
        <Text style={styles.paragraph}>
          Stryde SG is designed specifically for teens aged 12-19. We take teen privacy seriously:
        </Text>
        <Text style={styles.bulletPoint}>• We do not collect personal identifiable information beyond what you choose to enter</Text>
        <Text style={styles.bulletPoint}>• There is no account system requiring email addresses or phone numbers</Text>
        <Text style={styles.bulletPoint}>• We do not share data with parents, guardians, or third parties</Text>
        <Text style={styles.bulletPoint}>• You have full control to delete all your data at any time from Settings</Text>

        <Text style={styles.sectionTitle}>5. No External Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do <Text style={styles.bold}>not</Text> share, sell, or transmit your personal information to any third parties, advertisers, or external services. Your data stays with you.
        </Text>

        <Text style={styles.sectionTitle}>6. Singapore Context</Text>
        <Text style={styles.paragraph}>
          Stryde SG is developed with Singapore teens in mind. All food examples, activity recommendations, and content are tailored to the Singapore context. We comply with Singapore's Personal Data Protection Act (PDPA) principles, even though no data leaves your device.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Rights and Control</Text>
        <Text style={styles.paragraph}>
          You have complete control over your data:
        </Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Access:</Text> You can view all your data within the app at any time</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Edit:</Text> You can modify your onboarding answers and profile information in Settings</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Delete:</Text> You can clear all data through Settings → Danger Zone → Clear All Data</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Export:</Text> While the current version doesn't have export functionality, all data is stored in standard JSON format on your device</Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be reflected in the "Last Updated" date at the top. We encourage you to review this policy periodically.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or concerns about this Privacy Policy, please contact us at:
        </Text>
        <Text style={styles.contact}>Email: privacy@strydesg.app</Text>
        <Text style={styles.contact}>Support: support@strydesg.app</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Stryde SG, you acknowledge that you have read and understood this Privacy Policy.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  contact: {
    fontSize: 15,
    color: '#6366f1',
    lineHeight: 24,
    marginBottom: 4,
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

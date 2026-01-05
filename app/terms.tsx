import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 3, 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to Stryde SG! These Terms of Service ("Terms") govern your use of the Stryde SG mobile application. By using the app, you agree to these Terms. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Stryde SG, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the app.
        </Text>

        <Text style={styles.sectionTitle}>2. Age Requirements</Text>
        <Text style={styles.paragraph}>
          Stryde SG is designed for users aged <Text style={styles.bold}>12 to 19 years old</Text>. By using this app, you confirm that you are within this age range. If you are under 12 or over 19, this app is not intended for you.
        </Text>

        <Text style={styles.sectionTitle}>3. Health Information Disclaimer</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Important:</Text> Stryde SG is an educational and tracking tool designed to promote healthy habits. It is <Text style={styles.bold}>NOT</Text> a substitute for professional medical advice, diagnosis, or treatment.
        </Text>
        <Text style={styles.bulletPoint}>• Always consult with a qualified healthcare provider before making significant changes to your diet, exercise routine, or lifestyle</Text>
        <Text style={styles.bulletPoint}>• If you have any medical conditions, allergies, or concerns, seek professional medical advice</Text>
        <Text style={styles.bulletPoint}>• The information provided in the app is for general educational purposes only</Text>
        <Text style={styles.bulletPoint}>• Individual results may vary based on personal circumstances</Text>

        <Text style={styles.sectionTitle}>4. Proper Use of the App</Text>
        <Text style={styles.paragraph}>
          You agree to use Stryde SG responsibly and in accordance with these guidelines:
        </Text>
        <Text style={styles.bulletPoint}>• Use the app to support healthy, balanced lifestyle habits</Text>
        <Text style={styles.bulletPoint}>• Do not use the app to promote or engage in disordered eating, extreme dieting, or unhealthy weight loss practices</Text>
        <Text style={styles.bulletPoint}>• Do not share harmful, offensive, or inappropriate content through any app features</Text>
        <Text style={styles.bulletPoint}>• Respect the educational nature of the content and use it constructively</Text>

        <Text style={styles.sectionTitle}>5. Non-Negotiable Principles</Text>
        <Text style={styles.paragraph}>
          Stryde SG is built on core principles that we strictly uphold:
        </Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>No shame or punishment:</Text> We use supportive, non-judgmental language throughout</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>No body comparison:</Text> There are no weight-loss leaderboards or body comparison features</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Teen autonomy:</Text> No parent/guardian mode or monitoring features</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Safety first:</Text> The app will not provide extreme dieting recommendations</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Evidence-based:</Text> All content is based on credible scientific sources</Text>

        <Text style={styles.sectionTitle}>6. Content and Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content, features, and functionality of Stryde SG, including but not limited to text, graphics, logos, and software, are owned by Stryde SG and protected by intellectual property laws.
        </Text>
        <Text style={styles.paragraph}>
          You may not:
        </Text>
        <Text style={styles.bulletPoint}>• Copy, reproduce, or distribute app content without permission</Text>
        <Text style={styles.bulletPoint}>• Modify, reverse engineer, or create derivative works</Text>
        <Text style={styles.bulletPoint}>• Use the app for commercial purposes</Text>

        <Text style={styles.sectionTitle}>7. Data and Privacy</Text>
        <Text style={styles.paragraph}>
          Stryde SG is an <Text style={styles.bold}>offline-first application</Text>. All your data is stored locally on your device and is not transmitted to external servers. For more details, please review our Privacy Policy.
        </Text>
        <Text style={styles.paragraph}>
          You are responsible for:
        </Text>
        <Text style={styles.bulletPoint}>• Keeping your device secure</Text>
        <Text style={styles.bulletPoint}>• Backing up your data if desired (note: uninstalling the app will delete all data)</Text>
        <Text style={styles.bulletPoint}>• Understanding that data is not synced across devices</Text>

        <Text style={styles.sectionTitle}>8. Singapore Context</Text>
        <Text style={styles.paragraph}>
          Stryde SG is specifically designed for teens in Singapore. The app includes Singapore-focused content such as local food examples (hawker centers, canteens, bubble tea), local fitness events, and context relevant to Singapore's health environment.
        </Text>

        <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the fullest extent permitted by law:
        </Text>
        <Text style={styles.bulletPoint}>• Stryde SG is provided "as is" without warranties of any kind</Text>
        <Text style={styles.bulletPoint}>• We are not liable for any health outcomes, injuries, or damages resulting from use of the app</Text>
        <Text style={styles.bulletPoint}>• We are not responsible for data loss due to device issues, uninstallation, or technical problems</Text>
        <Text style={styles.bulletPoint}>• We do not guarantee that the app will be error-free or uninterrupted</Text>

        <Text style={styles.sectionTitle}>10. Prohibited Content</Text>
        <Text style={styles.paragraph}>
          The app will refuse and does not support:
        </Text>
        <Text style={styles.bulletPoint}>• Self-harm or disordered eating content</Text>
        <Text style={styles.bulletPoint}>• Extreme dieting recommendations</Text>
        <Text style={styles.bulletPoint}>• Bullying or harassment</Text>
        <Text style={styles.bulletPoint}>• Inappropriate or harmful material</Text>

        <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. Changes will be reflected in the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the modified Terms.
        </Text>

        <Text style={styles.sectionTitle}>12. Termination</Text>
        <Text style={styles.paragraph}>
          You may stop using Stryde SG at any time by uninstalling the app. We reserve the right to terminate or restrict access to the app for violations of these Terms.
        </Text>

        <Text style={styles.sectionTitle}>13. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of Singapore. Any disputes arising from these Terms or use of the app shall be subject to the jurisdiction of Singapore courts.
        </Text>

        <Text style={styles.sectionTitle}>14. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms, please contact us:
        </Text>
        <Text style={styles.contact}>Email: legal@strydesg.app</Text>
        <Text style={styles.contact}>Support: support@strydesg.app</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Stryde SG, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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

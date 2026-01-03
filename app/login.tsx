import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return;
    }

    if (!password) {
      Alert.alert('Missing Information', 'Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      // Load existing accounts
      const accounts = await storage.load(STORAGE_KEYS.ACCOUNTS) || [];
      
      // Find matching account
      const account = accounts.find(
        (acc: any) => acc.email.toLowerCase() === email.toLowerCase().trim() && acc.password === password
      );

      if (!account) {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please try again.',
          [
            { text: 'Try Again', style: 'cancel' },
            {
              text: 'Create Account',
              onPress: () => router.replace('/signup'),
            },
          ]
        );
        setIsLoading(false);
        return;
      }

      // Update last login
      const updatedAccount = {
        ...account,
        lastLogin: new Date().toISOString(),
      };

      const updatedAccounts = accounts.map((acc: any) =>
        acc.id === account.id ? updatedAccount : acc
      );
      await storage.save(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

      // Set current user
      await storage.save(STORAGE_KEYS.CURRENT_USER, updatedAccount);
      await storage.save(STORAGE_KEYS.AUTH_COMPLETE, true);

      // Check if onboarding is complete
      const onboarding = await storage.load(STORAGE_KEYS.ONBOARDING);
      const tutorialComplete = await storage.load(STORAGE_KEYS.TUTORIAL_COMPLETE);

      if (onboarding?.completed && tutorialComplete) {
        // Go straight to app
        router.replace('/(tabs)');
      } else if (onboarding?.completed) {
        // Go to tutorial
        router.replace('/tutorial');
      } else {
        // Go to onboarding
        router.replace('/onboarding');
      }

      Alert.alert('Welcome Back! 👋', `Logged in as ${account.username}`);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Since all data is stored locally on your device, you\'ll need to create a new account if you\'ve forgotten your password. Your previous data will remain until you clear app data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create New Account',
          onPress: () => router.replace('/signup'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your wellness journey</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showPasswordText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/signup')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>
            🔒 All data stays on your device{'\n'}
            No cloud storage • No external servers • Complete privacy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#3498DB',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: 20,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  showPasswordText: {
    fontSize: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#3498DB',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpPromptText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  securityNotice: {
    padding: 20,
    marginTop: 'auto',
  },
  securityText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

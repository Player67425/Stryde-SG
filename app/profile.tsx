import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: 'Teen User',
    bio: 'Living a healthier life, one Stryde at a time! 💪',
    profileIcon: 'user-circle',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await storage.get('userProfile');
      if (saved) {
        setProfileData(saved);
        setEditedData(saved);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await storage.save('userProfile', editedData);
      setProfileData(editedData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? Your data will be saved locally.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Logged Out', 'You have been logged out. (Demo mode - data is saved locally)');
            router.replace('/');
          },
        },
      ]
    );
  };

  const iconOptions = [
    'user-circle',
    'smile-o',
    'heart',
    'star',
    'leaf',
    'trophy',
    'rocket',
    'graduation-cap',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? saveProfile() : setIsEditing(true))}
          style={styles.editButton}
        >
          <FontAwesome name={isEditing ? 'check' : 'edit'} size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileIconContainer}>
        <FontAwesome
          name={isEditing ? editedData.profileIcon as any : profileData.profileIcon as any}
          size={100}
          color="#6366f1"
        />
      </View>

      {isEditing && (
        <View style={styles.iconSelector}>
          <Text style={styles.sectionLabel}>Choose Profile Icon:</Text>
          <View style={styles.iconGrid}>
            {iconOptions.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => setEditedData({ ...editedData, profileIcon: icon })}
                style={[
                  styles.iconOption,
                  editedData.profileIcon === icon && styles.iconOptionSelected,
                ]}
              >
                <FontAwesome name={icon as any} size={32} color="#6366f1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedData.name}
            onChangeText={(text) => setEditedData({ ...editedData, name: text })}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={styles.valueText}>{profileData.name}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Bio</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={editedData.bio}
            onChangeText={(text) => setEditedData({ ...editedData, bio: text })}
            placeholder="Write a short bio..."
            multiline
            numberOfLines={3}
          />
        ) : (
          <Text style={styles.valueText}>{profileData.bio}</Text>
        )}
      </View>

      {!isEditing && (
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#ef4444" />
            <Text style={styles.actionButtonTextDanger}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditing && (
        <TouchableOpacity
          onPress={() => {
            setEditedData(profileData);
            setIsEditing(false);
          }}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
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
  editButton: {
    padding: 8,
  },
  profileIconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconSelector: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  actionButtonTextDanger: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});

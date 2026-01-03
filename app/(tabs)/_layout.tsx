import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, Alert } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { storage, STORAGE_KEYS } from '@/utils/storage';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleInfoPress = () => {
    Alert.alert(
      'Settings',
      'What would you like to do?',
      [
        {
          text: 'Redo Onboarding Quiz',
          onPress: async () => {
            Alert.alert(
              'Redo Onboarding?',
              'This will reset your onboarding answers. Your other data will be kept.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Redo Quiz',
                  style: 'destructive',
                  onPress: async () => {
                    await storage.remove(STORAGE_KEYS.ONBOARDING);
                    router.replace('/onboarding');
                  },
                },
              ]
            );
          },
        },
        {
          text: 'Replay Tutorial',
          onPress: () => {
            router.push('/tutorial');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => (
          <TouchableOpacity onPress={handleInfoPress} style={{ marginRight: 15 }}>
            <FontAwesome name="info-circle" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Connect',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reflect"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ color }) => <TabBarIcon name="pencil" color={color} />,
        }}
      />
      <Tabs.Screen
        name="aicoach"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
        }}
      />
    </Tabs>
  );
}

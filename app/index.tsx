import { Redirect } from 'expo-router';

export default function Index() {
  // This will be handled by the _layout.tsx navigation logic
  // which checks onboarding status and redirects appropriately
  return <Redirect href="/(tabs)" />;
}

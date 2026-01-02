import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  console.log('[Index] Simplified component rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✅ Stryde SG App is Working!</Text>
      <Text style={styles.subtext}>If you see this, the app is rendering correctly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

import { ThemedButton, ThemedIcon, ThemedText, ThemedView } from '@/components/themed';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const App = () => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type='title'>Exercise App</ThemedText>
        <Pressable onPress={() => router.push('/settings')}>
          <ThemedText>
            <ThemedIcon name='Settings' />
          </ThemedText>
        </Pressable>
      </View>
      <ThemedButton 
        onPress={() => router.push('/addWorkout')} 
        style={styles.add_exercise}
      >
        <ThemedIcon name='Plus' />
      </ThemedButton>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  add_exercise: {
    position: 'absolute',
    borderRadius: 50,
    padding: 20,
    bottom: 50,
    right: 30,
  }
})

export default App;

import { ThemedButton, ThemedIcon, ThemedText, ThemedView } from '@/components/themed';
import { getAllWourkouts } from '@/utils/database';
import { type Workout } from '@/utils/databaseTypes';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    setWorkouts(getAllWourkouts())
  }, [])

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
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.workout_id.toString()}
        renderItem={({item}) => (
          <Pressable>
            <Text>{item.emoji}</Text>
            <ThemedText>{item.name}</ThemedText>
          </Pressable>
        )}
      />
      <ThemedButton 
        onPress={() => router.push('/createWorkout')} 
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

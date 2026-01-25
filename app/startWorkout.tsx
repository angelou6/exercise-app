import { ThemedButton, ThemedIcon, ThemedText } from '@/components/themed';
import { CardColor } from '@/constants/theme';
import { deleteWorkout, getExercisesFromWorkout, getOneWorkout } from '@/utils/database';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const { workoutId } = useLocalSearchParams();
  const theme = useColorScheme() ?? 'light';
  const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [theme]);

  const [workout, setWorkout] = useState(getOneWorkout(workoutId.toString()));
  const [exercises, setExercises] = useState(getExercisesFromWorkout(parseInt(workoutId.toString())));

  useFocusEffect(
    useCallback(() => {
      const updatedWorkout = getOneWorkout(workoutId.toString());
      const updatedExercises = getExercisesFromWorkout(parseInt(workoutId.toString()));
      setWorkout(updatedWorkout);
      setExercises(updatedExercises);
    }, [workoutId])
  );

  if (!workout) return null;

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalTime = totalDuration + (exercises.length - 1) * workout.rest
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workout?.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          deleteWorkout(parseInt(workoutId.toString()))
          router.push('/');
        }}
      ]
    );
  };
  
  const handleEdit = () => {
    router.push({
      pathname: '/createWorkout',
      params: {
        wId: workoutId,
        wEmoji: workout.emoji,
        wName: workout.name,
        wRest: workout.rest
      }
    });
  };
  
  const handleStart = () => {
    router.push({
      pathname: '/workout',
      params: {
        wId: workoutId,
        wRest: workout.rest
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleEdit} style={styles.iconButton}>
            <ThemedIcon name="Pencil" size={20} />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.iconButton}>
            <ThemedIcon name="Trash2" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.workoutCard, { backgroundColor: cardTheme.background, borderColor: cardTheme.border }]}>
          <View style={styles.workoutHeader}>
            <Text style={styles.emoji}>{workout.emoji}</Text>
            <View style={styles.workoutInfo}>
              <ThemedText type="subtitle">{workout.name}</ThemedText>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <ThemedIcon name="Timer" size={16} variant="dimmed" />
                  <ThemedText type="dimmed" style={styles.statText}>
                    {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')} total
                  </ThemedText>
                </View>
                <View style={styles.stat}>
                  <ThemedIcon name="Dumbbell" size={16} variant="dimmed" />
                  <ThemedText type="dimmed" style={styles.statText}>
                    {exercises.length} exercises
                  </ThemedText>
                </View>
                </View>
              </View>
            </View>

            <View style={[styles.restInfo, { backgroundColor: cardTheme.border }]}>
              <ThemedIcon name="Clock" size={16} variant="dimmed" />
              <ThemedText type="dimmed" style={styles.restText}>
                {workout.rest}s rest between exercises
              </ThemedText>
            </View>
        </View>
        <View style={styles.section}>
            {exercises.map((exercise) => (
              <View 
                key={exercise.exercise.id} 
                style={[styles.exerciseCard, { backgroundColor: cardTheme.background, borderColor: cardTheme.border }]}>
                  <View style={styles.exerciseInfo}>
                    <ThemedText type="defaultSemiBold">{exercise.exercise.name}</ThemedText>
                    <View style={styles.exerciseMeta}>
                      <ThemedIcon name="Timer" size={14} variant="dimmed" />
                      <ThemedText type="dimmed" style={styles.durationText}>
                        {exercise.duration}s
                      </ThemedText>
                    </View>
                  </View>
              </View>
            ))}
          </View>
      </ScrollView>
        <View style={styles.footer}>
          <ThemedButton onPress={handleStart} style={styles.startButton}>
              <ThemedIcon name="Play" size={24} />
              <Text>Start Workout</Text>
          </ThemedButton>
        </View>
    </SafeAreaView>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
  workoutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
  },
  workoutInfo: {
    flex: 1,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
  },
  restInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  restText: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 13,
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 16,
  },
});
  
export default App;
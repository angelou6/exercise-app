import { ThemedButton, ThemedIcon, ThemedText } from '@/components/themed';
import DragableItem from '@/components/ui/createWorkout/dragableItem';
import AddExerciseModal from '@/components/ui/createWorkout/exercise-modal';
import WorkoutHeader from '@/components/ui/createWorkout/header';
import { CardColor } from '@/constants/theme';
import { createWorkout, getExercisesFromWorkout, updateWorkout } from '@/utils/database';
import { type Exercise, type SubmitExercise } from '@/utils/databaseTypes';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReorderableList, { ReorderableListReorderEvent, reorderItems } from 'react-native-reorderable-list';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const db = useSQLiteContext();
  const { wId, wEmoji, wName, wRest } = useLocalSearchParams();

  const theme = useColorScheme() ?? 'light';
  const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [theme]);

  const defaultDuration = 30;
  const isEdit = !!wId;

  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<SubmitExercise[]>([]);

  const [emoji, setEmoji] = useState(wEmoji?.toString() || "️💪");
  const [name, setName] = useState(wName?.toString() || "");
  const [restTime, setRestTime] = useState(wRest?.toString() || "5");

  useEffect(() => {
    if (wId) {
      const loadedExercises = getExercisesFromWorkout(db, parseInt(wId.toString()));
      const sortedExercises = [...loadedExercises].sort((a, b) => a.order - b.order);
      setExercises(sortedExercises);
    }
  }, [wId, db]);

  const addExercise = (newEx: Exercise, duration=defaultDuration) => {
    for (const ex of exercises) if (ex.exercise.id === newEx.id) return;
    const submitEx: SubmitExercise = {
      exercise: newEx, 
      order: exercises.length+1,
      duration: duration
    }
    setExercises([...exercises, submitEx])
  }

  const deleteExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.exercise.id !== id))
  }

  const handleCreateWorkout = () => {
    if (!name.trim()) return;
    createWorkout(db, emoji, name, parseInt(restTime), exercises);
    router.push('/')
  }

  const handleUpdateWorkout = () => {
    if (!name.trim()) return;
    updateWorkout(db, parseInt(wId.toString()), emoji, name, parseInt(restTime), exercises);
    router.back()
  }

  const updateExerciseDuration = (exercise: SubmitExercise, time: number) => {
    setExercises(
      exercises.map((ex) => {
        if (ex === exercise) {
          return {...ex, duration: time }
        }
        return ex
      })
    )
  }

  const handleReorder = ({from, to}: ReorderableListReorderEvent) => {
    setExercises(value => reorderItems(value, from, to));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AddExerciseModal 
          modalVisible={modalVisible} 
          addExecise={addExercise}
          removeExercise={deleteExercise}
          setModalVisible={setModalVisible} 
          selected={exercises}
        />

        <View style={styles.container}>
          <ReorderableList 
            data={exercises}
            onReorder={handleReorder}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.exercise.id.toString()}
            ListHeaderComponent={
              <WorkoutHeader 
                name={name} 
                setName={setName} 
                emoji={emoji} 
                setEmoji={setEmoji} 
                restTime={restTime}
                setRestTime={setRestTime}
                cardTheme={cardTheme}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyCard}>
                  <ThemedIcon name="ListPlus" size={48} variant="dimmed" />
                  <ThemedText type="subtitle">No Exercises</ThemedText>
                </View>
              </View>
            }
            ListFooterComponent={
              <Pressable onPress={() => setModalVisible(true)} style={styles.addExerciseButton}>
                <ThemedIcon name="Plus" />
                <ThemedText type="defaultSemiBold">Add Exercise</ThemedText>
              </Pressable>
            }
            renderItem={({ item }: ListRenderItemInfo<SubmitExercise>) => (
              <DragableItem 
                item={item} 
                cardTheme={cardTheme} 
                defaultDuration={item.duration}
                updateExerciseDuration={updateExerciseDuration}
                deleteExercise={deleteExercise}
              />
            )}
          />
        </View>
        <View style={styles.footer}>
          {isEdit ? 
            <ThemedButton 
              onPress={() => handleUpdateWorkout()} 
              style={[
                styles.saveButton, 
                (!name.trim() || exercises.length === 0) && { opacity: 0.5 }
              ]}
              disabled={!name.trim() || exercises.length === 0}
            >
              <ThemedIcon name="Save" size={20} />
              <Text style={styles.saveButtonText}>Update Workout</Text>
            </ThemedButton>
          :
            <ThemedButton 
              onPress={() => handleCreateWorkout()} 
              style={[
                styles.saveButton, 
                (!name.trim() || exercises.length === 0) && { opacity: 0.5 }
              ]}
              disabled={!name.trim() || exercises.length === 0}
            >
              <ThemedIcon name="Check" size={20} />
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </ThemedButton>
          }
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footer: {
    padding: 16,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
  },
})

export default App;

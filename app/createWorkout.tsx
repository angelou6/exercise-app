import { ThemedButton, ThemedIcon, ThemedText } from '@/components/themed';
import DragableItem from '@/components/ui/createWorkout/dragableItem';
import AddExerciseModal from '@/components/ui/createWorkout/exercise-modal';
import WorkoutHeader from '@/components/ui/createWorkout/header';
import { CardColor } from '@/constants/theme';
import { createWorkout, getExercisesFromWorkout, updateWorkout } from '@/utils/database';
import { type Exercise, type SubmitExercise } from '@/utils/databaseTypes';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const { wId, wEmoji, wName, wRest } = useLocalSearchParams();

  const theme = useColorScheme() ?? 'light';
  const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [theme]);

  const defaultDuration = 30;
  let isEdit = false;

  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<SubmitExercise[]>([]);

  const [emoji, setEmoji] = useState(wEmoji?.toString() || "️💪");
  const [name, setName] = useState(wName?.toString() || "");
  const [restTime, setRestTime] = useState(wRest?.toString() || "5");

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
    createWorkout(emoji, name, parseInt(restTime), exercises);
    router.push('/')
  }

  const handleUpdateWorkout = () => {
    if (!name.trim()) return;
    updateWorkout(parseInt(wId.toString()), emoji, name, parseInt(restTime), exercises);
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

  if (wId) {
    isEdit = true;
    const exercises = getExercisesFromWorkout(parseInt(wId.toString()))
    const sortedExercises = [...exercises].sort((a, b) => a.order - b.order).reverse();

    for (const ex of sortedExercises) {
      addExercise(ex.exercise, ex.duration)
    }
  }

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
          <DraggableFlatList
            data={exercises}
            keyExtractor={(item) => item.exercise.id.toString()}
            keyboardShouldPersistTaps="handled"
            onDragEnd={(data) => setExercises(data.data)}
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
              <View style={styles.emptyState}>
                <ThemedIcon name="Dumbbell" size={48} variant="dimmed" />
                <ThemedText type="dimmed">No exercises</ThemedText>
              </View>
            }
            ListFooterComponent={
              <Pressable onPress={() => setModalVisible(true)} style={styles.addExerciseButton}>
                <ThemedIcon name="Plus" />
                <ThemedText type="defaultSemiBold">Add Exercise</ThemedText>
              </Pressable>
            }
          renderItem={({ item, drag }: RenderItemParams<SubmitExercise>) => (
            <DragableItem 
              item={item} 
              drag={drag} 
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

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    gap: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
})

export default App;

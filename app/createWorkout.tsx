import { ThemedButton, ThemedEmojiPicker, ThemedIcon, ThemedInput, ThemedText, ThemedView } from '@/components/themed';
import AddExerciseModal from '@/components/ui/exercise-modal';
import { CardColor } from '@/constants/theme';
import { createWorkout } from '@/utils/database';
import { type Exercise, type SubmitExercise } from '@/utils/databaseTypes';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { type EmojiType } from 'rn-emoji-keyboard';

const App = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [emoji, setEmoji] = useState("️💪");
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");
  const [exerciseData, setExerciseData] = useState<SubmitExercise[]>([]);
  const [restTime, setRestTime] = useState("5");
  const theme = useColorScheme() ?? 'light';
  const defaultTime = 30;

  const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [])

  const handlePick = (emojiObject: EmojiType) => {
    setEmoji(emojiObject.emoji);
  }

  const addExercise = (newEx: Exercise) => {
    for (const ex of exercises) if (ex.exercise_id === newEx.exercise_id) return;
    setExercises([...exercises, newEx])
    setExerciseData([...exerciseData, { exerciseId: newEx.exercise_id, exerciseTime: defaultTime }])
  }

  const deleteExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.exercise_id !== id))
    setExerciseData(exerciseData.filter((ex) => ex.exerciseId !== id))
  }

  const updateExerciseTime = (id: number, time: string) => {
    const numTime = parseInt(time) || 0;
    setExerciseData(exerciseData.map((ex) => 
      ex.exerciseId === id ? { ...ex, exerciseTime: numTime } : ex
    ))
  }

  const handleCreateWorkout = () => {
    if (!name.trim()) return;
    createWorkout(emoji, name, parseInt(restTime), exerciseData);
    router.push('/')
  }

  const renderHeader = () => (
    <View style={{ backgroundColor: 'transparent' }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedIcon name='ArrowLeft' />
        </Pressable>
        <ThemedText type='title'>Create Workout</ThemedText>
      </View>

      <View style={[styles.section, { borderColor: cardTheme.border, backgroundColor: cardTheme.background }]}>
        <View style={styles.topRow}>
          <Pressable onPress={() => setIsOpen(true)} style={[styles.emojiButton, { backgroundColor: cardTheme.border }]}>
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
          <View>
            <ThemedInput 
              value={name}
              onChangeText={setName}
              style={styles.workoutName} 
              placeholder='Workout Name' 
            />
          </View>
        </View>

        <View style={styles.restRow}>
          <ThemedText>Rest between exercises</ThemedText>
          <View style={styles.restInputContainer}>
            <ThemedInput
              keyboardType='numeric'
              placeholder={defaultTime.toString()}
              value={restTime}
              onChangeText={setRestTime}
              style={styles.restInputField}
            />
            <ThemedText style={styles.unit}>s</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.container}>
        <ThemedEmojiPicker 
          onEmojiSelected={handlePick} 
          open={isOpen} 
          onClose={() => setIsOpen(false)} 
        />

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
            keyExtractor={(item) => item.exercise_id.toString()}
            keyboardShouldPersistTaps="handled"
            onDragEnd={(data) => {
              setExercises(data.data)
              const newExerciseData = data.data.map(ex => 
                exerciseData.find(ed => ed.exerciseId === ex.exercise_id) || { exerciseId: ex.exercise_id, exerciseTime: defaultTime }
              )
              setExerciseData(newExerciseData)
            }}
            ListHeaderComponent={renderHeader()}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ThemedIcon name="Dumbbell" size={48} color={cardTheme.sub} />
                <ThemedText type="default" style={{color: cardTheme.sub, marginTop: 8}}>No exercises</ThemedText>
              </View>
            }
            ListFooterComponent={
              <Pressable onPress={() => setModalVisible(true)} style={styles.addExerciseButton}>
                <ThemedIcon name="Plus" />
                <ThemedText type="defaultSemiBold">Add Exercise</ThemedText>
              </Pressable>
            }
          renderItem={({ item, drag }: RenderItemParams<Exercise>) => (
            <View style={[ styles.card, { 
                backgroundColor: cardTheme.background, 
                borderColor: cardTheme.border 
              }]}>
              <Pressable onPressIn={drag} style={styles.dragHandle} hitSlop={12}>
                <ThemedIcon name="GripVertical" color={cardTheme.sub} />
              </Pressable>
              <View style={styles.cardTextBlock}>
                <ThemedText type="defaultSemiBold" style={{fontSize: 16}}>{item.name}</ThemedText>
                {item.description?.length > 0 && (
                  <Text style={[styles.smallText, { color: cardTheme.sub }]} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <View style={[styles.exTime, { backgroundColor: cardTheme.border }]}>
                  <ThemedInput 
                    keyboardType='numeric' 
                    placeholder={defaultTime.toString()}
                    value={exerciseData.find(ex => ex.exerciseId === item.exercise_id)?.exerciseTime.toString() || defaultTime.toString()}
                    onChangeText={(text) => updateExerciseTime(item.exercise_id, text)}
                    style={styles.timeInput}
                  />
                  <ThemedText style={styles.timeUnit}>s</ThemedText>
                </View>
                <Pressable 
                  style={styles.iconButton} 
                  onPress={() => deleteExercise(item.exercise_id)}>
                  <ThemedIcon name="Trash2" size={20} color={cardTheme.sub} />
                </Pressable>
              </View>
            </View>
          )}
            />
        </View>
        <View style={styles.footer}>
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
        </View>
      </ThemedView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },

  emojiButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emoji: {
    fontSize: 32,
  },

  workoutName: {
    fontSize: 18,
    width: 1000,
    fontWeight: 'bold',
  },

  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  restInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  restInputField: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 4,
  },

  unit: {
    opacity: 0.6,
  },

  sectionTitle: {
    marginLeft: 20,
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  dragHandle: {
    padding: 8,
  },

  cardTextBlock: {
    flex: 1,
    marginHorizontal: 8,
  },

  smallText: {
    fontSize: 13,
    marginTop: 2,
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  exTime: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  timeInput: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    padding: 0,
  },

  timeUnit: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 2,
  },

  iconButton: {
    padding: 4,
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
    paddingBottom: 24,
    borderTopWidth: 1,
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

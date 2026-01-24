import { ThemedButton, ThemedEmojiPicker, ThemedIcon, ThemedInput, ThemedText, ThemedView } from '@/components/themed';
import AddExerciseModal from '@/components/ui/exercise-modal';
import { type Exercise } from '@/utils/databaseTypes';
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
  const theme = useColorScheme() ?? 'light';

  const cardColor = useMemo(() => theme === 'light' ? '#f6f8fb' : '#111315', [theme]);
  const cardBorder = useMemo(() => theme === 'light' ? '#e4e6eb' : '#1f2429', [theme]);
  const textSubdued = useMemo(() => theme === 'light' ? '#555b66' : '#c2c7cf', [theme]);

  const handlePick = (emojiObject: EmojiType) => {
    setEmoji(emojiObject.emoji);
  }

  const addExercise = (newEx: Exercise) => {
    for (const ex of exercises) if (ex.exercise_id === newEx.exercise_id) return;
    setExercises([...exercises, newEx])
  }

  const deleteExercise = (exId: number) => {
    setExercises(exercises.filter((ex) => ex.exercise_id !== exId))
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView>
        <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
            <ThemedIcon name='X' />
        </Pressable>
        <ThemedText type='title'>Create Workout</ThemedText>
      </View>
      <View style={styles.info}>
        <Pressable onPress={() => setIsOpen(true)}>
          <Text style={styles.emoji}>{emoji}</Text>
        </Pressable>
        <ThemedInput style={styles.workoutName} placeholder='Workout Name' />
      </View>

      <ThemedEmojiPicker 
        onEmojiSelected={handlePick} 
        open={isOpen} 
        onClose={() => setIsOpen(false)} />

      <AddExerciseModal 
        modalVisible={modalVisible} 
        addExecise={addExercise}
        removeExercise={deleteExercise}
        setModalVisible={setModalVisible} 
        selected={exercises}
      />
        <View style={styles.listWrapper}>
          {exercises.length > 0 ? (
            <DraggableFlatList
              data={exercises}
              keyExtractor={(item) => item.exercise_id.toString()}
              onDragEnd={(data) => setExercises(data.data)}
              activationDistance={12}
              containerStyle={styles.listContainer}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.itemSpacer} />}
              renderItem={({ item, drag, isActive }: RenderItemParams<Exercise>) => (
                <View style={[styles.card, { backgroundColor: cardColor, borderColor: cardBorder }, isActive && styles.cardActive]}>
                  <Pressable onPressIn={drag} style={styles.dragHandle} hitSlop={12}>
                    <ThemedIcon name="GripVertical" />
                  </Pressable>
                  <View style={styles.cardTextBlock}>
                    <ThemedText type="subtitle">{item.name}</ThemedText>
                    {item.description?.length > 0 && (
                      <Text style={[styles.smallText, { color: textSubdued }]} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardActions}>
                    <View style={styles.exTime}>
                      <ThemedInput keyboardType='numeric' placeholder='30' />
                      <ThemedText>s</ThemedText>
                    </View>
                    <Pressable 
                      style={styles.iconButton} 
                      onPress={() => deleteExercise(item.exercise_id)}>
                      <ThemedIcon name="Trash2" size={18} />
                    </Pressable>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <ThemedIcon name="ListChecks" size={26} />
              <ThemedText type="subtitle">No exercises yet</ThemedText>
            </View>
          )}

          <Pressable onPress={() => setModalVisible(true)} style={styles.addExercise}>
            <ThemedIcon name="Plus" />
            <ThemedText>Add new exercise</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
      <ThemedButton 
        onPress={() => router.push('/addWorkout')} 
        style={styles.checkButton}>
        <ThemedIcon name="Check" />
      </ThemedButton>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 20,
  },

  exTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  workoutName: {
    fontSize: 20,
  },

  emoji: {
    fontSize: 70,
  },

  info: {
    alignItems: 'center',
    marginBottom: 8,
  },

  listWrapper: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  listContainer: {
    flexGrow: 1,
  },

  listContent: {
    paddingBottom: 16,
  },

  itemSpacer: {
    height: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  cardActive: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },

  dragHandle: {
    padding: 6,
    marginRight: 10,
  },

  cardTextBlock: {
    flex: 1,
    gap: 4,
  },

  smallText: {
    fontSize: 13,
  },

  cardActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },

  iconButton: {
    padding: 6,
    borderRadius: 8,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },

  addExercise: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  exercises: {
    marginTop: 20,
    alignItems: 'center'
  },

  checkButton: {
    position: 'absolute',
    borderRadius: 50,
    padding: 20,
    bottom: 50,
    right: 30,
  }
})

export default App;

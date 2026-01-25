import { ThemedButton, ThemedIcon, ThemedModal, ThemedText } from '@/components/themed';
import { CardColor, Colors } from '@/constants/theme';
import { getAllExercises } from '@/utils/database';
import { SubmitExercise, type Exercise } from '@/utils/databaseTypes';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

type exerciseSelect = {
  modalVisible: boolean,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  addExecise: (newEx: Exercise) => void,
  removeExercise: (exId: number) => void,
  selected: SubmitExercise[]
}

export default function AddExerciseModal({ modalVisible, setModalVisible, addExecise, removeExercise, selected }: exerciseSelect) {
  const db = useSQLiteContext();
  const defaultIconSize = 22;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const theme = useColorScheme() ?? 'light';
  const cardTheme = useMemo(() => theme === "light" ? CardColor.dark : CardColor.light, [theme]);

  const tintColor = theme === 'light' ? Colors.light.tint : Colors.dark.tint;

  const selectedIncludes = (newEx: Exercise) => {
    return selected.find((ex) => ex.exercise.id === newEx.id)
  }

  useFocusEffect(
    useCallback(() => {
      const rows = getAllExercises(db);
      setExercises(rows);

      const currentIds = new Set(rows.map(r => r.id));
      for (const ex of selected) {
        if (!currentIds.has(ex.exercise.id)) {
          removeExercise(ex.exercise.id);
        }
      }
    }, [db])
  );

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectedIncludes(exercise)) {
      removeExercise(exercise.id);
    } else {
      addExecise(exercise);
    }
  }

  return (
    <ThemedModal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.header}>
        <ThemedText type='title'>Select Exercises</ThemedText>
        <Pressable onPress={() => router.push('/createExercise')}>
          <ThemedIcon name='Plus' />
        </Pressable>
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <ThemedIcon name="Dumbbell" size={48} variant="dimmed" />
              <ThemedText type="subtitle">No Exercises</ThemedText>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = !!selectedIncludes(item);
          return (
            <Pressable
              style={[
                styles.exerciseCard,
              ]}
              onPress={() => handleSelectExercise(item)}>
              <View style={styles.selectionIndicator}>
                {isSelected ? (
                  <ThemedIcon name="CheckCircle2" color={tintColor} size={defaultIconSize} />
                ) : (
                  <ThemedIcon variant='dimmed' name="Circle" color={cardTheme.sub} size={defaultIconSize} />
                )}
              </View>

              <View style={styles.cardText}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                {item.description && item.description.length > 0 && (
                  <ThemedText type='subtitle' style={styles.exerciseDesc}>
                    {item.description}
                  </ThemedText>
                )}
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setModalVisible(false);
                  router.push({
                    pathname: '/createExercise',
                    params: {
                      exId: item.id,
                      exName: item.name,
                      exDesc: item.description
                    }
                  })
                }}
                hitSlop={10}
                style={styles.iconButton}>
                <ThemedIcon name='Pencil' size={18} />
              </Pressable>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <ThemedButton
          style={styles.createButton}
          onPress={() => {
            setModalVisible(false);
          }}>
          <Text>Close</Text>
        </ThemedButton>
      </View>
    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 12,
  },
  selectionIndicator: {
    marginRight: 4,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  iconButton: {
    padding: 8,
  },
  exerciseDesc: {
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  }
});
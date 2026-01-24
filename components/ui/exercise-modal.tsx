import { getAllExercises } from '@/utils/database';
import { type Exercise } from '@/utils/databaseTypes';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemedButton, ThemedIcon, ThemedText, ThemedView } from "../themed";

type exerciseSelect = {
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    addExecise: (newEx: Exercise) => void,
    removeExercise: (exId: number) => void,
    selected: Exercise[]
}

export default function AddExerciseModal(
    {modalVisible, setModalVisible, addExecise, removeExercise, selected}: exerciseSelect) {
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const selectedIncludes = (newEx: Exercise) => {
        return selected.find((ex) => ex.exercise_id === newEx.exercise_id)
    }

    const selectedIds = useMemo(() => new Set(selected.map((ex) => ex.exercise_id)), [selected]);

    const syncSelected = (rows: Exercise[]) => {
      for (const ex of selected) {
        if (!rows.find((row) => row.exercise_id === ex.exercise_id)) {
          removeExercise(ex.exercise_id);
        }
      }
    };

    useFocusEffect(
      useCallback(() => {
        const rows = getAllExercises();
        setExercises(rows);
        syncSelected(rows);
      }, [selectedIds, selected, removeExercise])
    );

    const handleSelectExercise = (exercise: Exercise) => {
        if (selectedIncludes(exercise)) {
            removeExercise(exercise.exercise_id);
        } else {
            addExecise(exercise);
        }
        setModalVisible(false);
    }

    return(
        <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
            <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
                <ThemedView style={styles.container}>
                    <View style={styles.header}>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <ThemedIcon name='X'/>
                        </Pressable>
                        <ThemedText type='title'>Select Exercise</ThemedText>
                    </View>
                    
                    <FlatList
                        data={exercises}
                        keyExtractor={(item) => item.exercise_id.toString()}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({item}) => (
                            <Pressable 
                                style={[
                                    styles.exerciseCard,
                                    selectedIncludes(item) && styles.exerciseSelected
                                ]}
                                onPress={() => handleSelectExercise(item)}>
                                <View style={styles.cardText}>
                                    <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
                                    { item.description &&
                                        <ThemedText style={styles.exerciseDesc}>{item.description}</ThemedText>}
                                </View>
                                <Pressable 
                                    onPress={() => router.push({ 
                                        pathname: '/createExercise',
                                        params: {
                                            exId: item.exercise_id,
                                            exName: item.name,
                                            exDesc: item.description
                                        }
                                    })}
                                    style={styles.options}>
                                    <ThemedIcon name='Pencil' />
                                </Pressable>
                            </Pressable>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <ThemedText style={styles.emptyText}>No exercises yet</ThemedText>
                            </View>
                        }
                    />

                    <ThemedButton 
                        style={styles.createButton}
                        onPress={() => {
                            setModalVisible(false);
                            router.push('/createExercise');
                        }}>
                            <ThemedIcon name='Plus' />
                            <Text>Add new Exercise</Text>
                    </ThemedButton>
                </ThemedView>
            </Modal>
        </SafeAreaView>
        </SafeAreaProvider>
    ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centeredView: {
    flex: 1,
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 16,
    gap: 20,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },

  exerciseCard: {
    flexDirection: 'row',
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },

  cardText: {
    flex: 1,
    gap: 4,
  },

  options: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },

  exerciseSelected: {
    borderColor: '#ddd',
  },

  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  exerciseDesc: {
    fontSize: 13,
    opacity: 0.7,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },

  createButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  }
});
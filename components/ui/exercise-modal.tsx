import { getAllExercises } from '@/utils/database';
import { type Exercise } from '@/utils/databaseTypes';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
        for (const ex of selected) if (ex.exercise_id === newEx.exercise_id) return true;
        return false
    }

    useEffect(() => {
        const rows = getAllExercises();
        setExercises(rows);
    }, [modalVisible])

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
                                <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
                                <ThemedText style={styles.exerciseDesc}>{item.description}</ThemedText>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
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
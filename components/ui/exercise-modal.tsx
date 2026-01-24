import { CardColor } from '@/constants/theme';
import { getAllExercises } from '@/utils/database';
import { type Exercise } from '@/utils/databaseTypes';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
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
    const theme = useColorScheme() ?? 'light';
    const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [theme]);

    const selectedIncludes = (newEx: Exercise) => {
        return selected.find((ex) => ex.exercise_id === newEx.exercise_id)
    }

    useFocusEffect(
      useCallback(() => {
        const rows = getAllExercises();
        setExercises(rows);
        
        for (const ex of selected) {
          if (!rows.find((row) => row.exercise_id === ex.exercise_id)) {
            removeExercise(ex.exercise_id);
          }
        }
      }, [])
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
                                    { 
                                        backgroundColor: cardTheme.background, 
                                        borderColor: selectedIncludes(item) ? cardTheme.selected : 'transparent'
                                    }
                                ]}
                                onPress={() => handleSelectExercise(item)}>
                                <View style={styles.cardText}>
                                    <ThemedText type="subtitle">{item.name}</ThemedText>
                                    {item.description && item.description.length > 0 && (
                                        <Text style={[styles.exerciseDesc, { color: cardTheme.sub }]} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    )}
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
                                    style={styles.iconButton}>
                                    <ThemedIcon name='Pencil' size={18} />
                                </Pressable>
                            </Pressable>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <ThemedIcon name="ListChecks" size={26} />
                                <ThemedText type="subtitle">No exercises yet</ThemedText>
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },

  cardText: {
    flex: 1,
    gap: 4,
  },

  iconButton: {
    padding: 6,
    borderRadius: 8,
  },

  exerciseDesc: {
    fontSize: 13,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },

  createButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  }
});
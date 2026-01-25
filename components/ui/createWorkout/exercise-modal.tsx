import { ThemedButton, ThemedIcon, ThemedText, ThemedView } from '@/components/themed';
import { CardColor, Colors } from '@/constants/theme';
import { getAllExercises } from '@/utils/database';
import { SubmitExercise, type Exercise } from '@/utils/databaseTypes';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

type exerciseSelect = {
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    addExecise: (newEx: Exercise) => void,
    removeExercise: (exId: number) => void,
    selected: SubmitExercise[]
}

export default function AddExerciseModal(
    {modalVisible, setModalVisible, addExecise, removeExercise, selected}: exerciseSelect) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const theme = useColorScheme() ?? 'light';
    const cardTheme = useMemo(() => theme === "light" ? CardColor.dark : CardColor.light, [theme]);

    const tintColor = theme === 'light' ? Colors.light.tint : Colors.dark.tint;

    const selectedIncludes = (newEx: Exercise) => {
        return selected.find((ex) => ex.exercise.exercise_id === newEx.exercise_id)
    }

    useFocusEffect(
      useCallback(() => {
        const rows = getAllExercises();
        setExercises(rows);
        
        const currentIds = new Set(rows.map(r => r.exercise_id));
        for (const ex of selected) {
          if (!currentIds.has(ex.exercise.exercise_id)) {
            removeExercise(ex.exercise.exercise_id);
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
    }

    return(
        <Modal
            animationType="slide"
            presentationStyle="pageSheet"
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText type='title'>Select Exercises</ThemedText>
                    <Pressable onPress={() => router.push('/createExercise')} style={styles.closeButton}>
                        <ThemedIcon name='Plus' />
                    </Pressable>
                </View>
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.exercise_id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => {
                        const isSelected = !!selectedIncludes(item);
                        return (
                            <Pressable 
                                style={[
                                    styles.exerciseCard,
                                    {backgroundColor: cardTheme.background}
                                ]}
                                onPress={() => handleSelectExercise(item)}>
                                <View style={styles.selectionIndicator}>
                                    {isSelected ? (
                                        <ThemedIcon name="CheckCircle2" color={tintColor} size={22} />
                                    ) : (
                                        <ThemedIcon name="Circle" color={cardTheme.sub} size={22} />
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
                                                exId: item.exercise_id,
                                                exName: item.name,
                                                exDesc: item.description
                                            }
                                        })
                                    }}
                                    hitSlop={10}
                                    style={styles.iconButton}>
                                    <ThemedIcon name='Pencil' size={18}/>
                                </Pressable>
                            </Pressable>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <ThemedIcon name="Dumbbell" size={48} />
                            <ThemedText type="subtitle">No exercises found</ThemedText>
                            <ThemedText>Create a new one to get started</ThemedText>
                        </View>
                    }
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
            </ThemedView>
        </Modal>
    ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  closeButton: {
    padding: 4,
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

  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 12,
    opacity: 0.8,
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
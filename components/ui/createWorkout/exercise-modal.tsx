import {
  ThemedButton,
  ThemedIcon,
  ThemedInput,
  ThemedModal,
  ThemedText,
} from "@/components/themed";
import { Colors } from "@/constants/theme";
import { deleteExercise, getAllExercises } from "@/utils/database";
import { SubmitExercise, type Exercise } from "@/utils/databaseTypes";
import { useFocusEffect } from "expo-router";
import Fuse from "fuse.js";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import CreateExerciseModal from "./create-exercise-modal";

type exerciseSelect = {
  modalVisible: boolean;
  onClose: () => void;
  addExecise: (newEx: Exercise) => void;
  removeExercise: (exID: number) => void;
  selected: SubmitExercise[];
};

export default function AddExerciseModal({
  modalVisible,
  onClose,
  addExecise,
  removeExercise,
  selected,
}: exerciseSelect) {
  const defaultIconSize = 22;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [fuzzyExercises, setFuzzyExercises] = useState<Exercise[]>([]);
  const fuse = useMemo(
    () =>
      new Fuse(exercises, {
        keys: ["name", "description"],
        threshold: 0.6,
      }),
    [exercises],
  );

  const theme = useColorScheme() ?? "light";
  const tintColor = theme === "light" ? Colors.light.tint : Colors.dark.tint;

  const selectedIncludes = (newEx: Exercise) => {
    return selected.find((ex) => ex.exercise.id === newEx.id);
  };

  useFocusEffect(
    useCallback(() => {
      const rows = getAllExercises();
      setExercises(rows);

      const currentIDs = new Set(rows.map((r) => r.id));
      for (const ex of selected) {
        if (!currentIDs.has(ex.exercise.id)) {
          removeExercise(ex.exercise.id);
        }
      }
    }, []),
  );

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectedIncludes(exercise)) {
      removeExercise(exercise.id);
    } else {
      addExecise(exercise);
    }
  };

  const handleDeleteExercise = (id: number) => {
    deleteExercise(id);
    const updatedExercises = getAllExercises();
    setExercises(updatedExercises);

    if (fuzzyExercises.length > 0) {
      setFuzzyExercises((prev) => prev.filter((e) => e.id !== id));
    }

    removeExercise(id);
  };

  const handleExerciseChange = (newExerciseId: number | undefined | null) => {
    const rows = getAllExercises();
    setExercises(rows);

    if (newExerciseId) {
      const newEx = rows.find((ex) => ex.id === newExerciseId);
      if (newEx) {
        addExecise(newEx);
      }
    }
  };

  return (
    <ThemedModal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <CreateExerciseModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        initialExercise={editingExercise}
        onExerciseChange={handleExerciseChange}
      />
      <View style={styles.header}>
        <ThemedText type="title">Select Exercises</ThemedText>
        <Pressable onPress={onClose}>
          <ThemedIcon name="Check" />
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <ThemedIcon name="Search" size={20} variant="dimmed" />
        <ThemedInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          onChangeText={(text) => {
            const results = fuse.search(text);
            setFuzzyExercises(results.map((r) => r.item));
          }}
        />
      </View>
      <FlatList
        data={fuzzyExercises.length > 0 ? fuzzyExercises : exercises}
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
              style={[styles.exerciseCard]}
              onPress={() => handleSelectExercise(item)}
            >
              <View style={styles.selectionIndicator}>
                {isSelected ? (
                  <ThemedIcon
                    name="CheckCircle2"
                    color={tintColor}
                    size={defaultIconSize}
                  />
                ) : (
                  <ThemedIcon
                    variant="dimmed"
                    name="Circle"
                    color={tintColor}
                    size={defaultIconSize}
                  />
                )}
              </View>

              <View style={styles.cardText}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                {item.description && item.description.length > 0 && (
                  <ThemedText type="subtitle" style={styles.exerciseDesc}>
                    {item.description}
                  </ThemedText>
                )}
              </View>
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Delete Exercise",
                    `Are you sure you want to delete ${item.name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          handleDeleteExercise(item.id);
                        },
                      },
                    ],
                  );
                }}
                hitSlop={10}
                style={styles.iconButton}
              >
                <ThemedIcon name="Trash2" size={18} />
              </Pressable>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <ThemedButton
          style={styles.createButton}
          onPress={() => {
            setEditingExercise(null);
            setCreateModalVisible(true);
          }}
        >
          <ThemedIcon name="Plus" />
          <Text>Add Exercise</Text>
        </ThemedButton>
      </View>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
  },
  emptyCard: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
});

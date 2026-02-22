import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import DragableItem from "@/components/ui/createWorkout/dragableItem";
import AddExerciseModal from "@/components/ui/createWorkout/exercise-modal";
import WorkoutHeader from "@/components/ui/createWorkout/header";
import { useCardTheme } from "@/hooks/use-card-theeme";
import {
  createWorkout,
  getExercisesFromWorkout,
  getOneWorkout,
  updateWorkout,
} from "@/utils/database";
import { Exercise, SubmitExercise } from "@/utils/databaseTypes";
import { router, useLocalSearchParams } from "expo-router";
import { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
} from "react-native-reorderable-list";
import { SafeAreaView } from "react-native-safe-area-context";

interface Header {
  emoji: string;
  name: string;
  rest: number;
}

interface HeaderAction {
  type: "setEmoji" | "setName" | "setRest";
  value: string | number;
}

function headerDispacher(state: Header, action: HeaderAction) {
  const { type, value } = action;

  switch (type) {
    case "setEmoji":
      return { ...state, emoji: value as string };
    case "setName":
      return { ...state, name: value as string };
    case "setRest":
      return { ...state, rest: value as number };
    default:
      return state;
  }
}

const CreateWorkout = () => {
  const { t } = useTranslation();
  const cardTheme = useCardTheme();
  const { wID } = useLocalSearchParams();
  const defaultDuration = 30;
  const isEdit = !!wID;

  const [header, headerDispatch] = useReducer(
    headerDispacher,
    {
      emoji: "️💪",
      name: "",
      rest: 5,
    },
    (state: Header) => {
      if (isEdit) {
        const workout = getOneWorkout(Number(wID));
        if (workout) {
          return {
            emoji: workout.emoji,
            name: workout.name,
            rest: workout.rest,
          };
        }
        return state;
      }
      return state;
    },
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<SubmitExercise[]>(() => {
    if (wID) {
      const loadedExercises = getExercisesFromWorkout(parseInt(wID.toString()));
      const sortedExercises = [...loadedExercises].sort(
        (a, b) => a.order - b.order,
      );
      return sortedExercises;
    }
    return [];
  });

  const handleHeaderChange = (name: string, emoji: string, rest: number) => {
    if (name !== header.name) headerDispatch({ type: "setName", value: name });
    if (emoji !== header.emoji)
      headerDispatch({ type: "setEmoji", value: emoji });
    if (rest !== header.rest) headerDispatch({ type: "setRest", value: rest });
  };

  const addExercise = (newEx: Exercise, duration = defaultDuration) => {
    for (const ex of exercises) if (ex.exercise.id === newEx.id) return;
    const submitEx: SubmitExercise = {
      exercise: newEx,
      order: exercises.length + 1,
      duration: duration,
    };
    setExercises([...exercises, submitEx]);
  };

  const deleteExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.exercise.id !== id));
  };

  const handleCreateWorkout = () => {
    if (!header.name.trim()) return;
    createWorkout(header.emoji, header.name, Number(header.rest), exercises);
    router.push("/");
  };

  const handleUpdateWorkout = () => {
    if (!header.name.trim()) return;
    updateWorkout(
      Number(wID),
      header.emoji,
      header.name,
      Number(header.rest),
      exercises,
    );
    router.back();
  };

  const updateExerciseDuration = (exercise: SubmitExercise, time: number) => {
    setExercises(
      exercises.map((ex) => {
        if (ex === exercise) {
          return { ...ex, duration: time > 0 ? time : 1 };
        }
        return ex;
      }),
    );
  };

  const updateExerciseInList = (updatedEx: Exercise) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exercise.id === updatedEx.id) {
          return { ...ex, exercise: updatedEx };
        }
        return ex;
      }),
    );
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setExercises((value) => reorderItems(value, from, to));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AddExerciseModal
          modalVisible={modalVisible}
          addExecise={addExercise}
          deleteSelectedExercise={deleteExercise}
          onClose={() => setModalVisible(false)}
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
                name={header.name}
                emoji={header.emoji}
                rest={header.rest}
                onchange={handleHeaderChange}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyCard}>
                  <ThemedIcon name="ListPlus" size={48} variant="dimmed" />
                  <ThemedText type="subtitle">
                    {t("exercise.noExercises")}
                  </ThemedText>
                </View>
              </View>
            }
            ListFooterComponent={
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.addExerciseButton}
              >
                <ThemedIcon name="Plus" />
                <ThemedText type="defaultSemiBold">
                  {t("exercise.addExercise")}
                </ThemedText>
              </Pressable>
            }
            renderItem={({ item }: ListRenderItemInfo<SubmitExercise>) => (
              <DragableItem
                item={item}
                cardTheme={cardTheme}
                defaultDuration={item.duration}
                updateExerciseDuration={updateExerciseDuration}
                deleteExercise={deleteExercise}
                onExerciseUpdate={updateExerciseInList}
              />
            )}
          />
        </View>
        <View style={styles.footer}>
          {isEdit ? (
            <ThemedButton
              onPress={() => handleUpdateWorkout()}
              style={[
                styles.saveButton,
                (!header.name.trim() || exercises.length === 0) && {
                  opacity: 0.5,
                },
              ]}
              disabled={!header.name.trim() || exercises.length === 0}
            >
              <ThemedIcon name="Save" size={20} />
              <Text style={styles.saveButtonText}>
                {t("workout.updateWorkout")}
              </Text>
            </ThemedButton>
          ) : (
            <ThemedButton
              onPress={() => handleCreateWorkout()}
              style={[
                styles.saveButton,
                (!header.name.trim() || exercises.length === 0) && {
                  opacity: 0.5,
                },
              ]}
              disabled={!header.name.trim() || exercises.length === 0}
            >
              <ThemedIcon name="Check" size={20} />
              <Text style={styles.saveButtonText}>
                {t("workout.saveWorkout")}
              </Text>
            </ThemedButton>
          )}
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
    alignItems: "center",
  },
  emptyCard: {
    width: "100%",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  emptySubtext: {
    textAlign: "center",
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  footer: {
    padding: 16,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
  },
});

export default CreateWorkout;

import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { useCardTheme } from "@/hooks/use-card-theeme";
import {
  deleteWorkout,
  getExercisesFromWorkout,
  getOneWorkout,
} from "@/utils/database";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const { t } = useTranslation();
  const { workoutID } = useLocalSearchParams();
  const cardTheme = useCardTheme();

  const [workout, setWorkout] = useState(getOneWorkout(Number(workoutID)));
  const [exercises, setExercises] = useState(
    getExercisesFromWorkout(Number(workoutID)),
  );

  useFocusEffect(
    useCallback(() => {
      const updatedWorkout = getOneWorkout(Number(workoutID));
      const updatedExercises = getExercisesFromWorkout(Number(workoutID));
      setWorkout(updatedWorkout);
      setExercises(updatedExercises);
    }, [workoutID]),
  );

  if (!workout) return null;

  let totalTime = 0;
  if (exercises.length > 0) {
    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
    totalTime = totalDuration + (exercises.length - 1) * workout.rest;
  }

  const totalTimeLabel = t("workout.totalTime", {
    minutes: Math.floor(totalTime / 60),
    seconds: (totalTime % 60).toString().padStart(2, "0"),
  });

  const handleDelete = () => {
    Alert.alert(
      t("workout.deleteWorkoutTitle"),
      t("workout.deleteWorkoutConfirm", { name: workout?.name ?? "" }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            deleteWorkout(Number(workoutID));
            router.push("/");
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: "/workout/createWorkout",
      params: {
        wID: workoutID,
        wEmoji: workout.emoji,
        wName: workout.name,
        wRest: workout.rest,
      },
    });
  };

  const handleStart = () => {
    router.push({
      pathname: "/workout/workout",
      params: {
        wID: workoutID,
        wRest: workout.rest,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleEdit} style={styles.iconButton}>
            <ThemedIcon name="Pencil" size={20} />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.iconButton}>
            <ThemedIcon name="Trash2" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.workoutCard,
            {
              backgroundColor: cardTheme.background,
              borderColor: cardTheme.border,
            },
          ]}
        >
          <View style={styles.workoutHeader}>
            <Text style={styles.emoji}>{workout.emoji}</Text>
            <View style={styles.workoutInfo}>
              <ThemedText type="subtitle">{workout.name}</ThemedText>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <ThemedIcon name="Timer" size={16} variant="dimmed" />
                  <ThemedText type="dimmed" style={styles.statText}>
                    {totalTimeLabel}
                  </ThemedText>
                </View>
                <View style={styles.stat}>
                  <ThemedIcon name="Dumbbell" size={16} variant="dimmed" />
                  <ThemedText type="dimmed" style={styles.statText}>
                    {t("workout.exerciseCount", {
                      count: exercises.length,
                    })}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[styles.restInfo, { backgroundColor: cardTheme.border }]}
          >
            <ThemedIcon name="Clock" size={16} variant="dimmed" />
            <ThemedText type="dimmed" style={styles.restText}>
              {t("workout.restBetween", { seconds: workout.rest })}
            </ThemedText>
          </View>
        </View>
        <View style={styles.section}>
          {exercises.map((exercise) => (
            <View
              key={exercise.exercise.id}
              style={[
                styles.exerciseCard,
                {
                  backgroundColor: cardTheme.background,
                  borderColor: cardTheme.border,
                },
              ]}
            >
              <View style={styles.exerciseInfo}>
                <ThemedText type="defaultSemiBold">
                  {exercise.exercise.name}
                </ThemedText>
                <View style={styles.exerciseMeta}>
                  <ThemedIcon name="Timer" size={14} variant="dimmed" />
                  <ThemedText type="dimmed" style={styles.durationText}>
                    {`${exercise.duration}s`}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ThemedButton
          disabled={exercises.length === 0}
          onPress={handleStart}
          style={[
            styles.startButton,
            exercises.length === 0 && styles.controlButtonDisabled,
          ]}
        >
          <ThemedIcon name="Play" size={24} />
          <Text>{t("workout.startWorkout")}</Text>
        </ThemedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
  workoutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
  },
  workoutInfo: {
    flex: 1,
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  controlButtonDisabled: {
    opacity: 0.3,
  },
  statText: {
    fontSize: 13,
  },
  restInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  restText: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
    gap: 4,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 13,
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 18,
    borderRadius: 16,
  },
});

export default App;

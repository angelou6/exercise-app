import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { CardColor } from "@/constants/theme";
import { getExercisesFromWorkout, getOneWorkout } from "@/utils/database";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const db = useSQLiteContext();
  const { wId } = useLocalSearchParams();

  const theme = useColorScheme() ?? "light";
  const cardTheme = useMemo(
    () => (theme === "light" ? CardColor.light : CardColor.dark),
    [theme],
  );

  const workout = wId ? getOneWorkout(db, wId.toString()) : undefined;
  const exercises = wId
    ? getExercisesFromWorkout(db, parseInt(wId.toString()))
    : [];

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalTime = workout
    ? totalDuration + (exercises.length - 1) * workout.rest
    : totalDuration;

  const handleGoHome = () => {
    router.replace("/");
  };

  const handleRestart = () => {
    if (!workout) return handleGoHome();
    router.replace({
      pathname: "/wourkout/workout",
      params: {
        wId: workout.id.toString(),
        wRest: workout.rest.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoHome}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.emojiRow}>
          {workout?.emoji && (
            <ThemedText style={styles.emoji}>{workout.emoji}</ThemedText>
          )}
        </View>
        <ThemedText style={styles.title} type="title">
          Workout Complete!
        </ThemedText>
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: cardTheme.background,
              borderColor: cardTheme.border,
            },
          ]}
        >
          <View style={styles.summaryRow}>
            <ThemedIcon name="ListOrdered" size={20} />
            <ThemedText>{exercises.length} exercises</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedIcon name="Timer" size={20} />
            <ThemedText>
              {Math.floor(totalTime / 60)}:
              {(totalTime % 60).toString().padStart(2, "0")} total
            </ThemedText>
          </View>
        </View>
        <View style={styles.actions}>
          <ThemedButton onPress={handleRestart}>
            <ThemedIcon name="RotateCcw" size={20} />
            <Text>Restart</Text>
          </ThemedButton>

          <ThemedButton onPress={handleGoHome}>
            <ThemedIcon name="Home" size={20} />
            <Text>Back to Home</Text>
          </ThemedButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
  },
  emojiRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    height: 80,
    textAlignVertical: "center",
    fontSize: 64,
  },
  title: {
    textAlign: "center",
  },
  summaryCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
});

export default App;

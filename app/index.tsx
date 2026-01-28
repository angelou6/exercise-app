import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { Colors } from "@/constants/theme";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getAllWourkouts } from "@/utils/database";
import { type Workout } from "@/utils/databaseTypes";
import { getTodayString, getYesterdayString } from "@/utils/streakUtils";
import { router, useFocusEffect } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import { Storage } from "expo-sqlite/kv-store";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const db = openDatabaseSync("exercise.db", { useNewConnection: true });
  const theme = useColorScheme() ?? "light";

  const cardTheme = useCardTheme();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [useStreak, setUseStreak] = useState(false);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const activeStreak = Storage.getItemSync("useStreak") === "true";
      setUseStreak(activeStreak);

      if (activeStreak) {
        const streakNum = Number(Storage.getItemSync("streak")) || 0;
        const lastDayExercised = Storage.getItemSync("lastDayExercised");

        if (!lastDayExercised) {
          setStreak(0);
          if (streakNum > 0) Storage.setItemSync("streak", "0");
          return;
        }

        const todayStr = getTodayString();
        const yesterdayStr = getYesterdayString();

        if (
          lastDayExercised === todayStr ||
          lastDayExercised === yesterdayStr
        ) {
          setStreak(streakNum);
        } else {
          setStreak(0);
          Storage.setItemSync("streak", "0");
        }
      }
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      try {
        setWorkouts(getAllWourkouts(db));
      } catch {
        setWorkouts([]);
      }
    }, [db]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Exercise App</ThemedText>
        <View style={styles.rightSide}>
          {useStreak && (
            <View style={styles.streakContainer}>
              <ThemedIcon
                name="Flame"
                color={
                  streak > 0
                    ? "red"
                    : theme === "light"
                      ? Colors.light.icon
                      : Colors.dark.icon
                }
                size={24}
              />
              <ThemedText>{streak}</ThemedText>
            </View>
          )}
          <Pressable onPress={() => router.push("/settings")}>
            <ThemedIcon name="Settings" size={24} />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {workouts.length > 0 ? (
            workouts.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/wourkout/startWorkout",
                    params: {
                      workoutID: item.id,
                    },
                  })
                }
              >
                <View
                  style={[
                    styles.workoutCard,
                    {
                      backgroundColor: cardTheme.background,
                      borderColor: cardTheme.border,
                    },
                  ]}
                >
                  <View style={styles.workoutContent}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <View style={styles.workoutInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.workoutName}
                      >
                        {item.name}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCard}>
                <ThemedIcon name="Dumbbell" size={48} variant="dimmed" />
                <ThemedText type="subtitle">No Workouts</ThemedText>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ThemedButton
          onPress={() => router.push("/wourkout/createWorkout")}
          style={styles.addButton}
        >
          <ThemedIcon name="Plus" size={24} />
          <Text>Create Workout</Text>
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
  rightSide: {
    flexDirection: "row",
    gap: 20,
  },
  streakContainer: {
    flexDirection: "row",
    gap: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  workoutContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  emoji: {
    fontSize: 36,
  },
  workoutInfo: {
    flex: 1,
    gap: 8,
  },
  workoutName: {
    fontSize: 16,
  },
  emptyContainer: {
    marginTop: 40,
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
  restText: {
    fontSize: 13,
  },
  footer: {
    padding: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 18,
    borderRadius: 16,
  },
});

export default App;

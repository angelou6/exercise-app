import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { getAllWourkouts } from "@/utils/database";
import { type Workout } from "@/utils/databaseTypes";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const db = useSQLiteContext();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const cardTheme = useCardTheme();

  useFocusEffect(
    useCallback(() => {
      setWorkouts(getAllWourkouts(db));
    }, [db]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Exercise App</ThemedText>
        <Pressable onPress={() => router.push("/settings")}>
          <ThemedIcon name="Settings" size={24} />
        </Pressable>
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
                      workoutId: item.id,
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
    borderWidth: 1,
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

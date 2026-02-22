import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { Colors } from "@/constants/theme";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getAllWorkouts } from "@/utils/database";
import { getTodayString, getYesterdayString } from "@/utils/streakUtils";
import { router, useFocusEffect } from "expo-router";
import { Storage } from "expo-sqlite/kv-store";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Streak {
  active: boolean;
  value: number;
}

function initStreak(): Streak {
  let streakValue: number = 0;
  const activeStreak = Storage.getItemSync("useStreak") === "true";
  if (activeStreak) {
    const streakNum = Number(Storage.getItemSync("streak")) || 0;
    const lastDayExercised = Storage.getItemSync("lastDayExercised");
    if (!lastDayExercised) {
      if (streakNum > 0) Storage.setItemSync("streak", "0");
      streakValue = 0;
    } else {
      const todayStr = getTodayString();
      const yesterdayStr = getYesterdayString();
      if (lastDayExercised === todayStr || lastDayExercised === yesterdayStr) {
        streakValue = streakNum;
      } else {
        streakValue = 0;
        Storage.setItemSync("streak", "0");
      }
    }
  }
  return { active: activeStreak, value: streakValue };
}

const App = () => {
  const { t } = useTranslation();
  const theme = useColorScheme() ?? "light";

  const cardTheme = useCardTheme();

  const workouts = getAllWorkouts();
  const [streak, setStreak] = useState(initStreak);

  useFocusEffect(
    useCallback(() => {
      setStreak(initStreak);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {streak.active && (
          <View style={styles.streakContainer}>
            <ThemedIcon
              name="Flame"
              color={
                streak.value > 0
                  ? "red"
                  : theme === "light"
                    ? Colors.light.icon
                    : Colors.dark.icon
              }
              size={24}
            />
            <ThemedText type="defaultSemiBold">{streak.value}</ThemedText>
          </View>
        )}
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
                    pathname: "/workout/startWorkout",
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
                <ThemedText type="subtitle">{t("home.noWorkouts")}</ThemedText>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ThemedButton
          onPress={() => router.push("/workout/createWorkout")}
          style={styles.addButton}
        >
          <ThemedIcon name="Plus" size={24} />
          <Text>{t("home.createWorkout")}</Text>
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 14,
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

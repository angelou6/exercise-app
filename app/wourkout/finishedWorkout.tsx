import { ThemedButton, ThemedIcon, ThemedText } from "@/components/themed";
import { getOneWorkout } from "@/utils/database";
import { getTodayString, getYesterdayString } from "@/utils/streakUtils";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Storage } from "expo-sqlite/kv-store";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const partyPopperSource = require("../../assets/audio/partypopper.mp3");

const App = () => {
  const db = useSQLiteContext();
  const { wID } = useLocalSearchParams();
  const partyPopperAudio = useAudioPlayer(partyPopperSource);

  const workout = useMemo(() => getOneWorkout(db, String(wID)), [db, wID]);

  const handleGoHome = () => {
    router.replace("/");
  };

  const handleRestart = () => {
    if (!workout) return handleGoHome();
    router.replace({
      pathname: "/wourkout/workout",
      params: {
        wID: workout.id.toString(),
        wRest: workout.rest.toString(),
      },
    });
  };

  useEffect(() => {
    partyPopperAudio.play();
    const activeStreak = Storage.getItemSync("useStreak");
    if (!activeStreak) return;

    const todayStr = getTodayString();
    const lastDayExercised = Storage.getItemSync("lastDayExercised");

    if (lastDayExercised === todayStr) return;

    const yesterdayStr = getYesterdayString();
    const currentStreak = Number(Storage.getItemSync("streak")) || 0;

    if (lastDayExercised === yesterdayStr) {
      Storage.setItemSync("streak", String(currentStreak + 1));
    } else {
      Storage.setItemSync("streak", "1");
    }

    Storage.setItemSync("lastDayExercised", todayStr);
  }, []);

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
  actions: {
    width: "100%",
    gap: 12,
  },
});

export default App;

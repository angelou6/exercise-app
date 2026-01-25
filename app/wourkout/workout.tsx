import { ThemedIcon, ThemedText } from "@/components/themed"
import CountdownModal from "@/components/ui/workout/countdown-modal"
import ProgressBar from "@/components/ui/workout/progressBar"
import { CardColor } from "@/constants/theme"
import { getExercisesFromWorkout } from "@/utils/database"
import { router, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useMemo, useState } from "react"
import { Pressable, StyleSheet, View, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const App = () => {
  const db = useSQLiteContext();

  const { wId, wRest } = useLocalSearchParams();
  const theme = useColorScheme() ?? 'light';
  const cardTheme = useMemo(() => theme === "light" ? CardColor.light : CardColor.dark, [theme]);

  if (!wId || !wRest) return null;
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const exercises = getExercisesFromWorkout(db, parseInt(wId.toString()));
  const restDuration = parseInt(wRest.toString());

  const name = exercises[exerciseIndex].exercise.name || "";
  const description = exercises[exerciseIndex].exercise.description || "";
  const duration = exercises[exerciseIndex].duration || 0;

  const [SCDuration, setSCDuration] = useState(duration * 1000)

  const [isExercise, setIsExercise] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  const [inCountdown, setInCountdown] = useState(true);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (!isPlaying) {
      clearInterval(interval);
    } else if (timeLeft <= 0) {
      clearInterval(interval);
      if (isExercise) {
        handleExerciseFinished();
      } else {
        handleRestFinished();
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isExercise]);

  const handleExerciseFinished = () => {
    if (exerciseIndex + 1 < exercises.length) {
      setIsExercise(false);
      setTimeLeft(restDuration);
      setSCDuration(restDuration * 1000);
    } else {
      router.replace({
        pathname: '/wourkout/finishedWorkout',
        params: { wId }
      });
    }
  }

  const changeExercise = (direction: "prev" | "next") => {
    const nextIndex = exerciseIndex + (direction === "next" ? 1 : -1);
    setExerciseIndex(nextIndex);
    setTimeLeft(exercises[nextIndex].duration);
    setSCDuration(exercises[nextIndex].duration * 1000);
    setIsExercise(true);
  }

  const handleRestFinished = () => {
    changeExercise("next");
  }

  const handlePrevious = () => {
    if (exerciseIndex > 0) {
      setIsPlaying(false);
      changeExercise("prev");
    }
  }

  const handleNext = () => {
    if (exerciseIndex + 1 < exercises.length) {
      setIsPlaying(false);
      changeExercise("next");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CountdownModal
        visible={inCountdown}
        setVisible={setInCountdown}
        duration={5}
        onClose={() => {
          setInCountdown(false);
          setIsPlaying(true);
        }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View>
          {isExercise ?
            <View style={styles.exerciseContainer}>
              <ThemedText type="title">{name}</ThemedText>
              {description ? (
                <ThemedText type="dimmed">{description}</ThemedText>
              ) : null}
            </View>
            :
            <ThemedText type="title" >Rest Time</ThemedText>
          }
        </View>

        <View style={styles.timerContainer}>
          <ThemedText style={styles.timerText}>{timeLeft}</ThemedText>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            duration={SCDuration}
            isPlaying={isPlaying}
            resetKey={`${exerciseIndex}${isExercise}`}
          />
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={handlePrevious}
            style={[styles.controlButton, exerciseIndex === 0 && styles.controlButtonDisabled]}
            disabled={exerciseIndex === 0}
          >
            <ThemedIcon name="SkipBack" size={32} />
          </Pressable>

          <Pressable onPress={() => setIsPlaying(!isPlaying)} style={styles.playButton}>
            <View style={[styles.playButtonInner, { backgroundColor: cardTheme.background }]}>
              <ThemedIcon name={isPlaying ? "Pause" : "Play"} size={40} />
            </View>
          </Pressable>

          <Pressable
            onPress={handleNext}
            style={[styles.controlButton, exerciseIndex >= exercises.length - 1 && styles.controlButtonDisabled]}
            disabled={exerciseIndex >= exercises.length - 1}
          >
            <ThemedIcon name="SkipForward" size={32} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exerciseContainer: {
    alignItems: 'center',
    gap: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timerText: {
    fontSize: 120,
    fontWeight: 'bold',
    lineHeight: 120,
  },
  progressContainer: {
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  },
  controlButton: {
    padding: 12,
  },
  controlButtonDisabled: {
    opacity: 0.3,
  },
  playButton: {
    padding: 8,
  },
  playButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default App
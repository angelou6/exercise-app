import { ThemedIcon, ThemedText } from "@/components/themed";
import CountdownModal from "@/components/ui/workout/countdown-modal";
import ProgressBar from "@/components/ui/workout/progressBar";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { getExercisesFromWorkout } from "@/utils/database";
import { useAudioPlayer } from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dingAudioSource = require("../../assets/audio/ding.mp3");
const clickAudioSource = require("../../assets/audio/click.mp3");

interface ExerciseState {
  index: number;
  name: string;
  description: string;
  duration: number;
}

interface Action {
  type: "next" | "previous" | "init";
}

const Workout = () => {
  useKeepAwake();
  const { t } = useTranslation();
  const cardTheme = useCardTheme();
  const { wID, wRest } = useLocalSearchParams();
  const dingAudio = useAudioPlayer(dingAudioSource);
  const clickAudio = useAudioPlayer(clickAudioSource);

  const [inCountdown, setInCountdown] = useState(true);
  const exercises = getExercisesFromWorkout(Number(wID));

  const getExercise = (
    state: ExerciseState,
    direction: "next" | "prev" | "init" = "init",
  ) => {
    let dir: number;

    switch (direction) {
      case "next":
        dir = 1;
        break;

      case "prev":
        dir = -1;
        break;

      default:
        dir = 0;
        break;
    }

    let newExercise = exercises[state.index + dir];

    return {
      index: state.index + dir,
      name: newExercise.exercise.name,
      description: newExercise.exercise.description,
      duration: newExercise.duration,
    };
  };

  const dispatch = (state: ExerciseState, action: Action) => {
    const { type } = action;
    let exercise: ExerciseState;

    switch (type) {
      case "next":
        exercise = getExercise(state, "next");
        break;

      case "previous":
        exercise = getExercise(state, "prev");
        break;

      default:
        exercise = getExercise(state);
        break;
    }

    return exercise;
  };

  const [exercise, exerciseDispatch] = useReducer(
    dispatch,
    {
      index: 0,
      name: "",
      description: "",
      duration: 0,
    },
    getExercise,
  );

  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isExercise, setIsExercise] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const restDuration = Number(wRest);

  const handleExerciseFinished = () => {
    if (exercise.index + 1 < exercises.length) {
      setIsExercise(false);
      setTimeLeft(restDuration);
      dingAudio.seekTo(0);
      dingAudio.play();
    } else {
      router.replace({
        pathname: "/workout/finishedWorkout",
        params: { wID },
      });
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else if (isExercise) {
      setInCountdown(true);
    } else {
      setIsPlaying(true);
    }
  };

  const changeExercise = (direction: "previous" | "next") => {
    const newIndex = exercise.index + (direction === "next" ? 1 : -1);
    exerciseDispatch({ type: direction });
    setTimeLeft(exercises[newIndex].duration);
    setIsExercise(true);
  };

  const handleRestFinished = () => {
    changeExercise("next");
    dingAudio.seekTo(0);
    dingAudio.play();
  };

  const handlePrevious = () => {
    if (exercise.index > 0) {
      setIsPlaying(false);
      changeExercise("previous");
    }
  };

  const handleNext = () => {
    if (exercise.index + 1 < exercises.length) {
      const wasRest = !isExercise;
      setIsPlaying(false);
      changeExercise("next");
      if (wasRest) {
        setInCountdown(true);
      }
    }
  };

  const handleFinished = () => {
    if (isExercise) {
      handleExerciseFinished();
    } else {
      handleRestFinished();
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((time) => time - 1);
      if (timeLeft <= 1) {
        handleFinished();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isExercise]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timeLeft <= 5 && timeLeft > 0) {
      clickAudio.seekTo(0);
      clickAudio.play();
    }
  }, [timeLeft, isPlaying]);

  return (
    <SafeAreaView style={styles.container}>
      <CountdownModal
        visible={inCountdown}
        setVisible={setInCountdown}
        initialDuration={5}
        onClose={useCallback(() => {
          setInCountdown(false);
          setIsPlaying(true);
        }, [])}
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedIcon name="ArrowLeft" size={24} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View>
          {isExercise ? (
            <View style={styles.exerciseContainer}>
              <ThemedText style={styles.titleText} type="title">
                {exercise.name}
              </ThemedText>
              {exercise.description ? (
                <ThemedText type="dimmed">{exercise.description}</ThemedText>
              ) : null}
            </View>
          ) : (
            <View style={styles.exerciseContainer}>
              <ThemedText type="title">{t("workout.restTime")}</ThemedText>
              <ThemedText type="dimmed">
                {exercise.index + 1 < exercises.length
                  ? t("workout.upNext", {
                      name: exercises[exercise.index + 1].exercise.name,
                    })
                  : ""}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.timerContainer}>
          <ThemedText style={styles.timerText}>{timeLeft}</ThemedText>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            duration={(isExercise ? exercise.duration : restDuration) * 1000}
            isPlaying={isPlaying}
            resetKey={`${exercise.index}${isExercise}`}
          />
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={handlePrevious}
            style={[
              styles.controlButton,
              exercise.index === 0 && styles.controlButtonDisabled,
            ]}
            disabled={exercise.index === 0}
          >
            <ThemedIcon name="SkipBack" size={32} />
          </Pressable>

          <Pressable onPress={handlePause} style={styles.playButton}>
            <View
              style={[
                styles.playButtonInner,
                { backgroundColor: cardTheme.background },
              ]}
            >
              <ThemedIcon name={isPlaying ? "Pause" : "Play"} size={40} />
            </View>
          </Pressable>

          <Pressable
            onPress={handleNext}
            style={[
              styles.controlButton,
              exercise.index >= exercises.length - 1 &&
                styles.controlButtonDisabled,
            ]}
            disabled={exercise.index >= exercises.length - 1}
          >
            <ThemedIcon name="SkipForward" size={32} />
          </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exerciseContainer: {
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  timerContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timerText: {
    fontSize: 120,
    fontWeight: "bold",
    lineHeight: 120,
  },
  progressContainer: {
    width: "100%",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2 4 0 rgba(0, 0, 0, 0.25)",
  },
});

export default Workout;

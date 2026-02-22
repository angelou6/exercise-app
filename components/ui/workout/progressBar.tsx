import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ProgressBar = {
  duration: number;
  isPlaying: boolean;
  resetKey: string | number;
};

export default function ShrinkingProgressBar({
  duration,
  isPlaying,
  resetKey,
}: ProgressBar) {
  const progress = useSharedValue(1);

  useAnimatedReaction(
    () => {
      return { duration, isPlaying, resetKey };
    },
    (next, prev) => {
      if (next.resetKey !== prev?.resetKey) {
        progress.set(1);
      }

      if (!next.isPlaying) {
        cancelAnimation(progress);
      } else {
        progress.set(withTiming(0, { duration: next.duration }));
      }
    },
    [duration, isPlaying, resetKey],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.get() * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#ff5252",
  },
});

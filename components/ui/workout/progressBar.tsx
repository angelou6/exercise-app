import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ProgressBar = {
  duration: number,
  isPlaying: boolean,
  resetKey: string | number,
}

export default function ShrinkingProgressBar({ duration, isPlaying, resetKey }: ProgressBar) {
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = 1;
  }, [resetKey])

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimation(progress);
    } else {
      progress.value = withTiming(0, {
        duration: duration,
      });
    }
  }, [duration, isPlaying, resetKey, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
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
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#ff5252',
  },
});

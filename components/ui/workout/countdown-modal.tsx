import { ThemedModal } from "@/components/themed/themed-modal";
import playaudio from "@/utils/playaudio";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CountdownModalProps = {
  visible: boolean;
  initialDuration: number;
  onclose: () => void;
};

const clickAudioSource = require("@/assets/audio/click.mp3");
const dingAudioSource = require("@/assets/audio/ding.mp3");

export default function CountdownModal({
  visible,
  initialDuration,
  onclose,
}: CountdownModalProps) {
  const clickAudio = useAudioPlayer(clickAudioSource);
  const dingAudio = useAudioPlayer(dingAudioSource);
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    if (visible) {
      setTimeLeft(initialDuration);
    }
  }, [visible]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    if (timeLeft <= 5 && timeLeft > 0) {
      playaudio(clickAudio);
    }

    if (timeLeft <= 0) {
      clearInterval(timeout);
      playaudio(dingAudio);
      onclose();
    }
  }, [timeLeft]);

  return (
    <ThemedModal
      transparent
      animationType="fade"
      visible={visible}
      presentationStyle="overFullScreen"
      style={styles.overlay}
      onRequestClose={() => {
        router.back();
      }}
    >
      <View style={styles.topContainer}>
        <View style={styles.row}>
          <Text style={styles.bigText}>{timeLeft}</Text>
        </View>
      </View>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bigText: {
    color: "white",
    fontWeight: "bold",
    lineHeight: 96,
    fontSize: 96,
  },
});

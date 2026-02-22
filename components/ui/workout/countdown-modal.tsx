import { ThemedModal } from "@/components/themed/themed-modal";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CountdownModalProps = {
  visible: boolean;
  initialDuration: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const clickAudioSource = require("../../../assets/audio/click.mp3");
const dingAudioSource = require("../../../assets/audio/ding.mp3");

export default function CountdownModal({
  visible,
  initialDuration,
  onClose,
}: CountdownModalProps) {
  const clickAudio = useAudioPlayer(clickAudioSource);
  const dingAudio = useAudioPlayer(dingAudioSource);
  let [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    if (timeLeft <= 0) {
      dingAudio.seekTo(0);
      dingAudio.play();
      onClose();
      return;
    }

    let timeout = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timeLeft, visible, dingAudio, onClose]);

  useEffect(() => {
    if (visible && timeLeft <= 5 && timeLeft > 0) {
      clickAudio.seekTo(0);
      clickAudio.play();
    }
  }, [timeLeft, clickAudio, visible]);

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

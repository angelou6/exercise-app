import { ThemedModal } from "@/components/themed/themed-modal";
import { useAudioPlayer } from "expo-audio";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CountdownModalProps = {
  visible: boolean;
  duration: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

export default function CountdownModal({
  visible,
  duration,
  onClose,
}: CountdownModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const clickAudio = useAudioPlayer(require("../../../assets/audio/click.mp3"));
  const dingAudio = useAudioPlayer(require("../../../assets/audio/ding.mp3"));

  useEffect(() => {
    if (visible) {
      setTimeLeft(duration);
    }
  }, [visible, duration]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    if (timeLeft <= 0) {
      dingAudio.seekTo(0);
      dingAudio.play();
      clearInterval(interval);
      onClose();
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(
    useCallback(() => {
      if (timeLeft < 5 && timeLeft > 0) {
        clickAudio.seekTo(0);
        clickAudio.play();
      }
    }, [timeLeft]),
  );

  return (
    <ThemedModal
      transparent
      animationType="fade"
      visible={visible}
      presentationStyle="overFullScreen"
      style={styles.overlay}
      onRequestClose={onClose}
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

import { ThemedText } from "@/components/themed";
import { ThemedModal } from "@/components/themed/themed-modal";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

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
  const [preTimeLeft, setPreTimeLeft] = useState(duration);

  useEffect(() => {
    let interval = setInterval(() => {
      setPreTimeLeft((t) => t - 1);
    }, 1000);

    if (preTimeLeft <= 0) {
      clearInterval(interval);
      onClose();
    }

    return () => clearInterval(interval);
  }, [preTimeLeft]);

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
          <ThemedText style={styles.bigText}>{preTimeLeft}</ThemedText>
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
    fontWeight: "bold",
    lineHeight: 96,
    fontSize: 96,
  },
});

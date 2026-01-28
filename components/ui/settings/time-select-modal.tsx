import { ThemedButton } from "@/components/themed/themed-button";
import { ThemedInput } from "@/components/themed/themed-input";
import { ThemedText } from "@/components/themed/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import Storage from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface TimeSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (hour: string, minute: string) => void;
}

export default function TimeSelectModal({
  visible,
  onClose,
  onSelect,
}: TimeSelectModalProps) {
  const backgroundColor = useThemeColor({}, "background");
  const [hour, setHour] = useState("16");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    const savedTime = Storage.getItemSync("notificationTime");
    if (savedTime) {
      const time = JSON.parse(savedTime);
      setHour(time.hour);
      setMinute(time.minute);
    }
  });

  const formatTime = (time: string, maxTime: number) => {
    let formatedTime = time;
    if (time.length < 2) {
      formatedTime = time.padStart(2, "0");
    }

    if (Number(formatedTime) > maxTime) {
      formatedTime = String(maxTime);
    }
    return time;
  };

  const handleSave = () => {
    onSelect(formatTime(hour, 23), formatTime(minute, 59));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText type="subtitle" style={styles.title}>
              Select Time
            </ThemedText>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <ThemedText>Hour</ThemedText>
                <ThemedInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  value={hour}
                  onChangeText={setHour}
                />
              </View>
              <ThemedText style={styles.separator}>:</ThemedText>
              <View style={styles.inputWrapper}>
                <ThemedText>Minute</ThemedText>
                <ThemedInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  value={minute}
                  onChangeText={setMinute}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ThemedButton onPress={onClose} style={styles.button}>
                <Text>Cancel</Text>
              </ThemedButton>
              <ThemedButton onPress={handleSave} style={styles.button}>
                <Text>Save</Text>
              </ThemedButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  inputWrapper: {
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 60,
    textAlign: "center",
    marginTop: 5,
    fontSize: 20,
  },
  separator: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

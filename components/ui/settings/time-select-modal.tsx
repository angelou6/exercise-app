import { ThemedButton } from "@/components/themed/themed-button";
import { ThemedInput } from "@/components/themed/themed-input";
import { ThemedText } from "@/components/themed/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const timeRegex: RegExp = /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;

  const [hour, setHour] = useState("16");
  const [minute, setMinute] = useState("00");

  const formatTime = (time: string) => {
    let formatedTime = time;
    if (time.length < 2) {
      formatedTime = time.padStart(2, "0");
    }
    return formatedTime;
  };

  const timeString = `${formatTime(hour)}:${formatTime(minute)}`;
  const isDisabled = !timeRegex.test(timeString);

  const handleSave = () => {
    onSelect(formatTime(hour), formatTime(minute));
    onClose();
  };

  useEffect(() => {}, []);

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
              {t("settings.selectTime")}
            </ThemedText>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <ThemedText>{t("settings.hour")}</ThemedText>
                <ThemedInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={hour}
                  onChangeText={setHour}
                />
              </View>
              <ThemedText style={styles.separator}>:</ThemedText>
              <View style={styles.inputWrapper}>
                <ThemedText>{t("settings.minute")}</ThemedText>
                <ThemedInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={minute}
                  onChangeText={setMinute}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ThemedButton onPress={onClose} style={styles.button}>
                <Text>{t("common.cancel")}</Text>
              </ThemedButton>
              <ThemedButton
                onPress={handleSave}
                disabled={isDisabled}
                style={[
                  styles.button,
                  isDisabled && {
                    opacity: 0.5,
                  },
                ]}
              >
                <Text>{t("common.save")}</Text>
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
    boxShadow: "0 2 4 0 rgba(0, 0, 0, 0.25)",
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

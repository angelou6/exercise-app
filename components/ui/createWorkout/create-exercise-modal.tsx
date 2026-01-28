import {
  ThemedButton,
  ThemedIcon,
  ThemedInput,
  ThemedText,
} from "@/components/themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  createExercise,
  deleteExercise,
  updateExercise,
} from "@/utils/database";
import { Exercise } from "@/utils/databaseTypes";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type CreateExerciseModalProps = {
  visible: boolean;
  onClose: () => void;
  initialExercise?: Exercise | null;
  onExerciseChange: (newId?: number | undefined | null) => void;
};

export default function CreateExerciseModal({
  visible,
  onClose,
  initialExercise,
  onExerciseChange,
}: CreateExerciseModalProps) {
  const db = useSQLiteContext();
  const backgroundColor = useThemeColor({}, "background");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (visible) {
      if (initialExercise) {
        setName(initialExercise.name);
        setDesc(initialExercise.description || "");
      } else {
        setName("");
        setDesc("");
      }
    }
  }, [visible, initialExercise]);

  const handleSubmit = () => {
    if (!initialExercise) {
      const newId = createExercise(db, name, desc);
      onExerciseChange(newId);
    } else {
      updateExercise(db, initialExercise.id, name, desc);
      onExerciseChange();
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialExercise) {
      deleteExercise(db, initialExercise.id);
      onExerciseChange();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
              <ThemedText type="subtitle">
                {initialExercise ? "Edit Exercise" : "Create Exercise"}
              </ThemedText>
              <Pressable onPress={onClose}>
                <ThemedIcon name="Check" size={24} />
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Exercise Name</ThemedText>
                <ThemedInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Enter exercise name"
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Description</ThemedText>
                <ThemedInput
                  value={desc}
                  onChangeText={setDesc}
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter exercise description"
                  multiline
                />
              </View>
              <ThemedButton
                disabled={!name.trim()}
                style={
                  !name.trim() && {
                    backgroundColor: "grey",
                  }
                }
                onPress={handleSubmit}
              >
                <Text>
                  {initialExercise ? "Update Exercise" : "Add Exercise"}
                </Text>
              </ThemedButton>
              {initialExercise && (
                <ThemedButton
                  onPress={handleDelete}
                  style={styles.deleteButton}
                >
                  <ThemedText>Delete Exercise</ThemedText>
                </ThemedButton>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  deleteButton: {
    backgroundColor: "transparent",
    marginTop: 8,
  },
});

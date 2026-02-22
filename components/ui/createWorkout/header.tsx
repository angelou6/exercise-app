import {
  ThemedEmojiPicker,
  ThemedIcon,
  ThemedInput,
  ThemedText,
} from "@/components/themed";
import { useCardTheme } from "@/hooks/use-card-theeme";
import { validateNumberInput } from "@/utils/input";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmojiType } from "rn-emoji-keyboard";

type Header = {
  name: string;
  emoji: string;
  rest: number;
  onchange: (name: string, emoji: string, rest: number) => void;
};

export default function WorkoutHeader({ name, emoji, rest, onchange }: Header) {
  const { t } = useTranslation();
  const cardTheme = useCardTheme();
  const defaultRestTime = 5;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (name: string, emoji: string, rest: number) => {
    onchange(name, emoji, rest);
  };

  const handlePick = (emojiObject: EmojiType) => {
    handleChange(name, emojiObject.emoji, rest);
  };

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <ThemedEmojiPicker
        onEmojiSelected={handlePick}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedIcon name="ArrowLeft" />
        </Pressable>
        <ThemedText type="title">{t("createWorkout.title")}</ThemedText>
      </View>

      <View
        style={[
          styles.section,
          {
            borderColor: cardTheme.border,
            backgroundColor: cardTheme.background,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => setIsOpen(true)}
            style={[styles.emojiButton, { backgroundColor: cardTheme.border }]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
          <ThemedInput
            value={name}
            multiline
            scrollEnabled={true}
            onChangeText={(text) => handleChange(text, emoji, rest)}
            style={styles.workoutName}
            placeholder={t("createWorkout.workoutNamePlaceholder")}
          />
        </View>

        <View style={styles.restRow}>
          <ThemedText>{t("createWorkout.restBetweenExercises")}</ThemedText>
          <View style={styles.restInputContainer}>
            <ThemedInput
              keyboardType="numeric"
              placeholder={defaultRestTime.toString()}
              value={String(rest)}
              maxLength={3}
              onChangeText={(rest) =>
                validateNumberInput(rest) &&
                handleChange(name, emoji, Number(rest))
              }
              style={styles.restInputField}
            />
            <ThemedText style={styles.unit}>s</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  emojiButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 32,
  },
  workoutName: {
    fontSize: 18,
    width: "80%",
    fontWeight: "bold",
  },
  restRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  restInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restInputField: {
    width: 50,
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 4,
  },
  unit: {
    opacity: 0.6,
  },
});

import {
  ThemedEmojiPicker,
  ThemedIcon,
  ThemedInput,
  ThemedText,
} from "@/components/themed";
import { CardTheme } from "@/constants/theme";
import { validateNumberInput } from "@/utils/input";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmojiType } from "rn-emoji-keyboard";

type Header = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  emoji: string;
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
  restTime: string;
  setRestTime: React.Dispatch<React.SetStateAction<string>>;
  cardTheme: CardTheme;
};

export default function WorkoutHeader({
  name,
  setName,
  emoji,
  setEmoji,
  restTime,
  setRestTime,
  cardTheme,
}: Header) {
  const defaultRestTime = 5;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePick = (emojiObject: EmojiType) => {
    setEmoji(emojiObject.emoji);
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
        <ThemedText type="title">Create Workout</ThemedText>
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
            onChangeText={setName}
            style={styles.workoutName}
            placeholder="Workout Name"
          />
        </View>

        <View style={styles.restRow}>
          <ThemedText>Rest between exercises</ThemedText>
          <View style={styles.restInputContainer}>
            <ThemedInput
              keyboardType="numeric"
              placeholder={defaultRestTime.toString()}
              value={restTime}
              maxLength={3}
              onChangeText={(text) =>
                validateNumberInput(text) && setRestTime(text)
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

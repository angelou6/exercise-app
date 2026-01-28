import { ThemedIcon, ThemedInput, ThemedText } from "@/components/themed";
import { CardTheme } from "@/constants/theme";
import { getOneExercise } from "@/utils/database";
import { Exercise, SubmitExercise } from "@/utils/databaseTypes";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useReorderableDrag } from "react-native-reorderable-list";
import CreateExerciseModal from "./create-exercise-modal";

type Item = {
  item: SubmitExercise;
  cardTheme: CardTheme;
  updateExerciseDuration: (item: SubmitExercise, time: number) => void;
  defaultDuration: number;
  deleteExercise: (id: number) => void;
  onExerciseUpdate?: (exercise: Exercise) => void;
};

export default function DragableItem({
  item,
  cardTheme,
  updateExerciseDuration,
  defaultDuration,
  deleteExercise,
  onExerciseUpdate,
}: Item) {
  const drag = useReorderableDrag();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleExerciseChange = () => {
    const updated = getOneExercise(item.exercise.id);
    if (updated) {
      if (onExerciseUpdate) {
        onExerciseUpdate(updated);
      }
    } else {
      deleteExercise(item.exercise.id);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardTheme.background,
          borderColor: cardTheme.border,
        },
      ]}
    >
      <CreateExerciseModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        initialExercise={item.exercise}
        onExerciseChange={handleExerciseChange}
      />
      <Pressable onPressIn={drag} style={styles.dragHandle} hitSlop={12}>
        <ThemedIcon name="GripVertical" color={cardTheme.sub} />
      </Pressable>
      <View style={styles.cardTextBlock}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
          {item.exercise.name}
        </ThemedText>
        {item.exercise.description?.length > 0 && (
          <ThemedText
            style={[styles.smallText, { color: cardTheme.sub }]}
            numberOfLines={1}
          >
            {item.exercise.description}
          </ThemedText>
        )}
      </View>
      <View style={styles.cardActions}>
        <View style={[styles.exTime, { backgroundColor: cardTheme.border }]}>
          <ThemedInput
            keyboardType="numeric"
            placeholder={defaultDuration.toString()}
            onChangeText={(time) =>
              updateExerciseDuration(item, parseInt(time))
            }
            style={styles.timeInput}
          />
          <ThemedText style={styles.timeUnit}>s</ThemedText>
        </View>
        <Pressable
          style={styles.iconButton}
          onPress={(e) => {
            e.stopPropagation();
            setCreateModalVisible(true);
          }}
        >
          <ThemedIcon name="Pencil" size={20} color={cardTheme.sub} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => deleteExercise(item.exercise.id)}
        >
          <ThemedIcon name="Trash2" size={20} color={cardTheme.sub} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  dragHandle: {
    padding: 8,
  },
  cardTextBlock: {
    flex: 1,
    marginHorizontal: 8,
  },
  smallText: {
    fontSize: 13,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exTime: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeInput: {
    width: 30,
    textAlign: "center",
    fontSize: 14,
    padding: 0,
  },
  timeUnit: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 2,
  },
  iconButton: {
    padding: 4,
  },
});

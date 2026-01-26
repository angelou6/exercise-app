import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  SystemUI.setBackgroundColorAsync(bgColor);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="exercise.db" onInit={migration}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </ThemeProvider>
  );
}

async function migration(db: SQLiteDatabase) {
  const RESET_DB = false;

  if (RESET_DB) {
    await db.execAsync(`
      DROP TABLE IF EXISTS Workout_Exercises;
      DROP TABLE IF EXISTS Workouts;
      DROP TABLE IF EXISTS Exercises;
      PRAGMA user_version = 0;
    `);
  }
  const DATABASE_VERSION = 1;

  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emoji TEXT NOT NULL,
            name TEXT NOT NULL,
            rest INTEGER
        );

        CREATE TABLE IF NOT EXISTS workout_exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            duration INTEGER,
            exercise_order INTEGER NOT NULL,

            FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
            FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );
    `);
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

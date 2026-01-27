import { type SQLiteDatabase } from "expo-sqlite";
import { Exercise, SubmitExercise, Workout } from "./databaseTypes";

export function createExercise(db: SQLiteDatabase, name: string, desc: string) {
  const result = db.runSync(
    "INSERT INTO exercises (name, description) VALUES ($name, $description)",
    { $name: name, $description: desc },
  );
  return result.lastInsertRowId;
}

export function getAllExercises(db: SQLiteDatabase): Exercise[] {
  return db.getAllSync<Exercise>("SELECT * FROM exercises");
}

export function getSomeExercises(
  db: SQLiteDatabase,
  ids: number[],
): Exercise[] {
  const questionMarks = "?,".repeat(ids.length - 1) + "?";
  return db.getAllSync(
    `SELECT * FROM exercises WHERE id IN (${questionMarks})`,
    ids,
  );
}

export function updateExercise(
  db: SQLiteDatabase,
  id: number,
  name: string,
  desc: string,
) {
  db.runSync(
    "UPDATE exercises SET name = $name, description = $description WHERE id = $id",
    { $id: id, $name: name, $description: desc },
  );
}

export function deleteExercise(db: SQLiteDatabase, id: number) {
  db.runSync("DELETE FROM exercises WHERE id = $id", { $id: id });
}

export function getAllWourkouts(db: SQLiteDatabase): Workout[] {
  return db.getAllSync("SELECT * FROM workouts");
}

export function getSomeWorkouts(db: SQLiteDatabase, ids: number[]) {
  const questionMarks = "?,".repeat(ids.length - 1) + "?";
  return db.getAllSync(
    `SELECT * FROM workouts WHERE id IN (${questionMarks})`,
    ids,
  );
}

export function getOneWorkout(db: SQLiteDatabase, id: string): Workout | null {
  return db.getFirstSync("SELECT * FROM workouts WHERE id = $id", { $id: id });
}

export function getExercisesFromWorkout(db: SQLiteDatabase, workoutID: number) {
  const workoutExercises: {
    exercise_id: number;
    duration: number;
    exercise_order: number;
  }[] = db.getAllSync(
    "SELECT exercise_id, duration, exercise_order FROM workout_exercises WHERE workout_id = $id ORDER BY exercise_order",
    { $id: workoutID },
  );

  const exercisesIDs = workoutExercises.map((ex) => ex.exercise_id);
  const exercises: Exercise[] = getSomeExercises(db, exercisesIDs);

  const exerciseMap = new Map(exercises.map((ex) => [ex.id, ex]));

  return workoutExercises.map((workoutEx) => {
    const exercise = exerciseMap.get(workoutEx.exercise_id);
    return {
      exercise: exercise!,
      order: workoutEx.exercise_order,
      duration: workoutEx.duration,
    };
  });
}

export function createWorkout(
  db: SQLiteDatabase,
  emoji: string,
  name: string,
  rest: number,
  exercises: SubmitExercise[],
) {
  const result = db.runSync(
    "INSERT INTO workouts (emoji, name, rest) VALUES ($emoji, $name, $rest)",
    { $emoji: emoji, $name: name, $rest: rest },
  );
  const workoutID = result.lastInsertRowId;

  const preparedWorkout = db.prepareSync(
    "INSERT INTO workout_exercises (workout_id, exercise_id, duration, exercise_order) VALUES ($wID, $exID, $duration, $order)",
  );

  try {
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      preparedWorkout.executeSync({
        $wID: workoutID,
        $exID: ex.exercise.id,
        $duration: ex.duration,
        $order: i,
      });
    }
  } finally {
    preparedWorkout.finalizeSync();
  }
}

export function updateWorkout(
  db: SQLiteDatabase,
  id: number,
  emoji: string,
  name: string,
  rest: number,
  exercises: SubmitExercise[],
) {
  db.runSync(
    "UPDATE workouts SET emoji = $emoji, name = $name, rest = $rest WHERE id = $id",
    { $id: id, $emoji: emoji, $name: name, $rest: rest },
  );

  db.runSync("DELETE FROM workout_exercises WHERE workout_id = $id", {
    $id: id,
  });

  const preparedWorkout = db.prepareSync(
    "INSERT INTO workout_exercises (workout_id, exercise_id, duration, exercise_order) VALUES ($wID, $exID, $duration, $order)",
  );

  try {
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      preparedWorkout.executeSync({
        $wID: id,
        $exID: ex.exercise.id,
        $duration: ex.duration,
        $order: i,
      });
    }
  } finally {
    preparedWorkout.finalizeSync();
  }
}

export function deleteWorkout(db: SQLiteDatabase, id: number) {
  db.runSync("DELETE FROM workouts WHERE id = $id", { $id: id });
}

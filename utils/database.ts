import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import { Exercise, SubmitExercise, Workout } from "./databaseTypes";

let db: SQLiteDatabase | undefined = undefined

function initDatabase() {
    if (!db) db = openDatabaseSync("exercise.db");
    return db
}

export function createExercise(name: string, desc: string) {
    const db = initDatabase();

    db.runSync(
        "INSERT INTO exercises (name, description) VALUES ($name, $description)",
        { $name: name, $description: desc }
    )
}

export function getAllExercises(): Exercise[] {
    const db = initDatabase();
    return db.getAllSync<Exercise>('SELECT * FROM exercises');
}

export function getSomeExercises(ids: number[]): Exercise[] {
    const db = initDatabase();

    const questionMarks = '?,'.repeat(ids.length-1) + '?'
    return db.getAllSync(
        `SELECT * FROM exercises WHERE id IN (${questionMarks})`, 
        ids
    );
}

export function updateExercise(id: number, name: string, desc: string) {
    const db = initDatabase();
    db.runSync(
        "UPDATE exercises SET name = $name, description = $description WHERE id = $id", 
        { $id: id, $name: name, $description: desc }
    )
}

export function deleteExercise(id: number) {
    const db = initDatabase();
    db.runSync("DELETE FROM exercises WHERE id = $id", { $id: id })
}

export function getAllWourkouts(): Workout[] {
    const db = initDatabase();
    return db.getAllSync('SELECT * FROM workouts');
}

export function getSomeWorkouts(ids: number[]) {
    const db = initDatabase();

    const questionMarks = '?,'.repeat(ids.length-1) + '?'
    return db.getAllSync(
        `SELECT * FROM workouts WHERE id IN (${questionMarks})`, 
        ids
    );
}

export function getOneWorkout(id: string): Workout | null {
    const db = initDatabase();
    return db.getFirstSync("SELECT * FROM workouts WHERE id = $id", {$id: id});
}

export function getExercisesFromWorkout(workoutId: number) {
    const db = initDatabase();

    const workoutExercises: {exercise_id: number, duration: number, exercise_order: number}[] = db.getAllSync(
        "SELECT exercise_id, duration, exercise_order FROM workout_exercises WHERE workout_id = $id ORDER BY exercise_order", 
        {$id: workoutId}
    );

    const exercisesIDs = workoutExercises.map((ex) => ex.exercise_id);
    const exercises: Exercise[] = getSomeExercises(exercisesIDs);

    const exerciseMap = new Map(exercises.map(ex => [ex.id, ex]));

    return workoutExercises.map((workoutEx) => {
        const exercise = exerciseMap.get(workoutEx.exercise_id);
        return {
            exercise: exercise!,
            order: workoutEx.exercise_order,
            duration: workoutEx.duration
        }
    });
}

export function createWorkout(emoji: string, name: string, rest: number, exercises: SubmitExercise[]) {
    const db = initDatabase();

    const result = db.runSync(
        "INSERT INTO workouts (emoji, name, rest) VALUES ($emoji, $name, $rest)",
        { $emoji: emoji, $name: name, $rest: rest }
    );
    const workoutId = result.lastInsertRowId;

    const preparedWorkout = db.prepareSync(
        "INSERT INTO workout_exercises (workout_id, exercise_id, duration, exercise_order) VALUES ($wId, $exId, $duration, $order)"
    );

    try {
        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i];
            preparedWorkout.executeSync({
                $wId: workoutId, 
                $exId: ex.exercise.id, 
                $duration: ex.duration,
                $order: i
            });
        }
    } finally {
        preparedWorkout.finalizeSync();
    }
}

export function updateWorkout(id: number, emoji: string, name: string, rest: number, exercises: SubmitExercise[]) {
    const db = initDatabase();

    db.runSync(
        "UPDATE workouts SET emoji = $emoji, name = $name, rest = $rest WHERE id = $id",
        { $id: id, $emoji: emoji, $name: name, $rest: rest }
    );

    db.runSync(
        "DELETE FROM workout_exercises WHERE workout_id = $id",
        { $id: id }
    );

    const preparedWorkout = db.prepareSync(
        "INSERT INTO workout_exercises (workout_id, exercise_id, duration, exercise_order) VALUES ($wId, $exId, $duration, $order)"
    );

    try {
        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i];
            preparedWorkout.executeSync({
                $wId: id, 
                $exId: ex.exercise.id, 
                $duration: ex.duration,
                $order: i
            });
        }
    } finally {
        preparedWorkout.finalizeSync();
    }
}

export function deleteWorkout(id: number) {
    const db = initDatabase();
    db.runSync("DELETE FROM workouts WHERE id = $id", { $id: id })
}
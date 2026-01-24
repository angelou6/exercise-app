import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import { Exercise, SubmitExercise } from "./databaseTypes";

let db: SQLiteDatabase | undefined = undefined

function initDatabase() {
    if (!db) db = openDatabaseSync("exercise.db");
    return db
}

export function createExercise(name: string, desc: string) {
    const db = initDatabase();

    db.runSync(
        "INSERT INTO Exercises (name, description) VALUES ($name, $description)",
        { $name: name, $description: desc }
    )
}

export function getAllExercises(): Exercise[] {
    const db = initDatabase();
    return db.getAllSync<Exercise>('SELECT * FROM Exercises');
}

export function getSomeExercises(exIds: number[]) {
    const db = initDatabase();

    const questionMarks = '?,'.repeat(exIds.length-1) + '?'
    return db.runSync(
        `SELECT * FROM Exercises WHERE workout_id IN (${questionMarks})`, 
        exIds
    );
}

export function getAllWourkouts() {
    const db = initDatabase();
    return db.getAllSync('SELECT * FROM Workouts');
}

export function createWorkout(emoji: string, name: string, rest_seconds: string, exercises: SubmitExercise[]) {
    const db = initDatabase();

    const result = db.runSync(
        "INSERT INTO Workouts (emoji, name, rest_seconds) VALUES ($emoji, $name, $rest_seconds)",
        { $emoji: emoji, $name: name, $rest_seconds: rest_seconds }
    );
    const workoutId = result.lastInsertRowId;

    const preparedWorkout = db.prepareSync(
        "INSERT INTO Workout_Exercises (workout_id, exercise_id, exercise_time) values ($workout_id, $exercise_id, $exercise_time)"
    );

    try {
        for (const ex of exercises) {
            preparedWorkout.executeSync({
                $workout_id: workoutId, 
                $exercise_id: ex.exId, 
                $exercise_time: ex.exTime
            });
        }
    } finally {
        preparedWorkout.finalizeSync();
    }
    
}
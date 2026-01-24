export type SubmitExercise = {
    exId: number,
    exTime: number
}

export type WorkoutExercise = {
    id: number,
    workout_id: number,
    exercise_id: number,
    exercise_time: number,
}

export type Exercise = {
    exercise_id: number,
    name: string,
    description: string
}

export type Workout = {
    workout_id: number,
    emoji: string,
    description: string,
    rest_seconds: number
}
export type SubmitExercise = {
    exerciseId: number,
    exerciseTime: number
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
    name: string,
    rest_seconds: number
}
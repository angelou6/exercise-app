export type SubmitExercise = {
  exercise: Exercise;
  order: number;
  duration: number;
};

export type Exercise = {
  id: number;
  name: string;
  description: string;
};

export type Workout = {
  id: number;
  emoji: string;
  name: string;
  rest: number;
};

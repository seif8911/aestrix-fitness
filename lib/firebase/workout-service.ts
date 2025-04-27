
import { db } from './firebase-config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export interface ProgressiveOverload {
  exerciseName: string;
  suggestedWeight: number;
  suggestedReps: number;
}

export async function calculateProgressiveOverload(
  userId: string,
  exerciseName: string
): Promise<ProgressiveOverload> {
  const workoutsRef = collection(db, `users/${userId}/workouts`);
  const q = query(
    workoutsRef,
    where('exercises.name', '==', exerciseName),
    orderBy('date', 'desc'),
    limit(3)
  );

  const snapshot = await getDocs(q);
  const workouts = snapshot.docs.map(doc => doc.data());

  if (workouts.length === 0) {
    return {
      exerciseName,
      suggestedWeight: 0,
      suggestedReps: 8
    };
  }

  // Calculate the maximum weight and reps from previous workouts
  const maxWeight = Math.max(...workouts.flatMap(w => 
    w.exercises
      .filter(e => e.name === exerciseName)
      .flatMap(e => e.sets.map(s => s.weight))
  ));

  const maxReps = Math.max(...workouts.flatMap(w =>
    w.exercises
      .filter(e => e.name === exerciseName)
      .flatMap(e => e.sets.map(s => s.reps))
  ));

  // Progressive overload logic
  let suggestedWeight = maxWeight;
  let suggestedReps = maxReps;

  if (workouts.length >= 2) {
    const allSetsCompleted = workouts[0].exercises
      .find(e => e.name === exerciseName)
      ?.sets.every(s => s.completed);

    if (allSetsCompleted) {
      if (maxReps >= 12) {
        suggestedWeight = maxWeight + 2.5; // Increase weight
        suggestedReps = 8; // Reset reps
      } else {
        suggestedReps = maxReps + 1; // Increase reps
      }
    }
  }

  return {
    exerciseName,
    suggestedWeight,
    suggestedReps
  };
}

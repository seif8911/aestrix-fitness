"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { addWorkout, getWorkouts, updateWorkout, deleteWorkout } from "@/lib/firebase/db-service"

export interface Exercise {
  id: string
  name: string
  sets: {
    weight: number
    reps: number
    completed: boolean
  }[]
}

export interface Workout {
  id?: string
  title: string
  date: string
  exercises: Exercise[]
  notes?: string
  duration?: number
  intensity?: "Light" | "Moderate" | "High"
  completed?: boolean
}

export const useWorkouts = () => {
  const { currentUser } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWorkouts = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const fetchedWorkouts = await getWorkouts(currentUser.uid)
      setWorkouts(fetchedWorkouts as Workout[])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error("Error fetching workouts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchWorkouts()
    } else {
      setWorkouts([])
      setLoading(false)
    }
  }, [currentUser])

  const createWorkout = async (workoutData: Workout) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      const docRef = await addWorkout(currentUser.uid, workoutData)
      const newWorkout = { ...workoutData, id: docRef.id }
      setWorkouts((prev) => [newWorkout, ...prev])
      return newWorkout
    } catch (err) {
      console.error("Error creating workout:", err)
      throw err
    }
  }

  const updateWorkoutById = async (workoutId: string, workoutData: Partial<Workout>) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      await updateWorkout(currentUser.uid, workoutId, workoutData)
      setWorkouts((prev) =>
        prev.map((workout) => (workout.id === workoutId ? { ...workout, ...workoutData } : workout)),
      )
    } catch (err) {
      console.error("Error updating workout:", err)
      throw err
    }
  }

  const deleteWorkoutById = async (workoutId: string) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      await deleteWorkout(currentUser.uid, workoutId)
      setWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId))
    } catch (err) {
      console.error("Error deleting workout:", err)
      throw err
    }
  }

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout: updateWorkoutById,
    deleteWorkout: deleteWorkoutById,
    refreshWorkouts: fetchWorkouts,
  }
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save } from "lucide-react"
import { useWorkouts, type Exercise, type Workout } from "@/hooks/use-workouts"
import { v4 as uuidv4 } from "uuid"

export function WorkoutForm() {
  const router = useRouter()
  const { createWorkout } = useWorkouts()
  const [loading, setLoading] = useState(false)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const [workout, setWorkout] = useState<Workout>({
    title: "",
    date: today,
    exercises: [],
    notes: "",
    duration: 45,
    intensity: "Moderate",
    completed: false,
  })

  const addExercise = () => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: "",
      sets: [{ weight: 0, reps: 0, completed: false }],
    }

    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }))
  }

  const removeExercise = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }))
  }

  const updateExercise = (exerciseId: string, field: string, value: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, [field]: value }
        }
        return ex
      }),
    }))
  }

  const addSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, { weight: 0, reps: 0, completed: false }],
          }
        }
        return ex
      }),
    }))
  }

  const removeSet = (exerciseId: string, setIndex: number) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter((_, idx) => idx !== setIndex),
          }
        }
        return ex
      }),
    }))
  }

  const updateSet = (exerciseId: string, setIndex: number, field: string, value: number) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set, idx) => {
              if (idx === setIndex) {
                return { ...set, [field]: value }
              }
              return set
            }),
          }
        }
        return ex
      }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workout.title) {
      alert("Please enter a workout title")
      return
    }

    if (workout.exercises.length === 0) {
      alert("Please add at least one exercise")
      return
    }

    // Validate exercises
    for (const exercise of workout.exercises) {
      if (!exercise.name) {
        alert("Please enter a name for all exercises")
        return
      }
    }

    setLoading(true)

    try {
      await createWorkout(workout)
      router.push("/workouts")
    } catch (error) {
      console.error("Error creating workout:", error)
      alert("Failed to create workout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create New Workout</h1>
        <Button onClick={() => router.back()} variant="outline">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Workout Title</Label>
                <Input
                  id="title"
                  value={workout.title}
                  onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
                  placeholder="e.g., Upper Body Strength"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={workout.date}
                  onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={workout.duration}
                  onChange={(e) => setWorkout({ ...workout, duration: Number.parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <Select
                  value={workout.intensity}
                  onValueChange={(value) =>
                    setWorkout({ ...workout, intensity: value as "Light" | "Moderate" | "High" })
                  }
                >
                  <SelectTrigger id="intensity">
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={workout.notes}
                onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
                placeholder="Any additional notes about this workout..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exercises</CardTitle>
            <Button type="button" onClick={addExercise} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {workout.exercises.length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-gray-700">
                <p className="text-gray-500">No exercises added yet. Click "Add Exercise" to get started.</p>
              </div>
            ) : (
              workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="rounded-md border border-gray-800 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="space-y-2 flex-1 mr-4">
                      <Label htmlFor={`exercise-${exerciseIndex}`}>Exercise Name</Label>
                      <Input
                        id={`exercise-${exerciseIndex}`}
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                        placeholder="e.g., Bench Press"
                        required
                      />
                    </div>
                    <Button type="button" onClick={() => removeExercise(exercise.id)} variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sets</Label>
                      <Button type="button" onClick={() => addSet(exercise.id)} variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" />
                        Add Set
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center space-x-2">
                          <div className="w-12 text-center text-sm text-gray-400">Set {setIndex + 1}</div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Weight"
                              value={set.weight}
                              onChange={(e) =>
                                updateSet(exercise.id, setIndex, "weight", Number.parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Reps"
                              value={set.reps}
                              onChange={(e) =>
                                updateSet(exercise.id, setIndex, "reps", Number.parseInt(e.target.value))
                              }
                            />
                          </div>
                          {exercise.sets.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeSet(exercise.id, setIndex)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Workout"}
          </Button>
        </div>
      </form>
    </div>
  )
}

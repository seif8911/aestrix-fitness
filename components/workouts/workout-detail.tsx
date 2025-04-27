"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Flame, Save, Trash2 } from "lucide-react"
import { useWorkouts, type Workout } from "@/hooks/use-workouts"
import { updatePR } from "@/lib/firebase/db-service"
import { useAuth } from "@/contexts/auth-context"

interface WorkoutDetailProps {
  id: string
}

export function WorkoutDetail({ id }: WorkoutDetailProps) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { workouts, updateWorkout, deleteWorkout } = useWorkouts()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)

  useEffect(() => {
    if (workouts.length > 0) {
      const foundWorkout = workouts.find((w) => w.id === id)
      if (foundWorkout) {
        setWorkout(foundWorkout)
      }
      setLoading(false)
    }
  }, [id, workouts])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeTimer !== null) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const startTimer = () => {
    setTimerSeconds(0)
    setActiveTimer(Date.now())
  }

  const stopTimer = () => {
    setActiveTimer(null)
  }

  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    if (!workout) return

    const updatedWorkout = { ...workout }
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed =
      !updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed

    setWorkout(updatedWorkout)
  }

  const updateSetValue = (exerciseIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
    if (!workout) return

    const updatedWorkout = { ...workout }
    updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value

    setWorkout(updatedWorkout)
  }

  const handleSave = async () => {
    if (!workout || !currentUser) return

    setSaving(true)

    try {
      // Check if all sets are completed
      const allSetsCompleted = workout.exercises.every((ex) => ex.sets.every((set) => set.completed))

      // Update workout completion status
      const updatedWorkout = {
        ...workout,
        completed: allSetsCompleted,
      }

      await updateWorkout(id, updatedWorkout)

      // Update PRs for each exercise
      for (const exercise of workout.exercises) {
        // Find the heaviest weight for this exercise
        const maxWeight = Math.max(...exercise.sets.map((set) => set.weight))

        if (maxWeight > 0) {
          await updatePR(currentUser.uid, exercise.name, {
            weight: maxWeight,
            date: workout.date,
            workoutId: id,
          })
        }
      }

      router.push("/workouts")
    } catch (error) {
      console.error("Error saving workout:", error)
      alert("Failed to save workout. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!workout) return

    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id)
        router.push("/workouts")
      } catch (error) {
        console.error("Error deleting workout:", error)
        alert("Failed to delete workout. Please try again.")
      }
    }
  }

  if (loading) {
    return <div>Loading workout...</div>
  }

  if (!workout) {
    return <div>Workout not found</div>
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "Light":
        return "text-green-500"
      case "Moderate":
        return "text-yellow-500"
      case "High":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{workout.title}</h1>
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center">
            <Flame className={`mr-1 h-4 w-4 ${getIntensityColor(workout.intensity || "Moderate")}`} />
            <span>{workout.intensity}</span>
          </div>
          <div>{workout.date}</div>
        </div>
      </div>

      {workout.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{workout.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rest Timer</CardTitle>
          <div className="text-2xl font-mono">{formatTime(timerSeconds)}</div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {activeTimer === null ? (
              <Button onClick={startTimer} className="flex-1">
                Start Timer
              </Button>
            ) : (
              <Button onClick={stopTimer} variant="destructive" className="flex-1">
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex}>
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center space-x-4">
                    <div className="w-12 text-center text-sm text-gray-400">Set {setIndex + 1}</div>
                    <div className="flex-1">
                      <Label htmlFor={`weight-${exerciseIndex}-${setIndex}`} className="sr-only">
                        Weight
                      </Label>
                      <Input
                        id={`weight-${exerciseIndex}-${setIndex}`}
                        type="number"
                        min="0"
                        placeholder="Weight"
                        value={set.weight}
                        onChange={(e) =>
                          updateSetValue(exerciseIndex, setIndex, "weight", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`reps-${exerciseIndex}-${setIndex}`} className="sr-only">
                        Reps
                      </Label>
                      <Input
                        id={`reps-${exerciseIndex}-${setIndex}`}
                        type="number"
                        min="0"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) =>
                          updateSetValue(exerciseIndex, setIndex, "reps", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`completed-${exerciseIndex}-${setIndex}`}
                        checked={set.completed}
                        onCheckedChange={() => toggleSetCompleted(exerciseIndex, setIndex)}
                      />
                      <Label htmlFor={`completed-${exerciseIndex}-${setIndex}`} className="text-sm cursor-pointer">
                        Done
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

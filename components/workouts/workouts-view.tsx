"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Loader2 } from "lucide-react"
import { WorkoutCard } from "@/components/workouts/workout-card"
import { ExerciseLibrary } from "@/components/workouts/exercise-library"
import { useWorkouts } from "@/hooks/use-workouts"

export function WorkoutsView() {
  const [activeTab, setActiveTab] = useState("my-workouts")
  const router = useRouter()
  const { workouts, loading, error } = useWorkouts()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error loading workouts: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workouts</h1>
          <p className="text-gray-400">Plan, track, and crush your training</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => router.push("/workouts/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-workouts" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-workouts">My Workouts</TabsTrigger>
          <TabsTrigger value="exercise-library">Exercise Library</TabsTrigger>
        </TabsList>
        <TabsContent value="my-workouts" className="mt-6">
          {workouts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-700">
              <p className="mb-4 text-gray-500">You haven't created any workouts yet.</p>
              <Button onClick={() => router.push("/workouts/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Workout
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  id={workout.id}
                  title={workout.title}
                  exercises={workout.exercises.map((ex) => `${ex.name}: ${ex.sets.length}×${ex.sets[0]?.reps || 0}`)}
                  duration={workout.duration || 45}
                  intensity={workout.intensity || "Moderate"}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="exercise-library" className="mt-6">
          <ExerciseLibrary />
        </TabsContent>
      </Tabs>
    </div>
  )
}

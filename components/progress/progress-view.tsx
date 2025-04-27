"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { StrengthChart } from "@/components/progress/strength-chart"
import { VolumeChart } from "@/components/progress/volume-chart"
import { MuscleGroupDistribution } from "@/components/progress/muscle-group-distribution"
import { useWorkouts } from "@/hooks/use-workouts"
import { useNutrition } from "@/hooks/use-nutrition"
import { useRecovery } from "@/hooks/use-recovery"
import { getPRs } from "@/lib/firebase/db-service"
import { useAuth } from "@/contexts/auth-context"

export function ProgressView() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("analytics")
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" }),
  )
  const { workouts, loading: workoutsLoading } = useWorkouts()
  const { nutritionLogs, loading: nutritionLoading } = useNutrition(30) // Get 30 days of data
  const { recoveryLogs, loading: recoveryLoading } = useRecovery(30) // Get 30 days of data
  const [prs, setPRs] = useState([])
  const [loadingPRs, setLoadingPRs] = useState(true)

  // Fetch PRs
  useState(() => {
    const fetchPRs = async () => {
      if (currentUser) {
        try {
          const fetchedPRs = await getPRs(currentUser.uid)
          setPRs(fetchedPRs)
        } catch (error) {
          console.error("Error fetching PRs:", error)
        } finally {
          setLoadingPRs(false)
        }
      }
    }

    fetchPRs()
  }, [currentUser])

  // Calculate total volume per workout
  const calculateWorkoutVolumes = () => {
    return workouts.map((workout) => {
      let totalVolume = 0

      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          totalVolume += set.weight * set.reps
        })
      })

      return {
        date: workout.date,
        volume: totalVolume,
      }
    })
  }

  // Calculate muscle group distribution
  const calculateMuscleGroupDistribution = () => {
    const muscleGroups = {
      Chest: 0,
      Back: 0,
      Legs: 0,
      Shoulders: 0,
      Arms: 0,
    }

    // This is a simplified version - in a real app, you'd have a mapping of exercises to muscle groups
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const name = exercise.name.toLowerCase()

        if (name.includes("bench") || name.includes("chest") || name.includes("fly")) {
          muscleGroups.Chest += 1
        } else if (name.includes("row") || name.includes("pull") || name.includes("lat") || name.includes("back")) {
          muscleGroups.Back += 1
        } else if (
          name.includes("squat") ||
          name.includes("leg") ||
          name.includes("deadlift") ||
          name.includes("lunge")
        ) {
          muscleGroups.Legs += 1
        } else if (name.includes("shoulder") || name.includes("press") || name.includes("delt")) {
          muscleGroups.Shoulders += 1
        } else if (
          name.includes("curl") ||
          name.includes("extension") ||
          name.includes("tricep") ||
          name.includes("bicep")
        ) {
          muscleGroups.Arms += 1
        }
      })
    })

    return Object.entries(muscleGroups).map(([name, value]) => ({ name, value }))
  }

  if (workoutsLoading || nutritionLoading || recoveryLoading || loadingPRs) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
          <p className="text-gray-400">Track your fitness journey</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Add Photo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="body-metrics">Body Metrics</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <h2 className="text-lg font-semibold">{currentMonth}</h2>
            <Button variant="ghost" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strength Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StrengthChart prs={prs} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <VolumeChart volumeData={calculateWorkoutVolumes()} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Muscle Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <MuscleGroupDistribution data={calculateMuscleGroupDistribution()} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="body-metrics">
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-700">
            <p className="text-gray-500">Body metrics tracking coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="photos">
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-700">
            <p className="text-gray-500">Progress photos coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

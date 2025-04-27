"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplet, Moon, Calendar, Plus, Loader2 } from "lucide-react"
import { WorkoutCard } from "@/components/workouts/workout-card"
import { ReadinessScore } from "@/components/dashboard/readiness-score"
import { NutritionSummary } from "@/components/dashboard/nutrition-summary"
import { useAuth } from "@/contexts/auth-context"
import { useWorkouts } from "@/hooks/use-workouts"
import { useNutrition } from "@/hooks/use-nutrition"
import { useRecovery } from "@/hooks/use-recovery"

export function DashboardView() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { workouts, loading: workoutsLoading } = useWorkouts()
  const { nutritionLogs, loading: nutritionLoading, updateWaterIntake } = useNutrition()
  const { recoveryLogs, loading: recoveryLoading } = useRecovery()

  const [waterIntake, setWaterIntake] = useState(0)
  const waterGoal = 8

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Find today's nutrition log
  const todayNutrition = nutritionLogs.find((log) => log.date === today)

  // Find today's recovery log
  const todayRecovery = recoveryLogs.find((log) => log.date === today)

  // Find today's workout
  const todayWorkout = workouts.find((workout) => workout.date === today)

  // Calculate workout streak (simplified version)
  const workoutStreak = 5 // This would be calculated based on consecutive workout days

  // Update water intake from Firestore data
  useEffect(() => {
    if (todayNutrition) {
      setWaterIntake(todayNutrition.waterIntake || 0)
    }
  }, [todayNutrition])

  // Handle water intake change
  const handleWaterIntakeChange = async (newValue: number) => {
    setWaterIntake(newValue)
    try {
      await updateWaterIntake(today, newValue)
    } catch (error) {
      console.error("Error updating water intake:", error)
      // Revert to previous value on error
      setWaterIntake(todayNutrition?.waterIntake || 0)
    }
  }

  // Loading state
  if (workoutsLoading || nutritionLoading || recoveryLoading) {
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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {currentUser?.displayName || "Athlete"}! Let's crush your goals today
          </p>
        </div>
        <Button className="bg-gray-800 hover:bg-gray-700" onClick={() => router.push("/workouts/quick")}>
          <Plus className="mr-2 h-4 w-4" />
          Quick Workout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ReadinessScore score={todayRecovery?.readinessScore || 85} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <CardDescription>
              {waterIntake} / {waterGoal} glasses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Progress value={(waterIntake / waterGoal) * 100} className="h-2" />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleWaterIntakeChange(Math.max(0, waterIntake - 1))}
                >
                  -
                </Button>
                <Droplet className="h-6 w-6 text-blue-500" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleWaterIntakeChange(Math.min(waterGoal, waterIntake + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <CardDescription>{todayRecovery?.sleepHours || 7.5} hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Moon className="h-6 w-6 text-indigo-400" />
              <Progress value={todayRecovery?.sleepQuality ? todayRecovery.sleepQuality * 10 : 75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            <CardDescription>{workoutStreak} days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-green-500" />
              <Progress value={70} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Workout</h2>
            <Button variant="link" className="text-gray-400 hover:text-white" onClick={() => router.push("/workouts")}>
              View All
            </Button>
          </div>

          {todayWorkout ? (
            <WorkoutCard
              id={todayWorkout.id}
              title={todayWorkout.title}
              exercises={todayWorkout.exercises.map((ex) => `${ex.name}: ${ex.sets.length}×${ex.sets[0]?.reps || 0}`)}
              duration={todayWorkout.duration || 45}
              intensity={todayWorkout.intensity || "Moderate"}
            />
          ) : (
            <Card className="flex h-40 items-center justify-center border border-dashed border-gray-700 bg-transparent">
              <Button variant="outline" onClick={() => router.push("/workouts/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Plan Today's Workout
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Nutrition Today</h2>
            <Button variant="link" className="text-gray-400 hover:text-white" onClick={() => router.push("/nutrition")}>
              Log Meal
            </Button>
          </div>

          <NutritionSummary
            nutritionData={
              todayNutrition || {
                calories: { consumed: 0, goal: 2500 },
                protein: { consumed: 0, goal: 180 },
                carbs: { consumed: 0, goal: 250 },
                fat: { consumed: 0, goal: 80 },
                lastMeal: "",
              }
            }
          />
        </div>
      </div>
    </div>
  )
}

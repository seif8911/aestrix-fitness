"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronDown } from "lucide-react"

interface Exercise {
  name: string
  muscleGroup: string
  equipment: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description: string
  imageUrl: string
}

export function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("")

  const exercises: Exercise[] = [
    {
      name: "Barbell Bench Press",
      muscleGroup: "Chest",
      equipment: "Barbell",
      difficulty: "Intermediate",
      description:
        "Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width, lower the bar to your chest, then press back up.",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Pull-ups",
      muscleGroup: "Back",
      equipment: "Pull-up Bar",
      difficulty: "Intermediate",
      description:
        "Hang from a pull-up bar with palms facing away, pull your body up until your chin is over the bar, then lower back down with control.",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Squats",
      muscleGroup: "Legs",
      equipment: "Barbell",
      difficulty: "Intermediate",
      description:
        "Stand with feet shoulder-width apart, barbell across upper back, bend knees to lower your body, then return to standing.",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Dumbbell Shoulder Press",
      muscleGroup: "Shoulders",
      equipment: "Dumbbells",
      difficulty: "Intermediate",
      description:
        "Sit or stand with dumbbells at shoulder height, press weights overhead until arms are extended, then lower back to starting position.",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ]

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search exercises..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          Filter <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chest">Chest</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
          <TabsTrigger value="legs">Legs</TabsTrigger>
          <TabsTrigger value="shoulders">Shoulders</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredExercises.map((exercise, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-gray-900">
                    <img
                      src={exercise.imageUrl || "/placeholder.svg"}
                      alt={exercise.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-xs">{exercise.muscleGroup}</span>
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-xs">{exercise.equipment}</span>
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-xs">{exercise.difficulty}</span>
                  </div>
                  <p className="text-sm text-gray-400">{exercise.description}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      Add to Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Other tab contents would be similar but filtered by muscle group */}
      </Tabs>
    </div>
  )
}

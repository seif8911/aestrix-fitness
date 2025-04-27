"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Dumbbell, Flame } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkoutCardProps {
  id?: string
  title: string
  exercises: string[]
  duration: number
  intensity: "Light" | "Moderate" | "High"
}

export function WorkoutCard({ id, title, exercises, duration, intensity }: WorkoutCardProps) {
  const router = useRouter()

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

  const handleStartWorkout = () => {
    if (id) {
      router.push(`/workouts/${id}`)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-900 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Dumbbell className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {exercises.map((exercise, index) => (
            <li key={index} className="text-sm text-gray-300">
              • {exercise}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-800 bg-gray-900 px-6 py-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-gray-400" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center">
            <Flame className={`mr-1 h-4 w-4 ${getIntensityColor(intensity)}`} />
            <span>{intensity}</span>
          </div>
        </div>
        <Button size="sm" onClick={handleStartWorkout}>
          Start
        </Button>
      </CardFooter>
    </Card>
  )
}

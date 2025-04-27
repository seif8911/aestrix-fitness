"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplet } from "lucide-react"

interface WaterTrackerProps {
  waterIntake: number
  waterGoal: number
  onUpdate: (glasses: number) => void
}

export function WaterTracker({ waterIntake, waterGoal, onUpdate }: WaterTrackerProps) {
  const [localWaterIntake, setLocalWaterIntake] = useState(waterIntake)

  // Update local state when prop changes
  useEffect(() => {
    setLocalWaterIntake(waterIntake)
  }, [waterIntake])

  const handleWaterChange = (newValue: number) => {
    setLocalWaterIntake(newValue)
    onUpdate(newValue)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplet className="mr-2 h-5 w-5 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-3xl font-bold">
            {localWaterIntake} / {waterGoal}
          </p>
          <p className="text-sm text-gray-400">glasses (250ml)</p>
        </div>

        <Progress value={(localWaterIntake / waterGoal) * 100} className="h-2 mb-6" />

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: waterGoal }).map((_, index) => {
            const isFilled = index < localWaterIntake
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-12 p-0 ${isFilled ? "bg-blue-900/30 border-blue-700" : ""}`}
                onClick={() => handleWaterChange(index + 1)}
              >
                <Droplet className={`h-6 w-6 ${isFilled ? "text-blue-500" : "text-gray-600"}`} />
              </Button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWaterChange(Math.max(0, localWaterIntake - 1))}
            disabled={localWaterIntake === 0}
          >
            -1 Glass
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWaterChange(Math.min(waterGoal, localWaterIntake + 1))}
            disabled={localWaterIntake === waterGoal}
          >
            +1 Glass
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

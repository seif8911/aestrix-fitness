import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface NutritionData {
  calories?: { consumed: number; goal: number }
  protein?: { consumed: number; goal: number }
  carbs?: { consumed: number; goal: number }
  fat?: { consumed: number; goal: number }
  lastMeal?: string
}

interface NutritionSummaryProps {
  nutritionData: NutritionData
}

export function NutritionSummary({ nutritionData }: NutritionSummaryProps) {
  const calories = nutritionData.calories || { consumed: 0, goal: 2500 }
  const protein = nutritionData.protein || { consumed: 0, goal: 180 }
  const carbs = nutritionData.carbs || { consumed: 0, goal: 250 }
  const fat = nutritionData.fat || { consumed: 0, goal: 80 }
  const lastMeal = nutritionData.lastMeal || "No meals logged today"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Calories</span>
              <span className="text-sm text-gray-400">
                {calories.consumed} / {calories.goal} kcal
              </span>
            </div>
            <Progress value={(calories.consumed / calories.goal) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Protein</span>
                <span className="text-xs text-gray-400">{protein.consumed}g</span>
              </div>
              <Progress
                value={(protein.consumed / protein.goal) * 100}
                className="h-1.5 bg-gray-800"
                indicatorClassName="bg-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Carbs</span>
                <span className="text-xs text-gray-400">{carbs.consumed}g</span>
              </div>
              <Progress
                value={(carbs.consumed / carbs.goal) * 100}
                className="h-1.5 bg-gray-800"
                indicatorClassName="bg-green-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Fat</span>
                <span className="text-xs text-gray-400">{fat.consumed}g</span>
              </div>
              <Progress
                value={(fat.consumed / fat.goal) * 100}
                className="h-1.5 bg-gray-800"
                indicatorClassName="bg-yellow-500"
              />
            </div>
          </div>

          <div className="pt-2 text-center text-sm text-gray-400">Last meal: {lastMeal}</div>
        </div>
      </CardContent>
    </Card>
  )
}

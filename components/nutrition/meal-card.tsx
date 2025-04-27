import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Clock } from "lucide-react"

interface Meal {
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  items: string[]
}

interface MealCardProps {
  meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <h3 className="font-semibold">{meal.name}</h3>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="mr-1 h-3 w-3" />
            {meal.time}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between text-sm">
          <div>
            <p className="font-medium">{meal.calories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div>
            <p className="font-medium">{meal.protein}g</p>
            <p className="text-xs text-gray-400">Protein</p>
          </div>
          <div>
            <p className="font-medium">{meal.carbs}g</p>
            <p className="text-xs text-gray-400">Carbs</p>
          </div>
          <div>
            <p className="font-medium">{meal.fat}g</p>
            <p className="text-xs text-gray-400">Fat</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">{meal.items.join(", ")}</div>
      </CardContent>
    </Card>
  )
}

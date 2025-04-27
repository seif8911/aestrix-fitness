"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Loader2 } from "lucide-react"
import { MacroChart } from "@/components/nutrition/macro-chart"
import { MealCard } from "@/components/nutrition/meal-card"
import { WaterTracker } from "@/components/nutrition/water-tracker"
import { useNutrition } from "@/hooks/use-nutrition"
import { MealForm } from "@/components/nutrition/meal-form"

export function NutritionView() {
  const [activeTab, setActiveTab] = useState("today")
  const { nutritionLogs, loading, error, addMeal, updateWaterIntake } = useNutrition()
  const [showMealForm, setShowMealForm] = useState(false)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Find today's nutrition log
  const todayNutrition = nutritionLogs.find((log) => log.date === today)

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
        <p className="text-red-500">Error loading nutrition data: {error.message}</p>
      </div>
    )
  }

  const handleAddMeal = async (meal) => {
    await addMeal(today, meal)
    setShowMealForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nutrition</h1>
          <p className="text-gray-400">Track your meals and macros</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button size="sm" onClick={() => setShowMealForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Meal
          </Button>
        </div>
      </div>

      {showMealForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <MealForm onSubmit={handleAddMeal} onCancel={() => setShowMealForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="today" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="grocery-list">Grocery List</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <MacroChart
                      protein={todayNutrition?.totalProtein || 0}
                      carbs={todayNutrition?.totalCarbs || 0}
                      fat={todayNutrition?.totalFat || 0}
                    />
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Calories</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold">{todayNutrition?.totalCalories || 0}</p>
                          <p className="text-sm text-gray-400">/ 2,500 kcal</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Protein</p>
                          <p className="text-xl font-semibold">{todayNutrition?.totalProtein || 0}g</p>
                          <p className="text-xs text-gray-400">Goal: 180g</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Carbs</p>
                          <p className="text-xl font-semibold">{todayNutrition?.totalCarbs || 0}g</p>
                          <p className="text-xs text-gray-400">Goal: 250g</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fat</p>
                          <p className="text-xl font-semibold">{todayNutrition?.totalFat || 0}g</p>
                          <p className="text-xs text-gray-400">Goal: 80g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-6">
                <h2 className="text-xl font-semibold">Today's Meals</h2>
                {todayNutrition?.meals && todayNutrition.meals.length > 0 ? (
                  <div className="space-y-4">
                    {todayNutrition.meals.map((meal, index) => (
                      <MealCard key={index} meal={meal} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-700">
                    <p className="text-gray-500">No meals logged today. Click "Log Meal" to add one.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <WaterTracker
                waterIntake={todayNutrition?.waterIntake || 0}
                waterGoal={8}
                onUpdate={(glasses) => updateWaterIntake(today, glasses)}
              />

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Nutrition Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">•</span>
                      Try to consume protein within 30 minutes after your workout
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">•</span>
                      Aim for at least 5 servings of vegetables daily
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">•</span>
                      Stay hydrated - water helps with recovery and performance
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">•</span>
                      Consider timing carbs around your workouts for better energy
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="meal-plans">
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-700">
            <p className="text-gray-500">Meal plans coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="grocery-list">
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-700">
            <p className="text-gray-500">Grocery list coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

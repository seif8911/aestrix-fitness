"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { addNutritionLog, getNutritionLogs, getNutritionLog } from "@/lib/firebase/db-service"

export interface Meal {
  id: string
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  items: string[]
}

export interface NutritionLog {
  id?: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  waterIntake: number
  notes?: string
}

export const useNutrition = (days = 7) => {
  const { currentUser } = useAuth()
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchNutritionLogs = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const fetchedLogs = await getNutritionLogs(currentUser.uid, days)
      setNutritionLogs(fetchedLogs as NutritionLog[])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error("Error fetching nutrition logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchNutritionLogs()
    } else {
      setNutritionLogs([])
      setLoading(false)
    }
  }, [currentUser, days])

  const addMeal = async (date: string, meal: Meal) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      // Get existing log for the day or create a new one
      const existingLog = await getNutritionLog(currentUser.uid, date)

      let updatedLog: NutritionLog

      if (existingLog) {
        const meals = [...existingLog.meals, meal]

        // Recalculate totals
        const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
        const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0)
        const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0)
        const totalFat = meals.reduce((sum, m) => sum + m.fat, 0)

        updatedLog = {
          ...existingLog,
          meals,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
        }
      } else {
        updatedLog = {
          date,
          meals: [meal],
          totalCalories: meal.calories,
          totalProtein: meal.protein,
          totalCarbs: meal.carbs,
          totalFat: meal.fat,
          waterIntake: 0,
        }
      }

      await addNutritionLog(currentUser.uid, updatedLog)

      // Update state
      setNutritionLogs((prev) => {
        const exists = prev.some((log) => log.date === date)
        if (exists) {
          return prev.map((log) => (log.date === date ? updatedLog : log))
        } else {
          return [...prev, updatedLog]
        }
      })

      return updatedLog
    } catch (err) {
      console.error("Error adding meal:", err)
      throw err
    }
  }

  const updateWaterIntake = async (date: string, glasses: number) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      // Get existing log for the day or create a new one
      const existingLog = await getNutritionLog(currentUser.uid, date)

      let updatedLog: NutritionLog

      if (existingLog) {
        updatedLog = {
          ...existingLog,
          waterIntake: glasses,
        }
      } else {
        updatedLog = {
          date,
          meals: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          waterIntake: glasses,
        }
      }

      await addNutritionLog(currentUser.uid, updatedLog)

      // Update state
      setNutritionLogs((prev) => {
        const exists = prev.some((log) => log.date === date)
        if (exists) {
          return prev.map((log) => (log.date === date ? updatedLog : log))
        } else {
          return [...prev, updatedLog]
        }
      })

      return updatedLog
    } catch (err) {
      console.error("Error updating water intake:", err)
      throw err
    }
  }

  return {
    nutritionLogs,
    loading,
    error,
    addMeal,
    updateWaterIntake,
    refreshNutritionLogs: fetchNutritionLogs,
  }
}

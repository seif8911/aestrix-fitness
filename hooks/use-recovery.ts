"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { addRecoveryLog, getRecoveryLogs } from "@/lib/firebase/db-service"

export interface RecoveryLog {
  id?: string
  date: string
  sleepHours: number
  sleepQuality: number // 1-10
  soreness: number // 1-10
  fatigue: number // 1-10
  stress: number // 1-10
  mood: number // 1-10
  readinessScore?: number // Calculated field
  notes?: string
}

export const useRecovery = (days = 7) => {
  const { currentUser } = useAuth()
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecoveryLogs = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const fetchedLogs = await getRecoveryLogs(currentUser.uid, days)
      setRecoveryLogs(fetchedLogs as RecoveryLog[])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error("Error fetching recovery logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchRecoveryLogs()
    } else {
      setRecoveryLogs([])
      setLoading(false)
    }
  }, [currentUser, days])

  // Calculate readiness score based on recovery metrics
  const calculateReadinessScore = (log: RecoveryLog): number => {
    // Normalize sleep hours (assuming 8 hours is optimal)
    const sleepScore = Math.min((log.sleepHours / 8) * 10, 10)

    // Invert soreness and fatigue (lower is better for readiness)
    const sorenessScore = 10 - log.soreness
    const fatigueScore = 10 - log.fatigue
    const stressScore = 10 - log.stress

    // Mood is already on a 1-10 scale where higher is better
    const moodScore = log.mood

    // Sleep quality is already on a 1-10 scale where higher is better
    const sleepQualityScore = log.sleepQuality

    // Calculate weighted average
    const readinessScore =
      sleepScore * 0.3 +
      sleepQualityScore * 0.2 +
      sorenessScore * 0.15 +
      fatigueScore * 0.15 +
      stressScore * 0.1 +
      moodScore * 0.1

    // Return rounded score
    return Math.round(readinessScore)
  }

  const logRecovery = async (recoveryData: RecoveryLog) => {
    if (!currentUser) throw new Error("User not authenticated")

    try {
      // Calculate readiness score
      const readinessScore = calculateReadinessScore(recoveryData)
      const logWithScore = {
        ...recoveryData,
        readinessScore,
      }

      await addRecoveryLog(currentUser.uid, logWithScore)

      // Update state
      setRecoveryLogs((prev) => {
        const exists = prev.some((log) => log.date === recoveryData.date)
        if (exists) {
          return prev.map((log) => (log.date === recoveryData.date ? logWithScore : log))
        } else {
          return [...prev, logWithScore]
        }
      })

      return logWithScore
    } catch (err) {
      console.error("Error logging recovery:", err)
      throw err
    }
  }

  return {
    recoveryLogs,
    loading,
    error,
    logRecovery,
    refreshRecoveryLogs: fetchRecoveryLogs,
  }
}

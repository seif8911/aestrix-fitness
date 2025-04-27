
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { 
  getNutritionLog, 
  getWorkoutLog, 
  getWellnessLog 
} from '@/lib/firebase/db-service'

interface ActivitySummaryProps {
  date: Date
}

export function ActivitySummary({ date }: ActivitySummaryProps) {
  const { currentUser } = useAuth()
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      if (!currentUser) return

      setLoading(true)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      try {
        const [nutrition, workout, wellness] = await Promise.all([
          getNutritionLog(currentUser.uid, dateStr),
          getWorkoutLog(currentUser.uid, dateStr),
          getWellnessLog(currentUser.uid, dateStr)
        ])

        setSummary({ nutrition, workout, wellness })
      } catch (error) {
        console.error('Error fetching activity summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [currentUser, date])

  if (loading) return <div>Loading...</div>
  if (!summary) return <div>No activity found for this date</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Summary - {format(date, 'MMMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.workout && (
          <div>
            <h3 className="font-semibold">Workout</h3>
            <p>Type: {summary.workout.type}</p>
            <p>Duration: {summary.workout.duration} minutes</p>
          </div>
        )}

        {summary.nutrition && (
          <div>
            <h3 className="font-semibold">Nutrition</h3>
            <p>Calories: {summary.nutrition.totalCalories}</p>
            <p>Water: {summary.nutrition.waterIntake} glasses</p>
          </div>
        )}

        {summary.wellness && (
          <div>
            <h3 className="font-semibold">Wellness</h3>
            <p>Sleep: {summary.wellness.sleepHours} hours</p>
            <p>Mood: {summary.wellness.mood}/10</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

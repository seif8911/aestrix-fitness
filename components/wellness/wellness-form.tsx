
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Moon, Battery, Smile } from 'lucide-react'
import { addWellnessLog } from '@/lib/firebase/db-service'
import { useAuth } from '@/contexts/auth-context'

export function WellnessForm() {
  const { currentUser } = useAuth()
  const [sleepHours, setSleepHours] = useState(7)
  const [sleepQuality, setSleepQuality] = useState(5)
  const [fatigue, setFatigue] = useState(5)
  const [mood, setMood] = useState(5)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setSaving(true)
    try {
      await addWellnessLog(currentUser.uid, {
        date: new Date().toISOString().split('T')[0],
        sleepHours,
        sleepQuality,
        fatigue,
        mood,
      })
    } catch (error) {
      console.error('Error saving wellness log:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Wellness Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Sleep Duration (hours)</Label>
            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5" />
              <Input
                type="number"
                min="0"
                max="24"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sleep Quality (1-10)</Label>
            <Slider
              value={[sleepQuality]}
              onValueChange={(value) => setSleepQuality(value[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Fatigue Level (1-10)</Label>
            <Slider
              value={[fatigue]}
              onValueChange={(value) => setFatigue(value[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Mood (1-10)</Label>
            <Slider
              value={[mood]}
              onValueChange={(value) => setMood(value[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Wellness Log'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

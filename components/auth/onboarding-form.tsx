
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase-config"

export function OnboardingForm() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    goal: "build_muscle",
    activityLevel: "moderate",
    gender: "prefer_not_to_say"
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    try {
      // Calculate BMR and TDEE
      const weight = parseFloat(formData.weight)
      const height = parseFloat(formData.height)
      const age = parseInt(formData.age)
      
      let bmr = 0
      if (formData.gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      } else if (formData.gender === "female") {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
      } else {
        // Use average for non-binary/prefer not to say
        bmr = (88.362 + 447.593) / 2 + (11.322 * weight) + (3.949 * height) - (5.004 * age)
      }

      // Activity level multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very_active: 1.725,
        extra_active: 1.9
      }

      const tdee = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers]

      // Set nutritional goals based on user's goal
      let calorieGoal = tdee
      let proteinGoal = weight * 2 // 2g per kg
      let carbGoal = 0
      let fatGoal = 0

      switch (formData.goal) {
        case "build_muscle":
          calorieGoal = tdee + 500
          carbGoal = (calorieGoal * 0.4) / 4 // 40% of calories from carbs
          fatGoal = (calorieGoal * 0.3) / 9 // 30% of calories from fat
          break
        case "lose_fat":
          calorieGoal = tdee - 500
          carbGoal = (calorieGoal * 0.35) / 4 // 35% of calories from carbs
          fatGoal = (calorieGoal * 0.25) / 9 // 25% of calories from fat
          break
        case "maintain":
          carbGoal = (calorieGoal * 0.45) / 4 // 45% of calories from carbs
          fatGoal = (calorieGoal * 0.3) / 9 // 30% of calories from fat
          break
      }

      // Save user profile
      await setDoc(doc(db, "users", currentUser.uid), {
        profile: {
          ...formData,
          completedOnboarding: true
        },
        nutritionGoals: {
          calories: Math.round(calorieGoal),
          protein: Math.round(proteinGoal),
          carbs: Math.round(carbGoal),
          fat: Math.round(fatGoal)
        }
      }, { merge: true })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Fitness Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              required
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              required
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non_binary">Non-binary</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Primary Goal</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="build_muscle">Build Muscle</SelectItem>
                <SelectItem value="lose_fat">Lose Fat</SelectItem>
                <SelectItem value="maintain">Maintain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                <SelectItem value="light">Light Exercise (1-2 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate Exercise (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extra_active">Extra Active (athlete)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

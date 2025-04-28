
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";

interface OnboardingFormData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  fitnessGoal: string;
}

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    weight: "",
    height: "",
    age: "",
    gender: "prefer_not_to_say",
    activityLevel: "moderate",
    fitnessGoal: "maintain",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate BMR and TDEE
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      const age = parseInt(formData.age);
      
      let bmr = 0;
      if (formData.gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else if (formData.gender === "female") {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      } else {
        // Use average for non-binary/prefer not to say
        bmr = (88.362 + 447.593) / 2 + (11.322 * weight) + (3.949 * height) - (5.004 * age);
      }

      // Activity level multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very_active: 1.725,
        extra_active: 1.9
      };

      const tdee = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];

      // Set nutritional goals based on user's goal
      let calorieGoal = tdee;
      let proteinGoal = weight * 2; // 2g per kg
      let carbGoal = 0;
      let fatGoal = 0;

      switch (formData.fitnessGoal) {
        case "lose":
          calorieGoal *= 0.8; // 20% deficit
          carbGoal = (calorieGoal * 0.35) / 4; // 35% of calories from carbs
          fatGoal = (calorieGoal * 0.35) / 9; // 35% of calories from fat
          break;
        case "maintain":
          carbGoal = (calorieGoal * 0.4) / 4; // 40% of calories from carbs
          fatGoal = (calorieGoal * 0.3) / 9; // 30% of calories from fat
          break;
        case "gain":
          calorieGoal *= 1.1; // 10% surplus
          carbGoal = (calorieGoal * 0.45) / 4; // 45% of calories from carbs
          fatGoal = (calorieGoal * 0.25) / 9; // 25% of calories from fat
          break;
      }

      // Save user profile to Firestore
      await setDoc(doc(db, "users", userId), {
        profile: {
          ...formData,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
        },
        nutrition: {
          calorieGoal: Math.round(calorieGoal),
          proteinGoal: Math.round(proteinGoal),
          carbGoal: Math.round(carbGoal),
          fatGoal: Math.round(fatGoal),
          waterGoal: 8, // Default 8 glasses
        },
        onboardingCompleted: true,
        createdAt: new Date(),
      });

      toast({
        title: "Profile created!",
        description: "Welcome to your fitness journey.",
      });

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extra_active">Extra Active (very intense exercise)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Select
              value={formData.fitnessGoal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Profile..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

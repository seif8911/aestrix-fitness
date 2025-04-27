"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface MealFormProps {
  onSubmit: (meal: any) => void
  onCancel: () => void
}

export function MealForm({ onSubmit, onCancel }: MealFormProps) {
  const [meal, setMeal] = useState({
    id: uuidv4(),
    name: "",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: [""],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMeal((prev) => ({
      ...prev,
      [name]:
        name === "calories" || name === "protein" || name === "carbs" || name === "fat"
          ? Number.parseInt(value) || 0
          : value,
    }))
  }

  const addFoodItem = () => {
    setMeal((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }))
  }

  const removeFoodItem = (index: number) => {
    setMeal((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateFoodItem = (index: number, value: string) => {
    setMeal((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!meal.name) {
      alert("Please enter a meal name")
      return
    }

    // Filter out empty food items
    const filteredItems = meal.items.filter((item) => item.trim() !== "")

    if (filteredItems.length === 0) {
      alert("Please add at least one food item")
      return
    }

    onSubmit({
      ...meal,
      items: filteredItems,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Meal Name</Label>
          <Input
            id="name"
            name="name"
            value={meal.name}
            onChange={handleChange}
            placeholder="e.g., Breakfast, Lunch, Snack"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" value={meal.time} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            name="calories"
            type="number"
            min="0"
            value={meal.calories}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protein">Protein (g)</Label>
          <Input
            id="protein"
            name="protein"
            type="number"
            min="0"
            value={meal.protein}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbs">Carbs (g)</Label>
          <Input id="carbs" name="carbs" type="number" min="0" value={meal.carbs} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fat">Fat (g)</Label>
          <Input id="fat" name="fat" type="number" min="0" value={meal.fat} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Food Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFoodItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {meal.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item}
                onChange={(e) => updateFoodItem(index, e.target.value)}
                placeholder="e.g., Chicken Breast, Brown Rice"
              />
              {meal.items.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFoodItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Meal</Button>
      </div>
    </form>
  )
}

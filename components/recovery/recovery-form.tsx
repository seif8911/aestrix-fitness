"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import type { RecoveryLog } from "@/hooks/use-recovery"

interface RecoveryFormProps {
  initialData?: RecoveryLog
  onSubmit: (data: RecoveryLog) => void
  onCancel: () => void
}

export function RecoveryForm({ initialData, onSubmit, onCancel }: RecoveryFormProps) {
  const [formData, setFormData] = useState<Partial<RecoveryLog>>(
    initialData || {
      sleepHours: 7,
      sleepQuality: 7,
      soreness: 5,
      fatigue: 5,
      stress: 5,
      mood: 7,
      notes: "",
    },
  )

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      formData.sleepHours === undefined ||
      formData.sleepQuality === undefined ||
      formData.soreness === undefined ||
      formData.fatigue === undefined ||
      formData.stress === undefined ||
      formData.mood === undefined
    ) {
      alert("Please fill in all required fields")
      return
    }

    onSubmit(formData as RecoveryLog)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sleepHours">Sleep Duration (hours)</Label>
          <Input
            id="sleepHours"
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => handleChange("sleepHours", Number.parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sleepQuality">Sleep Quality (1-10)</Label>
          <div className="pt-2">
            <Slider
              id="sleepQuality"
              min={1}
              max={10}
              step={1}
              value={[formData.sleepQuality || 5]}
              onValueChange={(value) => handleChange("sleepQuality", value[0])}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Poor</span>
              <span>{formData.sleepQuality}</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="soreness">Muscle Soreness (1-10)</Label>
          <div className="pt-2">
            <Slider
              id="soreness"
              min={1}
              max={10}
              step={1}
              value={[formData.soreness || 5]}
              onValueChange={(value) => handleChange("soreness", value[0])}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>None</span>
              <span>{formData.soreness}</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatigue">Fatigue Level (1-10)</Label>
          <div className="pt-2">
            <Slider
              id="fatigue"
              min={1}
              max={10}
              step={1}
              value={[formData.fatigue || 5]}
              onValueChange={(value) => handleChange("fatigue", value[0])}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Energized</span>
              <span>{formData.fatigue}</span>
              <span>Exhausted</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stress">Stress Level (1-10)</Label>
          <div className="pt-2">
            <Slider
              id="stress"
              min={1}
              max={10}
              step={1}
              value={[formData.stress || 5]}
              onValueChange={(value) => handleChange("stress", value[0])}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Relaxed</span>
              <span>{formData.stress}</span>
              <span>Very Stressed</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood">Mood (1-10)</Label>
          <div className="pt-2">
            <Slider
              id="mood"
              min={1}
              max={10}
              step={1}
              value={[formData.mood || 5]}
              onValueChange={(value) => handleChange("mood", value[0])}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>{formData.mood}</span>
              <span>Great</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any additional notes about your recovery..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Recovery Log</Button>
      </div>
    </form>
  )
}

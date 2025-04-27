"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StrengthChartProps {
  prs: any[]
}

export function StrengthChart({ prs }: StrengthChartProps) {
  // Process PRs data for the chart
  const processedData = () => {
    // Get unique dates
    const dates = [...new Set(prs.map((pr) => pr.date))].sort()

    // Create data points for each date
    return dates.map((date) => {
      const dataPoint: any = { date }

      // Find PRs for this date
      prs.forEach((pr) => {
        if (pr.date === date) {
          dataPoint[pr.exercise.toLowerCase()] = pr.weight
        }
      })

      return dataPoint
    })
  }

  const data = processedData()

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No strength data available yet. Complete workouts to track your progress.
      </div>
    )
  }

  // Get unique exercises
  const exercises = [...new Set(prs.map((pr) => pr.exercise.toLowerCase()))]

  return (
    <ChartContainer
      config={{
        bench: {
          label: "Bench Press",
          color: "hsl(var(--chart-1))",
        },
        squat: {
          label: "Squat",
          color: "hsl(var(--chart-2))",
        },
        deadlift: {
          label: "Deadlift",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {exercises.map((exercise, index) => (
            <Line
              key={exercise}
              type="monotone"
              dataKey={exercise}
              stroke={`var(--color-${exercise})`}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

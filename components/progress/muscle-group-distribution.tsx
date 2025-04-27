"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface MuscleGroupDistributionProps {
  data: { name: string; value: number }[]
}

export function MuscleGroupDistribution({ data }: MuscleGroupDistributionProps) {
  // Filter out zero values
  const filteredData = data.filter((item) => item.value > 0)

  // If no data, show placeholder
  if (filteredData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No muscle group data available yet. Complete workouts to track your distribution.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        chest: {
          label: "Chest",
          color: "hsl(var(--chart-1))",
        },
        back: {
          label: "Back",
          color: "hsl(var(--chart-2))",
        },
        legs: {
          label: "Legs",
          color: "hsl(var(--chart-3))",
        },
        shoulders: {
          label: "Shoulders",
          color: "hsl(var(--chart-4))",
        },
        arms: {
          label: "Arms",
          color: "hsl(var(--chart-5))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase()})`} />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

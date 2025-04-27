"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface MacroChartProps {
  protein: number
  carbs: number
  fat: number
}

export function MacroChart({ protein, carbs, fat }: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein, color: "#3b82f6" },
    { name: "Carbs", value: carbs, color: "#22c55e" },
    { name: "Fat", value: fat, color: "#eab308" },
  ].filter((item) => item.value > 0)

  // If no data, show placeholder
  if (data.length === 0 || (protein === 0 && carbs === 0 && fat === 0)) {
    return <div className="flex h-[200px] items-center justify-center text-gray-500">No nutrition data available</div>
  }

  return (
    <ChartContainer
      config={{
        protein: {
          label: "Protein",
          color: "hsl(var(--chart-1))",
        },
        carbs: {
          label: "Carbs",
          color: "hsl(var(--chart-2))",
        },
        fat: {
          label: "Fat",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[200px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase()})`} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

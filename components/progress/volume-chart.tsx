"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface VolumeChartProps {
  volumeData: { date: string; volume: number }[]
}

export function VolumeChart({ volumeData }: VolumeChartProps) {
  // Sort data by date
  const sortedData = [...volumeData].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Format data for chart
  const data = sortedData.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume: item.volume,
  }))

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No volume data available yet. Complete workouts to track your progress.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        volume: {
          label: "Volume (lbs)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" stroke="#666" />
          <YAxis stroke="#666" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

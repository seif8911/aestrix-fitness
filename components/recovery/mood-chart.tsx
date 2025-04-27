"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RecoveryLog } from "@/hooks/use-recovery"

interface MoodChartProps {
  recoveryLogs: RecoveryLog[]
}

export function MoodChart({ recoveryLogs }: MoodChartProps) {
  // Sort logs by date
  const sortedLogs = [...recoveryLogs].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Format data for chart
  const data = sortedLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: log.mood,
    stress: log.stress,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No mood data available. Start logging your recovery to see trends.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        mood: {
          label: "Mood",
          color: "hsl(var(--chart-1))",
        },
        stress: {
          label: "Stress",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" domain={[0, 10]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="stress" stroke="var(--color-stress)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

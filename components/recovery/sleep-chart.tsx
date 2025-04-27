"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RecoveryLog } from "@/hooks/use-recovery"

interface SleepChartProps {
  recoveryLogs: RecoveryLog[]
}

export function SleepChart({ recoveryLogs }: SleepChartProps) {
  // Sort logs by date
  const sortedLogs = [...recoveryLogs].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Format data for chart
  const data = sortedLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hours: log.sleepHours,
    quality: log.sleepQuality,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No sleep data available. Start logging your recovery to see trends.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        hours: {
          label: "Sleep Hours",
          color: "hsl(var(--chart-1))",
        },
        quality: {
          label: "Sleep Quality",
          color: "hsl(var(--chart-2))",
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
          <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="quality" stroke="var(--color-quality)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

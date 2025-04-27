"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RecoveryLog } from "@/hooks/use-recovery"

interface ReadinessChartProps {
  recoveryLogs: RecoveryLog[]
}

export function ReadinessChart({ recoveryLogs }: ReadinessChartProps) {
  // Sort logs by date
  const sortedLogs = [...recoveryLogs].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Format data for chart
  const data = sortedLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    readiness: log.readinessScore,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No readiness data available. Start logging your recovery to see trends.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        readiness: {
          label: "Readiness Score",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="readiness" stroke="var(--color-readiness)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

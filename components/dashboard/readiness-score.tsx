import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ReadinessScoreProps {
  score: number
}

export function ReadinessScore({ score }: ReadinessScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getRecommendation = (score: number) => {
    if (score >= 80) return "Ready for high intensity"
    if (score >= 60) return "Moderate training advised"
    return "Focus on recovery today"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
        <CardDescription>{getRecommendation(score)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={cn("text-2xl font-bold", getScoreColor(score))}>{score}%</div>
          <div className="h-10 w-10 rounded-full border-2 border-gray-700 p-1">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(${score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444"} ${score}%, transparent 0)`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

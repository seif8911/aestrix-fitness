import { AppShell } from "@/components/layout/app-shell"
import { WorkoutDetail } from "@/components/workouts/workout-detail"

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <WorkoutDetail id={params.id} />
    </AppShell>
  )
}

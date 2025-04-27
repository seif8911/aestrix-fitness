"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Loader2 } from "lucide-react"
import { useRecovery } from "@/hooks/use-recovery"
import { RecoveryForm } from "@/components/recovery/recovery-form"
import { SleepChart } from "@/components/recovery/sleep-chart"
import { MoodChart } from "@/components/recovery/mood-chart"
import { ReadinessChart } from "@/components/recovery/readiness-chart"

export function RecoveryView() {
  const [activeTab, setActiveTab] = useState("overview")
  const { recoveryLogs, loading, error, logRecovery } = useRecovery()
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Find today's recovery log
  const todayRecovery = recoveryLogs.find((log) => log.date === today)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error loading recovery data: {error.message}</p>
      </div>
    )
  }

  const handleLogRecovery = async (recoveryData) => {
    await logRecovery({
      ...recoveryData,
      date: today,
    })
    setShowRecoveryForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recovery</h1>
          <p className="text-gray-400">Track your sleep, mood, and recovery</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button size="sm" onClick={() => setShowRecoveryForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Recovery
          </Button>
        </div>
      </div>

      {showRecoveryForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <RecoveryForm
              initialData={todayRecovery}
              onSubmit={handleLogRecovery}
              onCancel={() => setShowRecoveryForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mood">Mood & Stress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                {todayRecovery ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Sleep</p>
                        <p className="text-2xl font-bold">{todayRecovery.sleepHours} hrs</p>
                        <div className="mt-1 flex items-center">
                          <p className="text-xs text-gray-400">Quality: {todayRecovery.sleepQuality}/10</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Readiness</p>
                        <p className="text-2xl font-bold">{todayRecovery.readinessScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mood</p>
                        <p className="text-2xl font-bold">{todayRecovery.mood}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Stress</p>
                        <p className="text-2xl font-bold">{todayRecovery.stress}/10</p>
                      </div>
                    </div>
                    {todayRecovery.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-gray-400">{todayRecovery.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <Button onClick={() => setShowRecoveryForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Log Today's Recovery
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Readiness Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ReadinessChart recoveryLogs={recoveryLogs} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recovery Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-gray-900 p-4">
                    <h3 className="mb-2 font-semibold">Sleep Optimization</h3>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Aim for 7-9 hours of sleep</li>
                      <li>• Keep a consistent sleep schedule</li>
                      <li>• Avoid screens 1 hour before bed</li>
                      <li>• Keep your bedroom cool and dark</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <h3 className="mb-2 font-semibold">Stress Management</h3>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Practice deep breathing</li>
                      <li>• Try meditation or yoga</li>
                      <li>• Take regular breaks during work</li>
                      <li>• Spend time in nature</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <h3 className="mb-2 font-semibold">Active Recovery</h3>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Light walking or swimming</li>
                      <li>• Foam rolling and stretching</li>
                      <li>• Contrast therapy (hot/cold)</li>
                      <li>• Proper hydration and nutrition</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sleep" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <SleepChart recoveryLogs={recoveryLogs} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mood" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Stress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodChart recoveryLogs={recoveryLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

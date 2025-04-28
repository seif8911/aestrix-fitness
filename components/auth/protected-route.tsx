
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push("/login")
      } else if (!currentUser.profile?.completedOnboarding && pathname !== "/onboarding") {
        router.push("/onboarding")
      } else {
        setShouldRender(true)
      }
    }
  }, [currentUser, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return shouldRender ? <>{children}</> : null
}

"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { logoutUser } from "@/lib/firebase/auth-service"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useMobile()
  const { currentUser } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col bg-black text-white">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 px-4 md:px-6">
          <h1 className="text-xl font-bold tracking-tight">AESTRIX</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">{currentUser?.displayName || "User"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Navigation />}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    </ProtectedRoute>
  )
}

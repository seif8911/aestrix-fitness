"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Dumbbell, Home, Utensils, Moon } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Utensils },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Recovery", href: "/recovery", icon: Moon },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-800 bg-gray-950 px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn("flex flex-col items-center justify-center", isActive ? "text-white" : "text-gray-500")}
          >
            <Icon className="h-6 w-6" />
            <span className="mt-1 text-xs">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

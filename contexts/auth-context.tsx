"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChangedListener } from "@/lib/firebase/auth-service"
import { getUserProfile } from "@/lib/firebase/db-service"

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt?: any
  lastLogin?: any
  [key: string]: any
}

interface AuthContextType {
  currentUser: User | null
  userData: UserData | null
  isLoading: boolean
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid)
          setUserData(userProfile as UserData)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    isLoading,
    setUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

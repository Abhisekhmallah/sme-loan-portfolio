"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "analyst" | "viewer"
  avatar?: string
  department: string
  lastLogin: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

interface SignupData {
  name: string
  email: string
  password: string
  department: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@hdfc.com": {
    password: "admin123",
    user: {
      id: "usr_001",
      email: "admin@hdfc.com",
      name: "Priya Sharma",
      role: "admin",
      department: "SME Loans",
      lastLogin: new Date(),
    },
  },
  "analyst@hdfc.com": {
    password: "analyst123",
    user: {
      id: "usr_002",
      email: "analyst@hdfc.com",
      name: "Rahul Verma",
      role: "analyst",
      department: "Credit Analysis",
      lastLogin: new Date(),
    },
  },
  "demo@hdfc.com": {
    password: "demo123",
    user: {
      id: "usr_003",
      email: "demo@hdfc.com",
      name: "Demo User",
      role: "viewer",
      department: "Operations",
      lastLogin: new Date(),
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("sme_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("sme_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoUser = DEMO_USERS[email.toLowerCase()]
    if (demoUser && demoUser.password === password) {
      const loggedInUser = { ...demoUser.user, lastLogin: new Date() }
      setUser(loggedInUser)
      localStorage.setItem("sme_user", JSON.stringify(loggedInUser))
      setIsLoading(false)
      return { success: true }
    }

    // Check localStorage for signed up users
    const signedUpUsers = JSON.parse(localStorage.getItem("sme_signups") || "{}")
    if (signedUpUsers[email.toLowerCase()]?.password === password) {
      const loggedInUser = { ...signedUpUsers[email.toLowerCase()].user, lastLogin: new Date() }
      setUser(loggedInUser)
      localStorage.setItem("sme_user", JSON.stringify(loggedInUser))
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid email or password" }
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const email = data.email.toLowerCase()

    // Check if user exists
    if (DEMO_USERS[email]) {
      setIsLoading(false)
      return { success: false, error: "Email already registered" }
    }

    const signedUpUsers = JSON.parse(localStorage.getItem("sme_signups") || "{}")
    if (signedUpUsers[email]) {
      setIsLoading(false)
      return { success: false, error: "Email already registered" }
    }

    // Create new user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: email,
      name: data.name,
      role: "viewer",
      department: data.department,
      lastLogin: new Date(),
    }

    signedUpUsers[email] = { password: data.password, user: newUser }
    localStorage.setItem("sme_signups", JSON.stringify(signedUpUsers))
    setUser(newUser)
    localStorage.setItem("sme_user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sme_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: "student" | "admin"
  avatar?: string
  join_date: string
  last_active: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<UserProfile>
  register: (name: string, email: string, phone: string, password: string) => Promise<UserProfile>
  logout: () => Promise<void>
}

// Local storage keys
const USER_KEY = "study_buddy_user"
const USERS_KEY = "study_buddy_users"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current user from localStorage
        const userJson = localStorage.getItem(USER_KEY)

        if (userJson) {
          const currentUser = JSON.parse(userJson)
          setUser(currentUser)

          // Update last active timestamp
          const updatedUser = {
            ...currentUser,
            last_active: new Date().toISOString(),
          }
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  // Protect routes that require authentication
  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ["/account"]
      const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route))

      if (isProtectedRoute && !user) {
        // Store the current path before redirecting
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_redirect", pathname || "/account")
        }
        // Redirect to login if trying to access protected route without authentication
        router.push("/login")
      }
    }
  }, [isLoading, user, pathname, router])

  // Login function
  const login = async (email: string, password: string): Promise<UserProfile> => {
    try {
      // Get users from localStorage
      const usersJson = localStorage.getItem(USERS_KEY)
      const users = usersJson ? JSON.parse(usersJson) : []

      // Find user by email and password
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = foundUser

      // Update last active timestamp
      const updatedUser = {
        ...userWithoutPassword,
        last_active: new Date().toISOString(),
      }

      // Store user in localStorage and state
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Redirect to dashboard or saved redirect path
      const redirectPath = localStorage.getItem("auth_redirect") || "/"
      localStorage.removeItem("auth_redirect")
      router.push(redirectPath)

      return updatedUser
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  // Register function
  const register = async (name: string, email: string, phone: string, password: string): Promise<UserProfile> => {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error("Name, email and password are required")
      }

      // Get existing users from localStorage
      const usersJson = localStorage.getItem(USERS_KEY)
      const users = usersJson ? JSON.parse(usersJson) : []

      // Check if email already exists
      const emailExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())

      if (emailExists) {
        throw new Error("EMAIL_IN_USE")
      }

      // Create new user
      const now = new Date().toISOString()
      const newUser = {
        id: uuidv4(),
        name,
        email,
        phone,
        password, // Note: In a real app, you'd hash this password
        role: "student",
        avatar: "/placeholder.svg?height=40&width=40",
        join_date: now,
        last_active: now,
      }

      // Add to users array and save to localStorage
      users.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = newUser

      // Store current user in localStorage and state
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      // Redirect to dashboard
      router.push("/")

      return userWithoutPassword
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Remove user from localStorage
      localStorage.removeItem(USER_KEY)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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

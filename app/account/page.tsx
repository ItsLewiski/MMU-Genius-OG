"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { PageLayout } from "@/components/layout/page-layout"
import { AccountPage } from "@/components/account/account-page"
import { getUserActivities, getUserGoals } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"

export default function Account() {
  const { user, isLoading: authLoading } = useAuth()
  const [activities, setActivities] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load user activities and goals from localStorage
          const [userActivities, userGoals] = await Promise.all([getUserActivities(user.id), getUserGoals(user.id)])

          setActivities(userActivities)
          setGoals(userGoals)
        } catch (error) {
          console.error("Error loading user data:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (!authLoading) {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user, authLoading])

  if (authLoading || isLoading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Account</h1>
          <p>Please log in to view your account.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <AccountPage
        user={user}
        summaries={activities.filter((a) => a.type === "summary")}
        flashcards={activities.filter((a) => a.type === "flashcards")}
        goals={goals}
      />
    </PageLayout>
  )
}

"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserActivity, StudyGoal } from "@/types/auth"
import { getUserActivities, getUserGoals, saveUserGoal, updateUserGoal, deleteUserGoal } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import { migrateUserDataToSupabase } from "@/lib/migrate-to-supabase"
import {
  LogOut,
  FileText,
  FlashlightIcon,
  HelpCircle,
  BarChart,
  Plus,
  Menu,
  CreditCard,
  Home,
  TrendingUp,
  CheckCircle2,
  ListChecks,
  User,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProgressGraph } from "@/components/account/progress-graph"
import { SummariesView } from "@/components/account/summaries-view"
import { FlashcardsView } from "@/components/account/flashcards-view"
import { StudyPlanner } from "@/components/account/study-planner"
import { ProgressView } from "@/components/account/progress-view"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [userScore, setUserScore] = useState(0)
  const [userProgress, setUserProgress] = useState(0)
  const [visitCount, setVisitCount] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [progressHistory, setProgressHistory] = useState<{ date: string; value: number }[]>([])
  const [goals, setGoals] = useState<StudyGoal[]>([])
  const [completedGoals, setCompletedGoals] = useState(0)
  const sheetTriggerRef = useRef<HTMLButtonElement>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Attempt to migrate data from localStorage to Supabase
        await migrateUserDataToSupabase(user.id)

        // Get user activities from Supabase
        const userActivities = await getUserActivities(user.id)
        setActivities(userActivities)

        // Get user goals from Supabase
        const userGoals = await getUserGoals(user.id)
        setGoals(userGoals)
        setCompletedGoals(userGoals.filter((goal) => goal.completed).length)

        // Load user score and progress from Supabase
        // This would be handled by the auth context in a full implementation

        // For demo purposes, generate some progress history
        const demoHistory = generateDemoProgressHistory()
        setProgressHistory(demoHistory)

        // Set a demo score based on activities and goals
        const calculatedScore = calculateScore(userActivities.length, 5, userGoals.filter((g) => g.completed).length)
        setUserScore(calculatedScore)
        setUserProgress(Math.min(calculatedScore, 100))
        setVisitCount(5 + Math.floor(Math.random() * 10)) // Random visit count for demo
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchData()
  }, [user])

  // Generate demo progress history for visualization
  const generateDemoProgressHistory = () => {
    const history = []
    const now = new Date()

    for (let i = 30; i >= 0; i -= 5) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Generate a somewhat increasing trend with some randomness
      const baseValue = 30 + (30 - i) * 2
      const randomVariation = Math.floor(Math.random() * 10) - 5
      const value = Math.min(Math.max(baseValue + randomVariation, 0), 100)

      history.push({
        date: date.toISOString(),
        value,
      })
    }

    return history
  }

  // Calculate score based on activities, visits, and completed goals
  const calculateScore = (activitiesCount: number, visits: number, completedGoals: number) => {
    // Scoring formula: 5 points per activity + 2 points per visit + 3 points per completed goal
    const score = Math.min(activitiesCount * 5 + visits * 2 + completedGoals * 3, 100)
    return score
  }

  const handleLogout = () => {
    setShowLogoutDialog(false)
    logout()
    router.push("/login")
  }

  const handleGoalToggle = async (goalId: string, completed: boolean) => {
    if (!user) return

    try {
      // Update goal in Supabase
      await updateUserGoal(user.id, goalId, { completed })

      // Update state
      const updatedGoals = goals.map((goal) => (goal.id === goalId ? { ...goal, completed } : goal))
      setGoals(updatedGoals)

      // Update completed goals count
      const newCompletedGoals = updatedGoals.filter((goal) => goal.completed).length
      setCompletedGoals(newCompletedGoals)

      // Update user score
      const newScore = calculateScore(activities.length, visitCount, newCompletedGoals)
      setUserScore(newScore)
      setUserProgress(newScore) // Set the same value for both score and progress

      // Update progress history to include the latest score
      const now = new Date().toISOString()
      const updatedHistory = [...progressHistory]

      // If the last entry is from today, update it
      if (updatedHistory.length > 0) {
        const lastEntry = updatedHistory[updatedHistory.length - 1]
        const lastDate = new Date(lastEntry.date).toDateString()
        const today = new Date().toDateString()

        if (lastDate === today) {
          updatedHistory[updatedHistory.length - 1] = {
            date: now,
            value: newScore,
          }
        } else {
          // Add a new entry for today
          updatedHistory.push({
            date: now,
            value: newScore,
          })
        }
      } else {
        // If no history exists, add the first entry
        updatedHistory.push({
          date: now,
          value: newScore,
        })
      }

      setProgressHistory(updatedHistory)
    } catch (error) {
      console.error("Error toggling goal:", error)
    }
  }

  const handleAddGoal = async (title: string, dueDate?: string) => {
    if (!user) return

    try {
      // Create new goal in Supabase
      const newGoal = await saveUserGoal(user.id, title, dueDate)

      // Update goals in state
      setGoals([...goals, newGoal])
    } catch (error) {
      console.error("Error adding goal:", error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return

    try {
      // Delete goal from Supabase
      await deleteUserGoal(user.id, goalId)

      // Update goals in state
      const updatedGoals = goals.filter((goal) => goal.id !== goalId)
      setGoals(updatedGoals)

      // Update completed goals count
      const newCompletedGoals = updatedGoals.filter((goal) => goal.completed).length
      setCompletedGoals(newCompletedGoals)

      // Update user score
      const newScore = calculateScore(activities.length, visitCount, newCompletedGoals)
      setUserScore(newScore)
      setUserProgress(Math.min(newScore, 100))
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  if (!user) {
    return <div className="container py-8 flex items-center justify-center">Loading...</div>
  }

  // Group activities by type
  const summaries = activities.filter((a) => a.type === "summary")
  const flashcards = activities.filter((a) => a.type === "flashcards")
  const questions = activities.filter((a) => a.type === "qa")

  // Calculate stats with changes from "last week"
  const totalSummaries = summaries.length
  const totalFlashcards = flashcards.length
  const totalStudySessions = Math.ceil(activities.length / 2) // Just an example calculation

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get next study session time (for demo purposes)
  const getNextSessionTime = () => {
    const now = new Date()
    const hours = now.getHours()
    return hours < 16 ? "Today at 4:00 PM" : "Tomorrow at 10:00 AM"
  }

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: "account-info",
      label: "Account Information",
      icon: <User className="h-5 w-5" />,
      href: "#",
      active: activeTab === "account-info",
      onClick: () => setActiveTab("account-info"),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "#",
      active: activeTab === "overview",
      onClick: () => {
        setActiveTab("overview")
        // Force re-render of the overview content
        if (activeTab === "overview") {
          const currentTab = activeTab
          setActiveTab("")
          setTimeout(() => setActiveTab(currentTab), 10)
        }
      },
    },
    {
      id: "summaries",
      label: "Summaries",
      icon: <FileText className="h-5 w-5" />,
      href: "#",
      active: activeTab === "summaries",
      count: totalSummaries,
      onClick: () => setActiveTab("summaries"),
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: <FlashlightIcon className="h-5 w-5" />,
      href: "#",
      active: activeTab === "flashcards",
      count: totalFlashcards,
      onClick: () => setActiveTab("flashcards"),
    },
    {
      id: "planner",
      label: "Study Planner",
      icon: <ListChecks className="h-5 w-5" />,
      href: "#",
      active: activeTab === "planner",
      count: goals.length,
      onClick: () => setActiveTab("planner"),
    },
    {
      id: "progress",
      label: "Progress",
      icon: <BarChart className="h-5 w-5" />,
      href: "#",
      active: activeTab === "progress",
      onClick: () => setActiveTab("progress"),
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <CreditCard className="h-5 w-5" />,
      href: "#",
      active: activeTab === "subscription",
      onClick: () => setActiveTab("subscription"),
    },
  ]

  // Sidebar component for both desktop and mobile
  const SidebarContent = () => (
    <div className="space-y-2">
      {sidebarItems.map((item) => (
        <Card
          key={item.id}
          className={`${item.active ? "border-l-4 border-l-study-purple" : "hover:bg-muted/50"} transition-colors cursor-pointer`}
          onClick={() => {
            if (item.href === "#" && item.onClick) {
              item.onClick()
              // This will close the sheet on mobile when an item is clicked
              if (sheetTriggerRef.current) {
                const sheet = sheetTriggerRef.current.closest('[data-state="open"]')
                if (sheet) {
                  const closeButton = sheet.querySelector("[data-radix-collection-item]")
                  if (closeButton) {
                    ;(closeButton as HTMLElement).click()
                  }
                }
              }
            } else if (item.href !== "#") {
              router.push(item.href)
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${item.active ? "bg-study-purple/10" : "bg-gray-100 dark:bg-gray-800"} p-2 rounded-md`}>
                {React.cloneElement(item.icon, {
                  className: `${item.active ? "text-study-purple" : "text-muted-foreground"}`,
                })}
              </div>
              <div className={item.active ? "font-medium" : "text-muted-foreground"}>{item.label}</div>
              {item.count !== undefined && item.count > 0 && (
                <Badge variant="outline" className="ml-auto">
                  {item.count}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowLogoutDialog(true)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-muted-foreground">Logout</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Subscription tab content
  const SubscriptionTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-study-purple/10 border border-study-purple/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Free Plan</h3>
                  <p className="text-muted-foreground">Your current plan</p>
                </div>
                <Badge variant="outline" className="bg-study-purple/20 text-study-purple border-study-purple/30">
                  Active
                </Badge>
              </div>
              <div className="mt-4">
                <p className="font-medium mb-2">Plan Features:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Access to basic summarization tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Up to 10 summaries per month</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Basic flashcard generation</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Community forum access</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-study-purple/50 hover:border-study-purple transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Premium Plan</CardTitle>
                  <CardDescription>Unlock advanced features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">$9.99</span>
                    <span className="text-muted-foreground"> / month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-study-purple" />
                      <span>Unlimited summaries</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-study-purple" />
                      <span>Advanced AI-powered tools</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-study-purple" />
                      <span>Enhanced flashcard system</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-study-purple" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-study-purple" />
                      <span>No ads</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-study-purple hover:bg-study-blue">Upgrade Now</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-500/50 hover:border-yellow-500 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Pro Plan</CardTitle>
                  <CardDescription>For serious students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">$19.99</span>
                    <span className="text-muted-foreground"> / month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                      <span>Everything in Premium</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                      <span>AI study planner</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                      <span>Personal study coach</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                      <span>Unlimited question answering</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Get Pro Access</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="mb-2 text-study-purple">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">Enhanced Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Access advanced AI tools to make your studying more efficient and effective.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="mb-2 text-study-purple">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">Save Time</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate summaries, flashcards, and practice questions in seconds instead of hours.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="mb-2 text-study-purple">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">Boost Grades</h3>
                    <p className="text-sm text-muted-foreground">
                      Our users report an average grade improvement of 15% after using our premium features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">No payment methods added yet.</p>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">No billing history available.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="container py-4 md:py-8 mx-auto">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10" ref={sheetTriggerRef}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] z-[100]">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold">
            {activeTab === "overview" && "Dashboard"}
            {activeTab === "summaries" && "Summaries"}
            {activeTab === "flashcards" && "Flashcards"}
            {activeTab === "planner" && "Study Planner"}
            {activeTab === "progress" && "Progress"}
            {activeTab === "subscription" && "Subscription"}
            {activeTab === "account-info" && "Account Info"}
          </h1>

          <Button
            className="bg-black hover:bg-gray-800 text-white h-10 w-10 p-0"
            size="icon"
            onClick={() => router.push("/")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "summaries" && "Your Summaries"}
                {activeTab === "flashcards" && "Your Flashcards"}
                {activeTab === "planner" && "Study Planner"}
                {activeTab === "progress" && "Your Progress"}
                {activeTab === "account-info" && "Account Information"}
                {activeTab === "subscription" && "Subscription"}
              </h1>
              <p className="text-muted-foreground">Welcome back, {user.name.split(" ")[0]}</p>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => router.push("/")}>
              <Plus className="h-4 w-4 mr-2" />
              New Summary
            </Button>
          </div>

          {/* Account Information Tab */}
          {activeTab === "account-info" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Member Since</p>
                      <p className="font-medium">{formatDate(user.join_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Subscription</p>
                      <p className="font-medium">Free Plan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Statistics</CardTitle>
                  <CardDescription>Your activity overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Summaries</p>
                      <p className="text-2xl font-bold">{totalSummaries}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Flashcards</p>
                      <p className="text-2xl font-bold">{totalFlashcards}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Study Goals</p>
                      <p className="text-2xl font-bold">{goals.length}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Progress Score</p>
                      <p className="text-2xl font-bold">{userScore}/100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently remove your account</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Logout</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content remains the same */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs md:text-sm font-medium mb-1">Total Summaries</p>
                        <h3 className="text-xl md:text-3xl font-bold">{totalSummaries}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500">+{Math.max(1, Math.floor(totalSummaries * 0.2))} </span>
                          from last week
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <FileText className="h-4 md:h-5 w-4 md:w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs md:text-sm font-medium mb-1">Flashcards</p>
                        <h3 className="text-xl md:text-3xl font-bold">{totalFlashcards || 0}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500">
                            +{Math.max(1, Math.floor((totalFlashcards || 0) * 0.2))}{" "}
                          </span>
                          from last week
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <FlashlightIcon className="h-4 md:h-5 w-4 md:w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs md:text-sm font-medium mb-1">Completed Goals</p>
                        <h3 className="text-xl md:text-3xl font-bold">{completedGoals}</h3>
                        <p className="text-xs text-muted-foreground mt-1">of {goals.length} total goals</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <CheckCircle2 className="h-4 md:h-5 w-4 md:w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs md:text-sm font-medium mb-1">Your Score</p>
                        <h3 className="text-xl md:text-3xl font-bold">{userScore}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500">+5 </span>
                          from last week
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <TrendingUp className="h-4 md:h-5 w-4 md:w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Tabs */}
              <Tabs defaultValue="overview" className="mb-6 md:mb-8">
                <TabsList className="mb-4 md:mb-6 bg-muted/50 w-full">
                  <TabsTrigger value="overview" className="flex-1">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex-1">
                    Recent Summaries
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex-1">
                    Upcoming
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Study Progress */}
                    <Card className="md:col-span-1">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Study Progress</CardTitle>
                        <CardDescription>Your weekly study goals</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Summaries Created</span>
                              <span className="text-sm text-muted-foreground">{totalSummaries}/15</span>
                            </div>
                            <Progress value={Math.min((totalSummaries / 15) * 100, 100)} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Flashcards Studied</span>
                              <span className="text-sm text-muted-foreground">{totalFlashcards || 0}/50</span>
                            </div>
                            <Progress value={Math.min(((totalFlashcards || 0) / 50) * 100, 100)} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Goals Completed</span>
                              <span className="text-sm text-muted-foreground">
                                {completedGoals}/{Math.max(goals.length, 5)}
                              </span>
                            </div>
                            <Progress
                              value={Math.min((completedGoals / Math.max(goals.length, 5)) * 100, 100)}
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Questions Answered</span>
                              <span className="text-sm text-muted-foreground">{questions.length || 0}/20</span>
                            </div>
                            <Progress value={Math.min(((questions.length || 0) / 20) * 100, 100)} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="md:col-span-1">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
                        <CardDescription>Your latest study activities</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                        <div className="space-y-4">
                          {activities.length > 0 ? (
                            activities.slice(0, 4).map((activity, index) => (
                              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                <div
                                  className={`p-2 rounded-md ${
                                    activity.type === "summary"
                                      ? "bg-blue-100 dark:bg-blue-900/20"
                                      : activity.type === "flashcards"
                                        ? "bg-green-100 dark:bg-green-900/20"
                                        : "bg-purple-100 dark:bg-purple-900/20"
                                  }`}
                                >
                                  {activity.type === "summary" ? (
                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  ) : activity.type === "flashcards" ? (
                                    <FlashlightIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Created{" "}
                                    {activity.type === "summary"
                                      ? "Summary"
                                      : activity.type === "flashcards"
                                        ? "Flashcards"
                                        : "Practice Questions"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(activity.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-4">No recent activities</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="md:col-span-1">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
                        <CardDescription>Frequently used tools</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                        <div className="space-y-3">
                          <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/")}>
                            <FileText className="h-4 w-4 mr-2" />
                            Create New Summary
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("flashcards")}
                          >
                            <FlashlightIcon className="h-4 w-4 mr-2" />
                            Practice Flashcards
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("planner")}
                          >
                            <ListChecks className="h-4 w-4 mr-2" />
                            Manage Study Goals
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => router.push("/tools")}
                          >
                            <BarChart className="h-4 w-4 mr-2" />
                            View All Tools
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recent">
                  <Card>
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-lg md:text-xl">Recent Summaries</CardTitle>
                      <CardDescription>Your recently created study summaries</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                      {summaries.length > 0 ? (
                        <div className="space-y-4">
                          {summaries.slice(0, 5).map((activity, index) => (
                            <Card key={index} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{activity.title || "Untitled Summary"}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Created on {new Date(activity.date).toLocaleDateString()}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {activity.data?.summary?.tags?.slice(0, 3).map((tag: any, idx: number) => (
                                        <Badge key={idx} className={tag.color || "bg-gray-100 text-gray-800"}>
                                          {tag.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => setActiveTab("summaries")}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {summaries.length > 5 && (
                            <Button variant="outline" className="w-full" onClick={() => setActiveTab("summaries")}>
                              View All Summaries
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">No summaries found</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upcoming">
                  <Card>
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-lg md:text-xl">Upcoming Study Goals</CardTitle>
                      <CardDescription>Your scheduled study goals</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                      <div className="space-y-4">
                        {goals.length > 0 ? (
                          <>
                            {goals
                              .filter((goal) => !goal.completed)
                              .slice(0, 3)
                              .map((goal, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-study-purple/10 p-3 rounded-full">
                                      <ListChecks className="h-5 w-5 text-study-purple" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{goal.title}</p>
                                      {goal.dueDate && (
                                        <p className="text-sm text-muted-foreground">
                                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Badge variant="outline">Pending</Badge>
                                </div>
                              ))}
                            {goals.filter((goal) => !goal.completed).length > 3 && (
                              <Button variant="outline" className="w-full" onClick={() => setActiveTab("planner")}>
                                View All Goals
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">No upcoming goals found</p>
                            <Button onClick={() => setActiveTab("planner")}>Create Study Goal</Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Progress Graph */}
              <Card className="mb-6">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Progress Over Time</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                  <ProgressGraph progressHistory={progressHistory} />
                </CardContent>
              </Card>

              {/* Score Information */}
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-study-purple/10 p-3 rounded-full">
                      <TrendingUp className="h-5 w-5 text-study-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Your Progress Score: {userScore}</h3>
                      <p className="text-muted-foreground">
                        Your score increases as you use MMU Genius. Create summaries, practice with flashcards, complete
                        study goals, and visit regularly to boost your score. Higher scores unlock additional features
                        and achievements.
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Current Progress</span>
                          <span className="text-sm text-muted-foreground">{userProgress}%</span>
                        </div>
                        <Progress value={userProgress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Summaries Tab */}
          {activeTab === "summaries" && <SummariesView summaries={summaries} userId={user.id} />}

          {/* Flashcards Tab */}
          {activeTab === "flashcards" && <FlashcardsView flashcardActivities={flashcards} userId={user.id} />}

          {/* Study Planner Tab */}
          {activeTab === "planner" && (
            <StudyPlanner
              goals={goals}
              onToggleGoal={handleGoalToggle}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <ProgressView
              activities={activities}
              progressHistory={progressHistory}
              userScore={userScore}
              userProgress={userProgress}
              visitCount={visitCount}
              completedGoals={completedGoals}
              totalGoals={goals.length}
            />
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && <SubscriptionTab />}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out of your account?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

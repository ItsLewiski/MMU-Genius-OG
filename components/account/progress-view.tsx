"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, TrendingUp, Clock, BookOpen, CheckCircle2 } from "lucide-react"
import { ProgressGraph } from "./progress-graph"
import { Button } from "@/components/ui/button"

interface ProgressViewProps {
  activities: any[]
  progressHistory: { date: string; value: number }[]
  userScore: number
  userProgress: number
  visitCount: number
  completedGoals: number
  totalGoals: number
}

export function ProgressView({
  activities,
  progressHistory,
  userScore,
  userProgress,
  visitCount,
  completedGoals,
  totalGoals,
}: ProgressViewProps) {
  // Ensure the progress history reflects the current user score
  const updatedProgressHistory = [...progressHistory]
  if (updatedProgressHistory.length > 0) {
    // Update the last entry to match the current user score
    updatedProgressHistory[updatedProgressHistory.length - 1] = {
      date: new Date().toISOString(),
      value: userScore,
    }
  }

  // Calculate achievement level based on user score
  const getAchievementLevel = (score: number) => {
    if (score < 20) return { name: "Beginner", color: "bg-gray-500" }
    if (score < 40) return { name: "Enthusiast", color: "bg-green-500" }
    if (score < 60) return { name: "Scholar", color: "bg-blue-500" }
    if (score < 80) return { name: "Expert", color: "bg-purple-500" }
    return { name: "Master", color: "bg-yellow-500" }
  }

  const achievementLevel = getAchievementLevel(userScore)

  return (
    <div className="space-y-6">
      {/* Progress Overview Card */}
      <Card className="bg-white dark:bg-gray-950">
        <CardHeader>
          <CardTitle className="text-xl">Progress Overview</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User's current score */}
          <div className="bg-muted/20 border border-muted/30 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-study-purple h-5 w-5" />
                  <span>Your Progress Score: {userScore}</span>
                </h3>
                <p className="text-muted-foreground mt-1">
                  Level: <Badge className={`${achievementLevel.color} text-white`}>{achievementLevel.name}</Badge>
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Current Progress</span>
                  <span className="text-sm text-muted-foreground">{userProgress}%</span>
                </div>
                <Progress value={userProgress} className="h-3" />
              </div>
            </div>
          </div>

          {/* Progress Graph */}
          <div>
            <h3 className="font-medium mb-3">Progress Over Time</h3>
            <ProgressGraph progressHistory={updatedProgressHistory} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="bg-muted/10">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Activities</span>
                    <BookOpen className="h-4 w-4 text-study-purple" />
                  </div>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total learning activities</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/10">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Visit Streak</span>
                    <Clock className="h-4 w-4 text-study-purple" />
                  </div>
                  <div className="text-2xl font-bold">{visitCount} days</div>
                  <p className="text-xs text-muted-foreground mt-1">Your login streak</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/10">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Goals</span>
                    <CheckCircle2 className="h-4 w-4 text-study-purple" />
                  </div>
                  <div className="text-2xl font-bold">
                    {completedGoals}/{totalGoals}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Goals completed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/10">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Achievement</span>
                    <BarChart className="h-4 w-4 text-study-purple" />
                  </div>
                  <div className="text-2xl font-bold">{achievementLevel.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">Current learning level</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className={userScore >= 10 ? "border-study-purple" : "opacity-50"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${userScore >= 10 ? "bg-study-purple/10" : "bg-gray-100"}`}>
                      <TrendingUp className={`h-5 w-5 ${userScore >= 10 ? "text-study-purple" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="font-medium">First Steps</p>
                      <p className="text-xs text-muted-foreground">Reach a score of 10 points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={userScore >= 25 ? "border-study-purple" : "opacity-50"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${userScore >= 25 ? "bg-study-purple/10" : "bg-gray-100"}`}>
                      <BookOpen className={`h-5 w-5 ${userScore >= 25 ? "text-study-purple" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="font-medium">Study Enthusiast</p>
                      <p className="text-xs text-muted-foreground">Reach a score of 25 points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={userScore >= 50 ? "border-study-purple" : "opacity-50"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${userScore >= 50 ? "bg-study-purple/10" : "bg-gray-100"}`}>
                      <BarChart className={`h-5 w-5 ${userScore >= 50 ? "text-study-purple" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="font-medium">Knowledge Master</p>
                      <p className="text-xs text-muted-foreground">Reach a score of 50 points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to action */}
          <Card className="bg-study-purple/5 border-study-purple/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Improve Your Score</h3>
                  <p className="text-muted-foreground text-sm">
                    Create summaries, practice with flashcards, complete goals, and visit regularly to boost your
                    progress score.
                  </p>
                </div>
                <Button className="bg-study-purple hover:bg-study-blue text-white">Create New Summary</Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ListChecks, Plus, Calendar, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { StudyGoal } from "@/types/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface StudyPlannerProps {
  goals: StudyGoal[]
  onToggleGoal: (goalId: string, completed: boolean) => void
  onAddGoal: (title: string, dueDate?: string) => void
  onDeleteGoal: (goalId: string) => void
}

export function StudyPlanner({ goals, onToggleGoal, onAddGoal, onDeleteGoal }: StudyPlannerProps) {
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDueDate, setNewGoalDueDate] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  // Filter goals based on selected filter
  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true
    if (filter === "pending") return !goal.completed
    if (filter === "completed") return goal.completed
    return true
  })

  // Sort goals: first by due date (if available), then by completion status
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    // First sort by completion status
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1

    // Then sort by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // Put goals with due dates before those without
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1

    // Finally sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Group goals by due date
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const overdueGoals = sortedGoals.filter((goal) => !goal.completed && goal.dueDate && goal.dueDate < today)

  const todayGoals = sortedGoals.filter((goal) => goal.dueDate === today)

  const tomorrowGoals = sortedGoals.filter((goal) => goal.dueDate === tomorrow)

  const upcomingGoals = sortedGoals.filter((goal) => goal.dueDate && goal.dueDate > tomorrow)

  const noDateGoals = sortedGoals.filter((goal) => !goal.dueDate)

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return

    onAddGoal(newGoalTitle, newGoalDueDate || undefined)

    // Reset form
    setNewGoalTitle("")
    setNewGoalDueDate("")
    setIsDialogOpen(false)
  }

  // Calculate completion stats
  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.completed).length
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-study-purple/10 p-3 rounded-full">
              <ListChecks className="h-5 w-5 text-study-purple" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Goals</p>
              <h3 className="text-2xl font-bold">{totalGoals}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Completed</p>
              <h3 className="text-2xl font-bold">{completedGoals}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Completion Rate</p>
              <h3 className="text-2xl font-bold">{completionRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Button and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pending
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Study Goal</DialogTitle>
              <DialogDescription>Create a new goal to track your study progress</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete chapter 5 exercises"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newGoalDueDate}
                  onChange={(e) => setNewGoalDueDate(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal} disabled={!newGoalTitle.trim()}>
                Add Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {/* Overdue Goals */}
        {overdueGoals.length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md bg-red-50/50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => onToggleGoal(goal.id, checked === true)}
                        className="border-red-500"
                      />
                      <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                        <p className="font-medium">{goal.title}</p>
                        {goal.dueDate && (
                          <p className="text-xs text-red-500">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Goals */}
        {todayGoals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => onToggleGoal(goal.id, checked === true)}
                      />
                      <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">Due today</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tomorrow's Goals */}
        {tomorrowGoals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Tomorrow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tomorrowGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => onToggleGoal(goal.id, checked === true)}
                      />
                      <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">Due tomorrow</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Goals */}
        {upcomingGoals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-study-purple" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => onToggleGoal(goal.id, checked === true)}
                      />
                      <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                        <p className="font-medium">{goal.title}</p>
                        {goal.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(goal.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Due Date Goals */}
        {noDateGoals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-gray-500" />
                No Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {noDateGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => onToggleGoal(goal.id, checked === true)}
                      />
                      <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">No due date</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {sortedGoals.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No study goals yet</h3>
            <p className="text-muted-foreground mb-4">Create your first study goal to track your progress</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

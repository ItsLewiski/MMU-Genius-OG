"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, UserActivity } from "@/types/auth"
import { getUsers, getUserActivities, deleteUser, getContactMessages } from "@/lib/auth"
import { Download, Eye, EyeOff, Trash2, BarChart, Users, FileText, Calendar, LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Load data from local storage
    const loadedUsers = getUsers()
    setUsers(loadedUsers)

    const loadedActivities = getUserActivities()
    setActivities(loadedActivities)

    // Load messages
    const loadedMessages = getContactMessages()
    setMessages(loadedMessages)
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Toggle password visibility for a specific user
  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  // Delete a user
  const handleDeleteUser = (userId: string) => {
    // Delete user from storage
    deleteUser(userId)

    // Update state
    setUsers(users.filter((user) => user.id !== userId))
    setActivities(activities.filter((activity) => activity.userId !== userId))
  }

  // Export data as CSV
  const exportData = (type: string) => {
    if (type === "users") {
      const headers = ["ID", "Name", "Email", "Phone", "Created At"]
      const csvData = users.map((user) => [user.id, user.name, user.email, user.phone, user.createdAt])

      downloadCSV([headers, ...csvData], "mmu_genius_users.csv")
    } else if (type === "activities") {
      const headers = ["ID", "User ID", "Type", "Title", "Date"]
      const csvData = activities.map((activity) => [
        activity.id,
        activity.userId,
        activity.type,
        activity.title,
        activity.date,
      ])

      downloadCSV([headers, ...csvData], "mmu_genius_activities.csv")
    } else if (type === "messages") {
      const headers = ["ID", "Name", "Email", "Subject", "Message", "Date"]
      const csvData = messages.map((message) => [
        message.id,
        message.name,
        message.email,
        message.subject,
        message.message,
        message.date,
      ])

      downloadCSV([headers, ...csvData], "mmu_genius_messages.csv")
    }
  }

  // Helper function to download CSV
  const downloadCSV = (data: any[][], filename: string) => {
    const csvContent = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get user name by ID
  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Unknown User"
  }

  // Calculate statistics
  const totalUsers = users.length
  const totalActivities = activities.length
  const summaryCount = activities.filter((a) => a.type === "summary").length
  const flashcardCount = activities.filter((a) => a.type === "flashcards").length
  const qaCount = activities.filter((a) => a.type === "qa").length

  // Get recent activities (last 7 days)
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  const recentActivities = activities.filter((a) => new Date(a.date) > lastWeek)

  // Get top 5 active users
  const userActivityCount = users
    .map((user) => {
      const count = activities.filter((a) => a.userId === user.id).length
      return { id: user.id, name: user.name, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("mmu_genius_admin")
    window.location.reload()
  }

  return (
    <div className="container">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
              <CardDescription>Manage users and data</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <h3 className="text-2xl font-bold">{totalUsers}</h3>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                        <h3 className="text-2xl font-bold">{totalActivities}</h3>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Activities</p>
                        <h3 className="text-2xl font-bold">{recentActivities.length}</h3>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Activity Types</p>
                        <h3 className="text-2xl font-bold">
                          {summaryCount}/{flashcardCount}/{qaCount}
                        </h3>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <BarChart className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{activity.title || "Untitled"}</p>
                            <p className="text-sm text-muted-foreground">
                              {getUserName(activity.userId)} • {activity.type}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}

                      {recentActivities.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No recent activities</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userActivityCount.map((user) => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-2">
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {user.count} activities
                            </span>
                          </div>
                        </div>
                      ))}

                      {userActivityCount.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No user activities</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={() => exportData("users")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export User Data
                </Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span>{visiblePasswords[user.id] ? user.password : "••••••••"}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => togglePasswordVisibility(user.id)}
                              >
                                {visiblePasswords[user.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the user and all their activities. This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={() => exportData("activities")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Activity Data
                </Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.title || "Untitled"}</TableCell>
                          <TableCell>{getUserName(activity.userId)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.type === "summary"
                                  ? "bg-blue-100 text-blue-800"
                                  : activity.type === "flashcards"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {activity.type}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(activity.date)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No activities found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={() => exportData("messages")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Messages
                </Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.subject}</TableCell>
                          <TableCell>{formatDate(message.date)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No messages found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="statistics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="flex items-end h-[250px] gap-2">
                        <div className="flex flex-col items-center">
                          <div
                            className="bg-blue-500 w-16 rounded-t-md"
                            style={{ height: `${(summaryCount / Math.max(totalActivities, 1)) * 200 || 0}px` }}
                          ></div>
                          <p className="text-sm mt-2">Summaries</p>
                          <p className="text-xs text-muted-foreground">{summaryCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div
                            className="bg-green-500 w-16 rounded-t-md"
                            style={{ height: `${(flashcardCount / Math.max(totalActivities, 1)) * 200 || 0}px` }}
                          ></div>
                          <p className="text-sm mt-2">Flashcards</p>
                          <p className="text-xs text-muted-foreground">{flashcardCount}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div
                            className="bg-purple-500 w-16 rounded-t-md"
                            style={{ height: `${(qaCount / Math.max(totalActivities, 1)) * 200 || 0}px` }}
                          ></div>
                          <p className="text-sm mt-2">Q&A</p>
                          <p className="text-xs text-muted-foreground">{qaCount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      {users.length > 0 ? (
                        <div className="w-full h-[250px] flex items-end gap-1">
                          {Object.entries(
                            users.reduce((acc: Record<string, number>, user) => {
                              const date = new Date(user.createdAt).toLocaleDateString("en-US", { month: "short" })
                              acc[date] = (acc[date] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([month, count], index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div
                                className="bg-study-purple w-full rounded-t-md"
                                style={{ height: `${count * 50}px` }}
                              ></div>
                              <p className="text-xs mt-2">{month}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">No user data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

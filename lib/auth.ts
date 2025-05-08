// Types for user data
export interface User {
  id: string
  name: string
  email: string
  password?: string
  phone?: string
  role: "student" | "admin"
  avatar?: string
  joinDate: string
  lastActive: string
}

// Local storage keys
const USERS_KEY = "study_buddy_users"
const USER_KEY = "study_buddy_user"

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const userJson = localStorage.getItem(USER_KEY)
    if (!userJson) {
      return null
    }

    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Get users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const usersJson = localStorage.getItem(USERS_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Delete user from localStorage
export const deleteUser = (userId: string): void => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const usersJson = localStorage.getItem(USERS_KEY)
    if (!usersJson) {
      return
    }

    const users = JSON.parse(usersJson) as User[]
    const updatedUsers = users.filter((user) => user.id !== userId)
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
  } catch (error) {
    console.error("Error deleting user:", error)
  }
}

export interface UserActivity {
  id: string
  userId: string
  type: "summary" | "flashcards" | "qa"
  date: string
  title?: string
  data?: any
}

const ACTIVITIES_KEY = "study_buddy_activities"

// Get user activities from localStorage
export const getUserActivities = (userId: string): UserActivity[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const activitiesJson = localStorage.getItem(ACTIVITIES_KEY)
    if (!activitiesJson) {
      return []
    }

    const allActivities = JSON.parse(activitiesJson) as UserActivity[]
    return allActivities.filter((activity) => activity.userId === userId)
  } catch (error) {
    console.error("Error fetching user activities:", error)
    return []
  }
}

// Save user activity to localStorage
export const saveUserActivity = async (
  userId: string,
  type: "summary" | "flashcards" | "qa",
  title?: string,
  data?: any,
): Promise<UserActivity> => {
  if (typeof window === "undefined") {
    throw new Error("Cannot save activity: window is undefined")
  }

  try {
    const activitiesJson = localStorage.getItem(ACTIVITIES_KEY)
    const activities = activitiesJson ? JSON.parse(activitiesJson) : []

    const newActivity = {
      id: crypto.randomUUID(),
      userId,
      type,
      date: new Date().toISOString(),
      title,
      data,
    }

    activities.push(newActivity)
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))

    // Update user score
    await updateUserScore(userId, 5, true)

    return newActivity
  } catch (error) {
    console.error("Error saving user activity:", error)
    throw error
  }
}

export interface StudyGoal {
  id: string
  userId: string
  title: string
  completed: boolean
  dueDate?: string
  createdAt: string
}

const GOALS_KEY = "study_buddy_goals"

// Get user goals from localStorage
export const getUserGoals = (userId: string): StudyGoal[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const goalsJson = localStorage.getItem(GOALS_KEY)
    if (!goalsJson) {
      return []
    }

    const allGoals = JSON.parse(goalsJson) as StudyGoal[]
    return allGoals.filter((goal) => goal.userId === userId)
  } catch (error) {
    console.error("Error fetching user goals:", error)
    return []
  }
}

// Save user goal to localStorage
export const saveUserGoal = async (userId: string, title: string, dueDate?: string): Promise<StudyGoal> => {
  if (typeof window === "undefined") {
    throw new Error("Cannot save goal: window is undefined")
  }

  try {
    const goalsJson = localStorage.getItem(GOALS_KEY)
    const goals = goalsJson ? JSON.parse(goalsJson) : []

    const newGoal = {
      id: crypto.randomUUID(),
      userId,
      title,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    }

    goals.push(newGoal)
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))

    return newGoal
  } catch (error) {
    console.error("Error saving user goal:", error)
    throw error
  }
}

// Update user goal in localStorage
export const updateUserGoal = async (userId: string, goalId: string, updates: Partial<StudyGoal>): Promise<void> => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const goalsJson = localStorage.getItem(GOALS_KEY)
    if (!goalsJson) {
      return
    }

    const goals = JSON.parse(goalsJson) as StudyGoal[]
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId && goal.userId === userId) {
        return { ...goal, ...updates }
      }
      return goal
    })

    localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals))

    // If goal was completed, update user score
    if (updates.completed === true) {
      await updateUserScore(userId, 3, true)
    }
  } catch (error) {
    console.error("Error updating user goal:", error)
  }
}

// Delete user goal from localStorage
export const deleteUserGoal = async (userId: string, goalId: string): Promise<void> => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const goalsJson = localStorage.getItem(GOALS_KEY)
    if (!goalsJson) {
      return
    }

    const goals = JSON.parse(goalsJson) as StudyGoal[]
    const updatedGoals = goals.filter((goal) => !(goal.id === goalId && goal.userId === userId))

    localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals))
  } catch (error) {
    console.error("Error deleting user goal:", error)
  }
}

const CONTACT_MESSAGES_KEY = "study_buddy_contact_messages"

// Save contact message to localStorage
export const saveContactMessage = async (
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<void> => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const messagesJson = localStorage.getItem(CONTACT_MESSAGES_KEY)
    const messages = messagesJson ? JSON.parse(messagesJson) : []

    const newMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
    }

    messages.push(newMessage)
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error("Error saving contact message:", error)
  }
}

// Get contact messages from localStorage (admin only)
export const getContactMessages = (): any[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const messagesJson = localStorage.getItem(CONTACT_MESSAGES_KEY)
    if (!messagesJson) {
      return []
    }

    return JSON.parse(messagesJson)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return []
  }
}

// User progress data
const USER_PROGRESS_KEY = "study_buddy_progress"
const PROGRESS_HISTORY_KEY = "study_buddy_progress_history"

// Update user score
export const updateUserScore = async (userId: string, points: number, increment = false): Promise<void> => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const progressJson = localStorage.getItem(USER_PROGRESS_KEY)
    const allProgress = progressJson ? JSON.parse(progressJson) : []

    const now = new Date().toISOString()
    const existingProgress = allProgress.find((p: any) => p.userId === userId)

    if (existingProgress) {
      // Update existing progress
      const newScore = increment ? Math.min(existingProgress.score + points, 100) : Math.min(points, 100)

      existingProgress.score = newScore
      existingProgress.updated_at = now

      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress))

      // Add to progress history
      const historyJson = localStorage.getItem(PROGRESS_HISTORY_KEY)
      const history = historyJson ? JSON.parse(historyJson) : []

      history.push({
        id: crypto.randomUUID(),
        userId,
        date: now,
        value: newScore,
      })

      localStorage.setItem(PROGRESS_HISTORY_KEY, JSON.stringify(history))
    } else {
      // Create new progress record
      const newScore = Math.min(points, 100)

      allProgress.push({
        id: crypto.randomUUID(),
        userId,
        score: newScore,
        progress: 0,
        visit_count: 1,
        last_visit: now,
        created_at: now,
        updated_at: now,
      })

      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress))

      // Add to progress history
      const historyJson = localStorage.getItem(PROGRESS_HISTORY_KEY)
      const history = historyJson ? JSON.parse(historyJson) : []

      history.push({
        id: crypto.randomUUID(),
        userId,
        date: now,
        value: newScore,
      })

      localStorage.setItem(PROGRESS_HISTORY_KEY, JSON.stringify(history))
    }
  } catch (error) {
    console.error("Error in updateUserScore:", error)
  }
}

// Update flashcard status (known/unknown)
export const updateFlashcardStatus = async (
  userId: string,
  activityId: string,
  flashcardId: string,
  known: boolean,
): Promise<void> => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const activitiesJson = localStorage.getItem(ACTIVITIES_KEY)
    if (!activitiesJson) {
      return
    }

    const activities = JSON.parse(activitiesJson) as UserActivity[]
    const activity = activities.find((a) => a.id === activityId && a.userId === userId)

    if (!activity || !activity.data || !Array.isArray(activity.data)) {
      console.error("Activity data is not an array")
      return
    }

    // Update the flashcard in the data array
    activity.data = activity.data.map((flashcard: any) =>
      flashcard.id === flashcardId ? { ...flashcard, known } : flashcard,
    )

    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
  } catch (error) {
    console.error("Error in updateFlashcardStatus:", error)
  }
}

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin"
}

// Verify admin credentials
export const verifyAdminCredentials = (username: string, password: string): boolean => {
  return username === "admin" && password === "adminpass"
}

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface UserActivity {
  id: string
  userId: string
  type: "summary" | "flashcards" | "qa"
  date: string
  title?: string
  data?: any
}

export interface StudyGoal {
  id: string
  userId: string
  title: string
  completed: boolean
  dueDate?: string
  createdAt: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  known: boolean
}

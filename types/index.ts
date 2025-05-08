export interface StudyNote {
  id: string
  content: string
  timestamp: Date
}

export interface Summary {
  text: string
  keyPoints: string[]
  tags: Tag[]
}

export interface Tag {
  name: string
  color: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  known: boolean
}

export interface Question {
  id: string
  text: string
  type: "multiple-choice" | "fill-in-blank" | "short-answer"
  options?: string[]
  answer: string
  explanation: string
}

export interface ProcessedNotes {
  summary: Summary
  flashcards: Flashcard[]
  questions: Question[]
}

"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import type { ProcessedNotes, Flashcard, Question, Summary } from "@/types"

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

// Helper function to generate random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Helper function to generate random color for tags
function getRandomTagColor(): string {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Helper function to extract JSON from a potentially markdown-formatted response
function extractJsonFromResponse(response: string): string {
  // Check if the response contains a markdown code block
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = response.match(jsonRegex)

  if (match && match[1]) {
    // Return the content inside the code block
    return match[1].trim()
  }

  // If no code block is found, return the original response
  return response.trim()
}

// Helper function to truncate text to a reasonable length
function truncateText(text: string, maxLength = 4000): string {
  if (text.length <= maxLength) return text

  // Find a good breaking point (end of a sentence)
  const breakPoint = text.lastIndexOf(".", maxLength)
  return breakPoint > 0 ? text.substring(0, breakPoint + 1) : text.substring(0, maxLength)
}

// Helper function to implement a timeout for API calls
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutId: NodeJS.Timeout

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } catch (error) {
    console.warn("API call timed out, using fallback response")
    return fallback
  } finally {
    clearTimeout(timeoutId!)
  }
}

// Fallback responses in case of timeout
const fallbackSummary = {
  summary: "We couldn't generate a complete summary in time. Please try with shorter notes or try again later.",
  keyPoints: ["Try with shorter notes", "Break your content into smaller chunks", "Try again in a few moments"],
  tags: ["Timeout", "Try Again"],
}

const fallbackFlashcards = [
  { front: "Note", back: "We couldn't generate flashcards in time. Please try with shorter notes." },
  { front: "Tip", back: "Break your content into smaller chunks for better results." },
]

const fallbackQuestions = [
  {
    text: "We couldn't generate questions in time. What should you try?",
    type: "multiple-choice",
    options: ["Use shorter notes", "Break content into chunks", "Try again later", "All of the above"],
    answer: "All of the above",
    explanation:
      "Using shorter notes or breaking your content into smaller chunks may help the AI process your request faster.",
  },
]

export async function processNotes(formData: FormData): Promise<ProcessedNotes> {
  const notes = formData.get("notes") as string

  if (!notes || notes.trim().length === 0) {
    throw new Error("Please provide some notes to process")
  }

  try {
    // Check if API key exists
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("API key is not configured. Please check your environment variables.")
    }

    // Truncate notes to a reasonable length to reduce processing time
    const truncatedNotes = truncateText(notes, 4000)

    // Create more concise prompts
    const summaryPrompt = `
      Analyze these study notes and provide:
      1. A concise summary (100-150 words)
      2. 3-5 key points
      3. 3 relevant topic tags

      Return ONLY raw JSON with this structure:
      {"summary": "your summary", "keyPoints": ["point 1", "point 2"], "tags": ["tag1", "tag2"]}

      Notes: ${truncatedNotes}
    `.trim()

    const flashcardsPrompt = `
      Create 3 flashcards based on these notes. Each with a question/term on front and answer on back.
      
      Return ONLY raw JSON array:
      [{"front": "question", "back": "answer"}]

      Notes: ${truncatedNotes}
    `.trim()

    const questionsPrompt = `
      Create 3 practice questions based on these notes. Include multiple-choice and short answer.
      
      Return ONLY raw JSON array:
      [{"text": "question", "type": "multiple-choice", "options": ["option1", "option2"], "answer": "correct answer", "explanation": "explanation"}]

      Notes: ${truncatedNotes}
    `.trim()

    // Run all three API calls in parallel with timeouts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const [summaryResponse, flashcardsResponse, questionsResponse] = await Promise.all([
      withTimeout(
        model.generateContent(summaryPrompt).then((result) => {
          return { text: result.response.text() }
        }),
        8000, // 8 second timeout
        { text: JSON.stringify(fallbackSummary) },
      ),

      withTimeout(
        model.generateContent(flashcardsPrompt).then((result) => {
          return { text: result.response.text() }
        }),
        8000,
        { text: JSON.stringify(fallbackFlashcards) },
      ),

      withTimeout(
        model.generateContent(questionsPrompt).then((result) => {
          return { text: result.response.text() }
        }),
        8000,
        { text: JSON.stringify(fallbackQuestions) },
      ),
    ])

    // Process responses
    let summaryData
    try {
      const cleanedResponse = extractJsonFromResponse(summaryResponse.text)
      summaryData = JSON.parse(cleanedResponse)
    } catch (e) {
      console.error("Failed to parse summary JSON:", e)
      summaryData = fallbackSummary
    }

    let flashcardsData
    try {
      const cleanedResponse = extractJsonFromResponse(flashcardsResponse.text)
      flashcardsData = JSON.parse(cleanedResponse)
    } catch (e) {
      console.error("Failed to parse flashcards JSON:", e)
      flashcardsData = fallbackFlashcards
    }

    let questionsData
    try {
      const cleanedResponse = extractJsonFromResponse(questionsResponse.text)
      questionsData = JSON.parse(cleanedResponse)
    } catch (e) {
      console.error("Failed to parse questions JSON:", e)
      questionsData = fallbackQuestions
    }

    // Format the data
    const summary: Summary = {
      text: summaryData.summary,
      keyPoints: summaryData.keyPoints,
      tags: summaryData.tags.map((tag: string) => ({
        name: tag,
        color: getRandomTagColor(),
      })),
    }

    const flashcards: Flashcard[] = flashcardsData.map((card: any) => ({
      id: generateId(),
      front: card.front,
      back: card.back,
      known: false,
    }))

    const questions: Question[] = questionsData.map((q: any) => ({
      id: generateId(),
      text: q.text,
      type: q.type,
      options: q.options || undefined,
      answer: q.answer,
      explanation: q.explanation,
    }))

    return {
      summary,
      flashcards,
      questions,
    }
  } catch (error) {
    console.error("Error processing notes:", error)

    // Return a minimal response instead of throwing an error
    return {
      summary: {
        text: "We encountered an error processing your notes. Please try again with shorter content.",
        keyPoints: ["Try with shorter notes", "Break your content into smaller chunks", "Try again in a few moments"],
        tags: [
          { name: "Error", color: "bg-red-100 text-red-800" },
          { name: "Try Again", color: "bg-yellow-100 text-yellow-800" },
        ],
      },
      flashcards: [
        {
          id: generateId(),
          front: "Error Processing",
          back: "We couldn't process your notes. Try with shorter content or try again later.",
          known: false,
        },
      ],
      questions: [
        {
          id: generateId(),
          text: "What should you do if your notes couldn't be processed?",
          type: "multiple-choice",
          options: ["Try with shorter notes", "Break content into chunks", "Try again later", "All of the above"],
          answer: "All of the above",
          explanation:
            "Using shorter notes or breaking your content into smaller chunks may help the AI process your request faster.",
        },
      ],
    }
  }
}

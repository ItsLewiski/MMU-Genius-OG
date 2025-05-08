"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Upload, FileText } from "lucide-react"
import { extractTextFromFile, truncateText, isFileTooLarge, formatFileSize } from "@/lib/file-utils"
import { useToast } from "@/hooks/use-toast"

interface InputSectionProps {
  onProcessComplete: (data: any) => void
}

export function InputSection({ onProcessComplete }: InputSectionProps) {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const MAX_CHARS = 2000

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setInputText(text)
    } else {
      setInputText(text.substring(0, MAX_CHARS))
      toast({
        title: "Character limit reached",
        description: `Text has been truncated to ${MAX_CHARS} characters.`,
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (file.type !== "text/plain") {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (5MB max)
    if (isFileTooLarge(file, 5)) {
      toast({
        title: "File too large",
        description: `Maximum file size is 5MB. Your file is ${formatFileSize(file.size)}.`,
        variant: "destructive",
      })
      return
    }

    try {
      // Extract text from file
      const text = await extractTextFromFile(file)

      // Truncate if necessary
      if (text.length > MAX_CHARS) {
        setInputText(truncateText(text, MAX_CHARS))
        toast({
          title: "Text truncated",
          description: `The file content exceeds ${MAX_CHARS} characters and has been truncated.`,
        })
      } else {
        setInputText(text)
      }

      setFileName(file.name)
    } catch (error) {
      toast({
        title: "Error reading file",
        description: error instanceof Error ? error.message : "Failed to read file content.",
        variant: "destructive",
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleProcess = async () => {
    if (!inputText.trim() || isProcessing) return

    setIsProcessing(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate sample processed data
      const processedData = {
        summary: {
          text: generateSummary(inputText),
          keyPoints: generateKeyPoints(inputText),
          tags: generateTags(inputText),
        },
        flashcards: generateFlashcards(inputText),
        questions: generateQuestions(inputText),
      }

      // Pass the processed data to the parent component
      onProcessComplete(processedData)
    } catch (error) {
      console.error("Error processing notes:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Sample data generation functions
  const generateSummary = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(Boolean)
    const wordCount = text.split(/\s+/).length

    if (sentences.length <= 3) return text

    // Take first sentence, a middle one, and the last one
    return `${sentences[0]}. ${sentences[Math.floor(sentences.length / 2)]}. ${sentences[sentences.length - 1]}.
    
    This summary was generated from your input of ${wordCount} words. The text discusses ${getMainTopic(text)}.`
  }

  const getMainTopic = (text: string) => {
    const words = text.toLowerCase().split(/\s+/)
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]

    // Filter out common words and count occurrences
    const wordCounts: Record<string, number> = {}
    words.forEach((word) => {
      if (word.length > 3 && !commonWords.includes(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      }
    })

    // Find the most common word
    let maxCount = 0
    let mainTopic = "various topics"

    for (const word in wordCounts) {
      if (wordCounts[word] > maxCount) {
        maxCount = wordCounts[word]
        mainTopic = word
      }
    }

    return mainTopic
  }

  const generateKeyPoints = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(Boolean)

    // Take up to 4 sentences as key points
    return sentences
      .filter((sentence) => sentence.trim().length > 10)
      .slice(0, 4)
      .map((sentence) => sentence.trim())
  }

  const generateTags = (text: string) => {
    const words = text.toLowerCase().split(/\s+/)
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]

    // Filter out common words and get unique words
    const uniqueWords = [...new Set(words.filter((word) => word.length > 4 && !commonWords.includes(word)))]

    // Take up to 5 words as tags
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    ]

    return uniqueWords.slice(0, 5).map((word, index) => ({
      name: word.charAt(0).toUpperCase() + word.slice(1),
      color: colors[index % colors.length],
    }))
  }

  const generateFlashcards = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(Boolean)
    const flashcards = []

    // Create flashcards from sentences
    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const sentence = sentences[i].trim()
      if (sentence.length < 10) continue

      const words = sentence.split(/\s+/)
      if (words.length < 4) continue

      // Create a question by removing a key word
      const keyWordIndex = Math.floor(words.length / 2)
      const keyWord = words[keyWordIndex].replace(/[^a-zA-Z0-9]/g, "")

      const question = [...words]
      question[keyWordIndex] = "________"

      flashcards.push({
        front: question.join(" "),
        back: keyWord,
        tags: ["concept", "term"],
      })
    }

    return flashcards
  }

  const generateQuestions = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(Boolean)
    const questions = []

    // Create questions from sentences
    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const sentence = sentences[i].trim()
      if (sentence.length < 15) continue

      const words = sentence.split(/\s+/)
      if (words.length < 5) continue

      // Convert sentence to question
      let question = ""
      let answer = "This is a sample answer based on the context of your notes."
      const explanation = "This explanation provides more context about the answer."
      let options = null
      let type = "short-answer"

      if (i % 3 === 0) {
        // Multiple choice question
        type = "multiple-choice"
        const questionWords = ["What", "How", "Why", "When", "Where"]
        question = `${questionWords[i % questionWords.length]} ${sentence.toLowerCase()}?`

        // Generate options
        const correctAnswer = `Answer based on ${getMainTopic(text)}`
        options = [correctAnswer, "Incorrect option 1", "Incorrect option 2", "Incorrect option 3"]
        answer = correctAnswer
      } else if (i % 3 === 1) {
        // Fill in the blank
        type = "fill-in-blank"
        const blankIndex = Math.floor(words.length / 2)
        const blankWord = words[blankIndex]
        words[blankIndex] = "_______"
        question = words.join(" ")
        answer = blankWord
      } else {
        // Short answer
        const questionWords = ["Explain", "Describe", "Discuss", "Analyze", "Compare"]
        question = `${questionWords[i % questionWords.length]} ${getMainTopic(text)} in relation to ${words[words.length - 1]}.`
      }

      questions.push({
        id: i.toString(),
        text: question,
        type,
        options,
        answer,
        explanation,
      })
    }

    return questions
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="text-yellow-400">✨</span> Input Your Study Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your study notes here or drag & drop a file. Our AI will transform them into summaries, flashcards, and practice questions!"
          value={inputText}
          onChange={handleTextChange}
          className="min-h-[200px] resize-y bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
          disabled={isProcessing}
        />

        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            {fileName && (
              <div className="flex items-center gap-1 mr-3">
                <FileText className="h-4 w-4" />
                <span>{fileName}</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={triggerFileInput}
              size="sm"
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload File
            </Button>
          </div>
          <div>
            {inputText.length} / {MAX_CHARS} characters
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleProcess}
          disabled={!inputText.trim() || isProcessing}
          className="w-[90%] bg-study-purple hover:bg-study-blue text-white py-6"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" /> Summarize My Notes!
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

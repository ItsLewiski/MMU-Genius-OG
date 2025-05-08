"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/types"
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { safeGet, safeMap, safeArrayAccess } from "@/lib/safe-data"

interface QASectionProps {
  questions?: Question[] | null
}

export function QASection({ questions }: QASectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasQuestions, setHasQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  // Check if we have valid questions and set the current question
  useEffect(() => {
    const validQuestions = Array.isArray(questions) && questions.length > 0
    setHasQuestions(validQuestions)

    if (validQuestions) {
      setCurrentQuestion(safeArrayAccess(questions, currentIndex, null))
    } else {
      setCurrentQuestion(null)
    }
  }, [questions, currentIndex])

  // Handle case where questions is undefined, null, or empty
  if (!hasQuestions) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Practice Questions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-400">No questions available. Process your notes to generate practice questions.</p>
        </CardContent>
      </Card>
    )
  }

  // If we don't have a current question, show a fallback
  if (!currentQuestion) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Practice Questions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-400">Error loading question. Please try again.</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-study-accent hover:bg-study-accent2 text-black font-medium"
          >
            Reload
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const handleNext = () => {
    if (questions && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
      setShowAnswer(false)
      setIsCorrect(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setUserAnswer("")
      setShowAnswer(false)
      setIsCorrect(null)
    }
  }

  const handleSubmit = () => {
    if (!userAnswer || !currentQuestion) return

    const correctAnswer = safeGet(currentQuestion, "answer", "").toLowerCase()
    const correct = userAnswer.toLowerCase() === correctAnswer
    setIsCorrect(correct)
    setShowAnswer(true)
  }

  const handleOptionSelect = (option: string) => {
    setUserAnswer(option)
  }

  const questionText = safeGet(currentQuestion, "text", "Question not available")
  const questionType = safeGet(currentQuestion, "type", "short-answer")
  const options = safeGet(currentQuestion, "options", [])
  const answer = safeGet(currentQuestion, "answer", "Answer not available")
  const explanation = safeGet(currentQuestion, "explanation", "No explanation available")
  const questionsLength = Array.isArray(questions) ? questions.length : 0

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Practice Questions</CardTitle>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} of {questionsLength}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">{questionText}</h3>

          {questionType === "multiple-choice" && options.length > 0 && (
            <RadioGroup value={userAnswer} className="space-y-2">
              {safeMap(options, (option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    disabled={showAnswer}
                    onClick={() => handleOptionSelect(option)}
                  />
                  <Label htmlFor={`option-${index}`} className="text-gray-200">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {(questionType === "fill-in-blank" || questionType === "short-answer") && (
            <Input
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showAnswer}
              className="max-w-md bg-gray-800 border-gray-700 text-gray-100"
            />
          )}
        </div>

        {showAnswer && (
          <div className={cn("p-4 rounded-lg", isCorrect ? "bg-green-900/20" : "bg-red-900/20")}>
            <h4 className={cn("font-medium mb-2", isCorrect ? "text-green-300" : "text-red-300")}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </h4>
            <p className="text-sm text-gray-200">
              <span className="font-medium">Answer: </span>
              {answer}
            </p>
            <p className="text-sm mt-2 text-gray-200">
              <span className="font-medium">Explanation: </span>
              {explanation}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === questionsLength - 1}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="flex gap-2">
          {!showAnswer ? (
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="bg-study-accent hover:bg-study-accent2 text-black font-medium"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={() => {
                setShowAnswer(false)
                setUserAnswer("")
                setIsCorrect(null)
              }}
              variant="outline"
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/types"
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QASectionProps {
  questions: Question[]
}

export function QASection({ questions }: QASectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentQuestion = questions[currentIndex]

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
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
    if (!userAnswer) return

    const correct = userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()
    setIsCorrect(correct)
    setShowAnswer(true)
  }

  const handleOptionSelect = (option: string) => {
    setUserAnswer(option)
  }

  if (!currentQuestion) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p>No questions available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Practice Questions</CardTitle>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {questions.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{currentQuestion.text}</h3>

          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <RadioGroup value={userAnswer} className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    disabled={showAnswer}
                    onClick={() => handleOptionSelect(option)}
                  />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {(currentQuestion.type === "fill-in-blank" || currentQuestion.type === "short-answer") && (
            <Input
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showAnswer}
              className="max-w-md"
            />
          )}
        </div>

        {showAnswer && (
          <div
            className={cn(
              "p-4 rounded-lg",
              isCorrect ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20",
            )}
          >
            <h4
              className={cn(
                "font-medium mb-2",
                isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300",
              )}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </h4>
            <p className="text-sm">
              <span className="font-medium">Answer: </span>
              {currentQuestion.answer}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Explanation: </span>
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext} disabled={currentIndex === questions.length - 1}>
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

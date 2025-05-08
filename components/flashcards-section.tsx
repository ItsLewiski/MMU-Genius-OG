"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuffle, ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import type { Flashcard } from "@/types"
import { cn } from "@/lib/utils"

interface FlashcardsSectionProps {
  flashcards: Flashcard[]
  onUpdateFlashcards: (flashcards: Flashcard[]) => void
}

export function FlashcardsSection({ flashcards, onUpdateFlashcards }: FlashcardsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [animation, setAnimation] = useState("")

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setAnimation("slide-out-left")
      setTimeout(() => {
        setFlipped(false)
        setCurrentIndex(currentIndex + 1)
        setAnimation("slide-in-right")
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setAnimation("slide-out-right")
      setTimeout(() => {
        setFlipped(false)
        setCurrentIndex(currentIndex - 1)
        setAnimation("slide-in-left")
      }, 300)
    }
  }

  const handleFlip = () => {
    setAnimation("flip")
    setTimeout(() => {
      setFlipped(!flipped)
    }, 150)
  }

  const handleShuffle = () => {
    setAnimation("slide-out-left")
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * flashcards.length)
      setFlipped(false)
      setCurrentIndex(randomIndex)
      setAnimation("slide-in-right")
    }, 300)
  }

  const markAsKnown = (known: boolean) => {
    const updatedFlashcards = [...flashcards]
    updatedFlashcards[currentIndex] = {
      ...updatedFlashcards[currentIndex],
      known,
    }
    onUpdateFlashcards(updatedFlashcards)
    handleNext()
  }

  if (!currentCard) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p>No flashcards available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Flashcards</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {flashcards.length}
          </span>
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative min-h-[300px] cursor-pointer",
            animation === "flip" && "animate-[flip_0.3s_ease-in-out]",
            animation === "slide-out-left" && "animate-[slideOutLeft_0.3s_ease-in-out]",
            animation === "slide-in-right" && "animate-[slideInRight_0.3s_ease-in-out]",
            animation === "slide-out-right" && "animate-[slideOutRight_0.3s_ease-in-out]",
            animation === "slide-in-left" && "animate-[slideInLeft_0.3s_ease-in-out]",
          )}
          onClick={handleFlip}
        >
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-6 rounded-lg border-2",
              flipped ? "border-study-purple bg-study-purple/5" : "border-study-blue bg-study-blue/5",
            )}
          >
            <div className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
              {flipped ? "Answer" : "Question"}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">{flipped ? currentCard.back : currentCard.front}</p>
            </div>
            <div className="absolute bottom-2 text-xs text-muted-foreground">Click to flip</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-500 hover:bg-red-500/10" onClick={() => markAsKnown(false)}>
            <X className="h-4 w-4 mr-2 text-red-500" />
            Don't Know
          </Button>
          <Button
            variant="outline"
            className="border-green-500 hover:bg-green-500/10"
            onClick={() => markAsKnown(true)}
          >
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Know
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

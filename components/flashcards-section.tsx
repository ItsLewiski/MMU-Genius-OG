"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Shuffle, Edit, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Flashcard } from "@/types"
import { cn } from "@/lib/utils"
import { safeGet, safeMap, safeArrayAccess } from "@/lib/safe-data"

interface FlashcardsSectionProps {
  flashcards?: Flashcard[] | null
  onUpdateFlashcards?: (flashcards: Flashcard[]) => void
}

export function FlashcardsSection({ flashcards, onUpdateFlashcards }: FlashcardsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFront, setEditFront] = useState("")
  const [editBack, setEditBack] = useState("")
  const [editTags, setEditTags] = useState("")
  const [hasFlashcards, setHasFlashcards] = useState(false)
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null)
  const [cardDeck, setCardDeck] = useState<Flashcard[]>([])

  // Initialize and validate flashcards
  useEffect(() => {
    const validFlashcards = Array.isArray(flashcards) && flashcards.length > 0
    setHasFlashcards(validFlashcards)

    if (validFlashcards) {
      setCardDeck(flashcards)
      setCurrentFlashcard(safeArrayAccess(flashcards, currentIndex, null))
    } else {
      setCardDeck([])
      setCurrentFlashcard(null)
    }
  }, [flashcards])

  // Update current flashcard when index changes
  useEffect(() => {
    if (hasFlashcards) {
      setCurrentFlashcard(safeArrayAccess(cardDeck, currentIndex, null))
    }
  }, [currentIndex, cardDeck, hasFlashcards])

  // Update edit fields when current flashcard changes
  useEffect(() => {
    if (currentFlashcard) {
      setEditFront(safeGet(currentFlashcard, "front", ""))
      setEditBack(safeGet(currentFlashcard, "back", ""))
      setEditTags(safeGet(currentFlashcard, "tags", []).join(", "))
    }
  }, [currentFlashcard])

  // Handle case where flashcards is undefined, null, or empty
  if (!hasFlashcards) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Flashcards</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p className="text-gray-400">No flashcards available. Process your notes to generate flashcards.</p>
        </CardContent>
      </Card>
    )
  }

  // If we don't have a current flashcard, show a fallback
  if (!currentFlashcard) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Flashcards</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p className="text-gray-400">Error loading flashcard. Please try again.</p>
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
    if (currentIndex < cardDeck.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleShuffle = () => {
    // Create a shuffled copy of the flashcards
    const shuffled = [...cardDeck].sort(() => Math.random() - 0.5)
    setCardDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!currentFlashcard) return

    // Create updated flashcard
    const updatedFlashcard: Flashcard = {
      ...currentFlashcard,
      front: editFront,
      back: editBack,
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    // Update the deck
    const updatedDeck = [...cardDeck]
    updatedDeck[currentIndex] = updatedFlashcard
    setCardDeck(updatedDeck)
    setCurrentFlashcard(updatedFlashcard)

    // Call the update callback if provided
    if (onUpdateFlashcards) {
      onUpdateFlashcards(updatedDeck)
    }

    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Reset edit fields to current flashcard values
    if (currentFlashcard) {
      setEditFront(safeGet(currentFlashcard, "front", ""))
      setEditBack(safeGet(currentFlashcard, "back", ""))
      setEditTags(safeGet(currentFlashcard, "tags", []).join(", "))
    }
    setIsEditing(false)
  }

  const front = safeGet(currentFlashcard, "front", "Front content not available")
  const back = safeGet(currentFlashcard, "back", "Back content not available")
  const tags = safeGet(currentFlashcard, "tags", [])

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Flashcards</CardTitle>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} of {cardDeck.length}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Front</label>
              <Input
                value={editFront}
                onChange={(e) => setEditFront(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Back</label>
              <Input
                value={editBack}
                onChange={(e) => setEditBack(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "min-h-[200px] flex items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-500 transform",
              isFlipped ? "bg-gray-800" : "bg-gray-800/50",
              isFlipped ? "rotate-y-180" : "",
            )}
            onClick={handleFlip}
          >
            <div className={cn("text-center", isFlipped ? "hidden" : "block")}>
              <p className="text-xl font-medium text-white">{front}</p>
              <p className="text-sm text-gray-400 mt-2">Click to reveal answer</p>
            </div>
            <div className={cn("text-center", isFlipped ? "block" : "hidden")}>
              <p className="text-xl font-medium text-white">{back}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {safeMap(tags, (tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-700 text-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isEditing}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === cardDeck.length - 1 || isEditing}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-study-accent hover:bg-study-accent2 text-black font-medium">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleShuffle}
                className="border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button onClick={handleEdit} className="bg-study-accent hover:bg-study-accent2 text-black font-medium">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

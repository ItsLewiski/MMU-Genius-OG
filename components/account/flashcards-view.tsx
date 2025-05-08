"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FlashlightIcon, Search, Play, Check, X } from "lucide-react"
import type { UserActivity, Flashcard } from "@/types/auth"
import { updateFlashcardStatus } from "@/lib/auth"

interface FlashcardsViewProps {
  flashcardActivities: UserActivity[]
  userId: string
}

export function FlashcardsView({ flashcardActivities, userId }: FlashcardsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSet, setSelectedSet] = useState<UserActivity | null>(null)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Record<string, boolean>>({})

  // Filter flashcard sets based on search term
  const filteredSets = flashcardActivities.filter((set) => set.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get current flashcard when in study mode
  const currentFlashcards = selectedSet?.data || []
  const currentCard = studyMode && currentFlashcards.length > 0 ? currentFlashcards[currentCardIndex] : null

  const handleNextCard = () => {
    if (currentCardIndex < currentFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // End of deck
      setStudyMode(false)
      setCurrentCardIndex(0)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleMarkCard = (known: boolean) => {
    if (!currentCard || !selectedSet) return

    // Update in state
    setKnownCards({
      ...knownCards,
      [currentCard.id]: known,
    })

    // Update in storage
    updateFlashcardStatus(userId, selectedSet.id, currentCard.id, known)

    // Move to next card
    handleNextCard()
  }

  const getProgress = () => {
    if (!currentFlashcards.length) return 0
    return Math.round((currentCardIndex / currentFlashcards.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      {!studyMode && !selectedSet && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search flashcard sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Mode */}
      {studyMode && currentCard && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                setStudyMode(false)
                setCurrentCardIndex(0)
                setIsFlipped(false)
              }}
            >
              Back to Flashcards
            </Button>
            <span className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {currentFlashcards.length}
            </span>
          </div>

          <Card className="min-h-[300px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Badge className="mb-4">{isFlipped ? "Answer" : "Question"}</Badge>
                <h3 className="text-xl font-medium">{isFlipped ? currentCard.back : currentCard.front}</h3>
                <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevCard} disabled={currentCardIndex === 0}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-red-500 hover:bg-red-500/10"
                onClick={() => handleMarkCard(false)}
              >
                <X className="h-4 w-4 mr-2 text-red-500" />
                Don't Know
              </Button>
              <Button
                variant="outline"
                className="border-green-500 hover:bg-green-500/10"
                onClick={() => handleMarkCard(true)}
              >
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Know
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleNextCard}
              disabled={currentCardIndex === currentFlashcards.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Flashcard Set Detail */}
      {selectedSet && !studyMode && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedSet(null)}>
              Back to Flashcard Sets
            </Button>
            <Button
              onClick={() => {
                setStudyMode(true)
                setCurrentCardIndex(0)
                setIsFlipped(false)
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Study Now
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedSet.title || "Untitled Flashcards"}</CardTitle>
              <CardDescription>Created on {new Date(selectedSet.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedSet.data && selectedSet.data.length > 0 ? (
                  selectedSet.data.map((card: Flashcard, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-md p-3 bg-muted/20">
                            <Badge className="mb-2">Question</Badge>
                            <p>{card.front}</p>
                          </div>
                          <div className="border rounded-md p-3 bg-muted/20">
                            <Badge className="mb-2">Answer</Badge>
                            <p>{card.back}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No flashcards found in this set</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flashcard Sets List */}
      {!selectedSet && !studyMode && (
        <div className="space-y-4">
          {filteredSets.length > 0 ? (
            filteredSets.map((set, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{set.title || "Untitled Flashcards"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created on {new Date(set.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2">
                        <Badge variant="outline">{set.data?.length || 0} cards</Badge>
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedSet(set)}
                      className="bg-study-blue hover:bg-study-purple text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FlashlightIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No flashcard sets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try a different search term" : "Create your first flashcards to get started"}
              </p>
              <Button onClick={() => (window.location.href = "/")}>Create Flashcards</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

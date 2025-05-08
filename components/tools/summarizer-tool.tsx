"use client"

import { useState } from "react"
import { InputSection } from "@/components/input-section"
import { SummarySection } from "@/components/summary-section"
import { FlashcardsSection } from "@/components/flashcards-section"
import { QASection } from "@/components/qa-section"
import type { ProcessedNotes } from "@/types"

export function SummarizerTool() {
  const [processedData, setProcessedData] = useState<ProcessedNotes | null>(null)

  const handleProcessComplete = (data: ProcessedNotes) => {
    setProcessedData(data)
    // Scroll to results after processing
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 w-[90%]">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Study Notes Summarizer</h1>

      {/* Input section - always visible */}
      <InputSection onProcessComplete={handleProcessComplete} />

      {/* Results sections - always visible but conditionally populated */}
      <div id="results-section" className="space-y-8 mt-8">
        {processedData ? (
          <>
            <SummarySection summary={processedData.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 bg-card">
                <FlashcardsSection flashcards={processedData.flashcards} onUpdateFlashcards={() => {}} />
              </div>
              <div className="border rounded-lg p-6 bg-card">
                <QASection questions={processedData.questions} />
              </div>
            </div>
          </>
        ) : (
          <div className="border rounded-lg p-8 bg-card text-center">
            <h2 className="text-xl font-semibold mb-4">Your Results Will Appear Here</h2>
            <p className="text-muted-foreground">
              Enter your study notes above and click "Summarize My Notes!" to generate a summary, flashcards, and
              practice questions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { InputSection } from "@/components/input-section"
import { SummarySection } from "@/components/summary-section"
import { FlashcardsSection } from "@/components/flashcards-section"
import { QASection } from "@/components/qa-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Summary, Flashcard, Question } from "@/types"

interface ProcessedData {
  summary: Summary
  flashcards: Flashcard[]
  questions: Question[]
}

export default function SummarizerPage() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [activeTab, setActiveTab] = useState<string>("summary")

  const handleProcessComplete = (data: ProcessedData) => {
    setProcessedData(data)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Study Notes Summarizer</h1>
      <p className="text-center mb-8 text-gray-300">
        Transform your study notes into concise summaries, flashcards, and practice questions
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InputSection onProcessComplete={handleProcessComplete} />
        </div>

        <div>
          {processedData ? (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 bg-gray-800">
                  <TabsTrigger
                    value="summary"
                    className="data-[state=active]:bg-study-purple data-[state=active]:text-white"
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="flashcards"
                    className="data-[state=active]:bg-study-purple data-[state=active]:text-white"
                  >
                    Flashcards
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="data-[state=active]:bg-study-purple data-[state=active]:text-white"
                  >
                    Practice Questions
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <SummarySection summary={processedData.summary} />
                </TabsContent>
                <TabsContent value="flashcards">
                  <FlashcardsSection flashcards={processedData.flashcards} />
                </TabsContent>
                <TabsContent value="questions">
                  <QASection questions={processedData.questions} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <SummarySection summary={null} />
          )}
        </div>
      </div>
    </div>
  )
}

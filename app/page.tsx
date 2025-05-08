"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FlashcardsSection } from "@/components/flashcards-section"
import { QASection } from "@/components/qa-section"
import { PageLayout } from "@/components/layout/page-layout"
import type { ProcessedNotes, Flashcard } from "@/types"
import { saveUserActivity } from "@/lib/auth"
import { ErrorHandler } from "@/components/error-handler"
import { HomeHero } from "@/components/homepage/home-hero"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { wasRecentlyPrefetched } from "@/lib/prefetch"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FlashlightIcon, HelpCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [processedData, setProcessedData] = useState<ProcessedNotes | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Initialize scroll animations
  useScrollAnimation()

  // Optimized data loading
  useEffect(() => {
    // Start performance measurement
    const startTime = performance.now()

    const loadUserData = async () => {
      try {
        // Check if we're coming from login with prefetched data
        const isPrefetched = wasRecentlyPrefetched()

        // If we have a user and data was prefetched, we can skip loading
        if (user && isPrefetched) {
          setIsLoading(false)
          const endTime = performance.now()
          console.log(`Homepage data loaded from prefetch in ${Math.round(endTime - startTime)}ms`)
          return
        }

        // Otherwise, we need to load data normally
        if (user) {
          // Load any additional data needed for the homepage
          // This would normally be an API call, but we're using localStorage in this demo

          // Simulate network delay for demo purposes (remove in production)
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        // Data loading complete
        setIsLoading(false)
        const endTime = performance.now()
        console.log(`Homepage data loaded in ${Math.round(endTime - startTime)}ms`)
      } catch (error) {
        console.error("Error loading homepage data:", error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleProcessComplete = (data: ProcessedNotes) => {
    setProcessedData(data)
    setFlashcards(data.flashcards)

    // Save activity if user is logged in
    if (user) {
      const title = data.summary.tags.length > 0 ? data.summary.tags[0].name : "Study Notes"
      saveUserActivity(user.id, "summary", title, data)
    }
  }

  const handleUpdateFlashcards = (updatedFlashcards: Flashcard[]) => {
    setFlashcards(updatedFlashcards)
  }

  const renderContent = () => {
    if (isLoading) {
      return <HomepageLoadingSkeleton />
    }

    return (
      <>
        {/* Hero section with tool section integrated */}
        <HomeHero processedData={processedData} handleProcessComplete={handleProcessComplete} />

        {/* Show tabs only after processing data */}
        {processedData && (
          <div className="container py-8 max-w-4xl mx-auto">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="flex items-center gap-2">
                  <FlashlightIcon className="h-4 w-4" />
                  Flashcards
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Q&A
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-0">
                <div className="border rounded-lg p-6 bg-card">
                  <h2 className="text-2xl font-bold mb-4">Summary</h2>
                  <div className="prose dark:prose-invert max-w-none">{processedData.summary.content}</div>
                </div>
              </TabsContent>

              <TabsContent value="flashcards" className="mt-0">
                <div className="border rounded-lg p-6 bg-card">
                  {flashcards.length > 0 ? (
                    <FlashcardsSection flashcards={flashcards} onUpdateFlashcards={handleUpdateFlashcards} />
                  ) : (
                    <div className="text-center p-8">
                      <h2 className="text-xl font-bold mb-2">No Flashcards Yet</h2>
                      <p className="text-muted-foreground mb-4">
                        Process your study notes first to generate flashcards.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="qa" className="mt-0">
                <div className="border rounded-lg p-6 bg-card">
                  {processedData?.questions ? (
                    <QASection questions={processedData.questions} />
                  ) : (
                    <div className="text-center p-8">
                      <h2 className="text-xl font-bold mb-2">No Practice Questions Yet</h2>
                      <p className="text-muted-foreground mb-4">
                        Process your study notes first to generate practice questions.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </>
    )
  }

  return (
    <ErrorHandler>
      <PageLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </PageLayout>
    </ErrorHandler>
  )
}

// Loading skeleton component for the homepage
function HomepageLoadingSkeleton() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="md:w-1/2 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </div>

      <div className="mt-16">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

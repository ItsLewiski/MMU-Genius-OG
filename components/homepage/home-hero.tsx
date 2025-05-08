"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Check,
  BookOpen,
  Brain,
  BookCheck,
  PencilRuler,
  FileText,
  MessageSquare,
  Shield,
  FlashlightIcon,
  HelpCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { MmuGeniusLogo } from "@/components/logo"
import { InputSection } from "@/components/input-section"
import { SummarySection } from "@/components/summary-section"
import { FlashcardsSection } from "@/components/flashcards-section"
import { QASection } from "@/components/qa-section"
import type { ProcessedNotes } from "@/types"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface HomeHeroProps {
  processedData: ProcessedNotes | null
  handleProcessComplete: (data: ProcessedNotes) => void
}

export function HomeHero({ processedData, handleProcessComplete }: HomeHeroProps) {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<"summary" | "flashcards" | "qa">("summary")

  // Initialize scroll animations
  useScrollAnimation()

  // Handle cursor following effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Google Site Verification */}
      <meta name="google-site-verification" content="BKeXdU1ZLbzRGlKmFT8mTEgB44kPi8b69V-n9H83JHo" />
      <div className="w-full">
        {/*Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5FZQDWNFJ9"></script>
        <script>
          {`  
       window.dataLayer = window.dataLayer || [];  
       function gtag(){dataLayer.push(arguments);}  
       gtag('js', new Date());  

       gtag('config', 'G-5FZQDWNFJ9');  
     `}
        </script>
        {/*Consent Managemant */}

        <script
          type="text/javascript"
          data-cmp-ab="1"
          src="https://cdn.consentmanager.net/delivery/autoblocking/4c0c352342475.js"
          data-cmp-host="d.delivery.consentmanager.net"
          data-cmp-cdn="cdn.consentmanager.net"
          data-cmp-codesrc="16"
        ></script>

        {/* Hero Section with cursor following effect */}
        <div
          ref={heroRef}
          className="container py-12 md:py-16 flex flex-col-reverse md:flex-row items-center gap-8 relative overflow-hidden"
        >
          {/* Animated gradient blob that follows cursor */}
          <div
            className="absolute pointer-events-none opacity-50 blur-3xl bg-gradient-to-r from-study-purple/30 to-study-blue/30 rounded-full w-96 h-96 transition-all duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
              opacity: "0.4",
            }}
          />

          <div className="md:w-1/2 space-y-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center md:text-left animate-fade-in">
              Get Ahead of the Bottom 99%
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl text-center md:text-left animate-slide-up">
              Instantly convert your notes into summaries, flashcards, and practice questions to study more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up">
              <Button
                className="bg-study-purple hover:bg-study-blue text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById("study-tool-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                <FileText className="h-5 w-5 mr-2" />
                Try Study Tool Now
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative z-10">
            {/* Direct logo display without enclosing box */}
            <div className="flex flex-col items-center justify-center">
              <div className="logo-container animate-float">
                <MmuGeniusLogo width={120} height={120} priority responsive className="hero-logo animate-pulse-slow" />
              </div>
              <h2 className="text-2xl font-bold mt-4 text-center bg-gradient-to-r from-study-blue to-study-purple bg-clip-text text-transparent animate-pulse-slow">
                MMU Genius
              </h2>
              <p className="text-sm text-muted-foreground text-center">AI-Powered Study Assistant</p>
            </div>
          </div>
        </div>

        {/* Study Tool Section - Directly below hero */}
        <div id="study-tool-section" className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container">
            <div className="text-center mb-8 animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Transform Your Notes with AI</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Paste your study notes below and our AI will instantly create summaries, flashcards, and practice
                questions.
              </p>
            </div>

            {!processedData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="animate-on-scroll">
                  <InputSection onProcessComplete={handleProcessComplete} />
                </div>
                <div className="animate-on-scroll">
                  <div className="h-full flex items-center justify-center p-8 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold">Your Summary Will Appear Here</h3>
                      <p className="text-muted-foreground">
                        After processing your notes, you'll see a concise summary with key points and tags.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
                  {/* Top row */}
                  <div className="animate-on-scroll">
                    <InputSection onProcessComplete={handleProcessComplete} />
                  </div>
                  <div className="animate-on-scroll">
                    <SummarySection summary={processedData.summary} />
                  </div>

                  {/* Bottom row */}
                  <div className="animate-on-scroll">
                    <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
                      <h3 className="text-xl font-bold mb-4">Study Tools</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => setActiveSection("flashcards")}
                          className={`${
                            activeSection === "flashcards" ? "bg-study-blue" : "bg-study-purple"
                          } hover:bg-study-blue text-white p-4 h-auto flex flex-col items-center gap-2`}
                        >
                          <FlashlightIcon className="h-6 w-6" />
                          <span>Flashcards</span>
                        </Button>
                        <Button
                          onClick={() => setActiveSection("qa")}
                          className={`${
                            activeSection === "qa" ? "bg-study-blue" : "bg-study-purple"
                          } hover:bg-study-blue text-white p-4 h-auto flex flex-col items-center gap-2`}
                        >
                          <HelpCircle className="h-6 w-6" />
                          <span>Practice Q&A</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="animate-on-scroll">
                    <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
                      <h3 className="text-xl font-bold mb-4">Key Points</h3>
                      <ul className="space-y-2">
                        {processedData.summary.keyPoints?.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-study-purple">•</div>
                            <div>{point}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Study content based on active section */}
                <div className="max-w-5xl mx-auto">
                  {activeSection === "flashcards" && (
                    <div id="flashcards-section" className="animate-on-scroll">
                      <FlashcardsSection flashcards={processedData.flashcards || []} />
                    </div>
                  )}

                  {activeSection === "qa" && (
                    <div id="qa-section" className="animate-on-scroll">
                      <QASection questions={processedData.questions || []} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transform Your Learning Experience Section - Moved to appear after the tool section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16" id="transform-section">
          <div className="container">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Transform Your Learning Experience</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered tools help you study smarter, not harder. Don't waste precious time on inefficient study
                methods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Summarizer Tool */}
              <div className="relative overflow-hidden rounded-xl border-2 border-study-purple transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="absolute top-0 right-0 bg-study-purple text-white px-4 py-1 font-bold text-sm">
                  ESSENTIAL
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-study-purple/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-study-purple" />
                    </div>
                    <h3 className="text-xl font-bold">Summarizer</h3>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg font-bold text-study-purple mb-2">⏱️ Stop Wasting Hours on Notes!</p>
                    <p className="text-base mb-4">
                      Students who don't use our summarizer spend 3x longer studying the same material. Get concise
                      summaries in seconds.
                    </p>
                  </div>

                  <Button onClick={scrollToTop} className="w-full bg-study-purple hover:bg-study-blue text-white py-3">
                    Summarize Your Notes
                  </Button>
                </div>
              </div>

              {/* Humaniser Tool */}
              <div className="relative overflow-hidden rounded-xl border-2 border-study-purple transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="absolute top-0 right-0 bg-study-purple text-white px-4 py-1 font-bold text-sm">
                  URGENT
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-study-purple/20 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-study-purple" />
                    </div>
                    <h3 className="text-xl font-bold">Humaniser</h3>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg font-bold text-study-purple mb-2">🔥 Don't Risk Academic Penalties! 🔥</p>
                    <p className="text-base mb-4">
                      Universities are cracking down on AI text. Make your AI-generated assignments undetectable or face
                      serious consequences.
                    </p>
                  </div>

                  <Button
                    onClick={() => router.push("/tools/humaniser")}
                    className="w-full bg-study-purple hover:bg-study-blue text-white py-3"
                  >
                    Humanise Your Text Now
                  </Button>
                </div>
              </div>

              {/* AI Detector Tool */}
              <div className="relative overflow-hidden rounded-xl border-2 border-study-purple transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="absolute top-0 right-0 bg-study-purple text-white px-4 py-1 font-bold text-sm">
                  WARNING
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-study-purple/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-study-purple" />
                    </div>
                    <h3 className="text-xl font-bold">AI Detector</h3>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg font-bold text-study-purple mb-2">❌ Plagiarism Check Won't Save You! ❌</p>
                    <p className="text-base mb-4">
                      Your professors use AI detectors on every submission. Check your work before they do or risk
                      failing your course.
                    </p>
                  </div>

                  <Button
                    onClick={() => router.push("/tools/ai-detector")}
                    className="w-full bg-study-purple hover:bg-study-blue text-white py-3"
                  >
                    Detect AI Content
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-white dark:bg-gray-800 py-16">
          <div className="container">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform transforms how you study. Follow these simple steps to boost your learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <PencilRuler className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. Input Your Notes</h3>
                  <p className="text-muted-foreground">Copy and paste your study notes or upload a text file.</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">2. AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI reads and comprehends your notes to extract key information.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">3. Generate Content</h3>
                  <p className="text-muted-foreground">
                    Receive a concise summary, flashcards, and practice questions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                    <BookCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">4. Study & Improve</h3>
                  <p className="text-muted-foreground">Use the generated materials to enhance your learning.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Rest of the content remains the same */}
        {/* Our Story Section - Two Column Layout */}
        <div className="container py-16">
          <div className="text-center mb-8 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-on-scroll">
              <p className="text-lg text-muted-foreground mb-4">
                MMU Genius was born from a simple observation: students spend too much time organizing and summarizing
                information, and not enough time actually learning it.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Founded by students at Multimedia University of Kenya, MMU Genius is designed to help fellow students
                learn more effectively. We use cutting-edge AI technology to transform traditional study methods into an
                interactive, efficient learning experience.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is to make quality study tools accessible to all students, regardless of their background or
                resources. We believe that everyone deserves the opportunity to excel in their education.
              </p>
            </div>
            <div className="flex justify-center animate-on-scroll">
              <div className="logo-container relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-study-purple/20 to-study-blue/20 rounded-full blur-xl opacity-70"></div>
                <MmuGeniusLogo width={180} height={180} priority responsive className="hero-logo relative z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                MMU Genius offers key advantages that make studying more efficient and effective.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p className="text-muted-foreground">
                  Transform hours of manual note-taking and summarizing into seconds with our AI tools.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Optimize Learning</h3>
                <p className="text-muted-foreground">
                  Our scientifically designed learning tools help you retain information better and longer.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Always Available</h3>
                <p className="text-muted-foreground">
                  Access your study materials anytime, anywhere, from any device with an internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="container py-16">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best fits your needs and start studying smarter today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">🎉 Free Plan</h3>
                    <p className="text-muted-foreground">Get started at no cost</p>
                  </div>
                  <div className="text-3xl font-bold">$0</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Limited to 5 flashcards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Limited character count for notes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>No customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>No priority processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>No access to premium templates</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button disabled className="w-full bg-gray-100 hover:bg-gray-100 text-black">
                  You're on this plan 🚀
                </Button>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="border rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">🔹 Standard Plan</h3>
                    <p className="text-muted-foreground">More power for students</p>
                  </div>
                  <div className="text-3xl font-bold">
                    $2<span className="text-base font-normal">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Up to 10 flashcards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Higher character limit for notes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Basic customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Faster processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to some premium templates</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button className="w-full bg-study-blue hover:bg-study-purple text-white">Pick Plan</Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-study-purple rounded-lg overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-on-scroll">
              <div className="absolute top-0 right-0 bg-study-purple text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Best Value
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">🔥 Premium Plan</h3>
                    <p className="text-muted-foreground">Ultimate learning experience</p>
                  </div>
                  <div className="text-3xl font-bold">
                    $5<span className="text-base font-normal">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Up to 15,000 characters for notes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited flashcards & practice questions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>24/7 priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Fastest processing speed + AI-powered suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Full access to all premium templates & features</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button className="w-full bg-study-purple hover:bg-study-blue text-white">Subscribe Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

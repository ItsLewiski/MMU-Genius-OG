"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FileText, FlashlightIcon, HelpCircle, MessageSquare, Sparkles, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MmuGeniusLogo } from "@/components/logo"

export default function ToolsPageClient() {
  const router = useRouter()

  const tools = [
    {
      id: "summariser",
      title: "Summarizer",
      description: "Transform your study notes into concise summaries with key points and tags.",
      icon: <FileText className="h-10 w-10 text-study-purple" />,
      action: () => router.push("/"),
      color: "border-study-purple hover:bg-study-purple/5",
      buttonText: "Summarize Notes",
      isPro: false,
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Create interactive flashcards from your notes to improve retention.",
      icon: <FlashlightIcon className="h-10 w-10 text-study-blue" />,
      action: () => router.push("/"),
      color: "border-study-blue hover:bg-study-blue/5",
      buttonText: "Create Flashcards",
      isPro: false,
    },
    {
      id: "qa-generator",
      title: "Q&A Generator",
      description: "Generate practice questions based on your study material.",
      icon: <HelpCircle className="h-10 w-10 text-study-accent" />,
      action: () => router.push("/"),
      color: "border-study-accent hover:bg-study-accent/5",
      buttonText: "Generate Questions",
      isPro: false,
    },
    {
      id: "humaniser",
      title: "Humaniser",
      description: "Convert technical content into easy-to-understand language.",
      icon: <MessageSquare className="h-10 w-10 text-green-500" />,
      action: () => router.push("/tools/humaniser"),
      color: "border-green-500 hover:bg-green-50",
      buttonText: "Humanise Text",
      isPro: true,
    },
    {
      id: "ask-anything",
      title: "Ask Anything",
      description: "Get answers to your specific questions about any topic.",
      icon: <Sparkles className="h-10 w-10 text-amber-500" />,
      action: () => router.push("/tools/ask-anything"),
      color: "border-amber-500 hover:bg-amber-50",
      buttonText: "Ask a Question",
      isPro: true,
    },
    {
      id: "ai-detector",
      title: "AI Detector",
      description: "Analyze text to determine if it was written by AI or a human.",
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      action: () => router.push("/tools/ai-detector"),
      color: "border-blue-500 hover:bg-blue-50",
      buttonText: "Detect AI",
      isPro: true,
    },
  ]

  return (
    <PageLayout>
      <div className="container py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Study Tools</h1>
          <div className="flex justify-center mb-3">
            <MmuGeniusLogo width={56} height={56} responsive priority />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our range of AI-powered tools designed to enhance your learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className={`border-2 ${tool.color} transition-all duration-200`}>
              <CardHeader>
                <div className="flex justify-center mb-4">{tool.icon}</div>
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-xl text-center">{tool.title}</CardTitle>
                  {tool.isPro && <Badge className="bg-study-accent text-black">PRO</Badge>}
                </div>
                <CardDescription className="text-center">{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={tool.action} className="w-full bg-study-purple hover:bg-study-blue text-white">
                  {tool.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-bold mb-4">How to Use These Tools</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Summariser, Flashcards, and Q&A Generator</h3>
              <p className="text-muted-foreground">
                These tools work together. Start by using the Summariser to process your notes, which will automatically
                create Flashcards and Q&A content for you to study with.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Humaniser</h3>
              <p className="text-muted-foreground">
                Use this tool to convert complex or technical content into simpler, more understandable language. After
                humanizing, you can check if the text still appears AI-generated using the AI Detector.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Ask Anything</h3>
              <p className="text-muted-foreground">
                Have a specific question? Use this tool to get direct answers on any topic you're studying.
              </p>
            </div>
            <div>
              <h3 className="font-medium">AI Detector</h3>
              <p className="text-muted-foreground">
                Analyze text to determine if it was written by AI or a human. Useful for checking if your humanized
                content still shows AI patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

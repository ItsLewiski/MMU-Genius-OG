"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Copy, Loader2, MessageSquare, Shield } from "lucide-react"
import { humaniseText, detectAI } from "@/lib/tools"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MmuGeniusLogo } from "@/components/logo"

export default function HumaniserPage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"casual" | "simple" | "eli5">("casual")
  const [aiDetectionResult, setAiDetectionResult] = useState<{ score: number; reason: string } | null>(null)

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to humanise")
      return
    }

    setIsProcessing(true)
    setError(null)
    setAiDetectionResult(null)

    try {
      const result = await humaniseText(inputText, activeTab)
      setOutputText(result)
    } catch (err) {
      console.error("Error humanising text:", err)
      setError("Failed to process your text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDetectAI = async () => {
    if (!outputText.trim()) {
      setError("No humanized text to analyze")
      return
    }

    setIsDetecting(true)
    setError(null)

    try {
      const result = await detectAI(outputText)
      setAiDetectionResult(result)
    } catch (err) {
      console.error("Error detecting AI:", err)
      setError("Failed to analyze the text. Please try again.")
    } finally {
      setIsDetecting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError(null)
    setAiDetectionResult(null)
  }

  const getScoreColor = (score: number) => {
    if (score <= 30) return "bg-green-100 text-green-800 border-green-200"
    if (score <= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold">Humaniser</h1>
            <Badge className="bg-study-accent text-black font-bold">PRO</Badge>
          </div>
          <div className="flex justify-center mb-3">
            <MmuGeniusLogo width={48} height={48} responsive />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform complex or technical content into easy-to-understand language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>Paste your technical or complex text here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter the text you want to simplify..."
                className="min-h-[300px] resize-y"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={handleClear} disabled={isProcessing || !inputText}>
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing || !inputText}
                  className="bg-study-purple hover:bg-study-blue text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Humanise Text
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Humanised Output</CardTitle>
              <CardDescription>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="casual">Casual</TabsTrigger>
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="eli5">ELI5</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {outputText ? (
                <>
                  <div className="border rounded-md p-4 min-h-[300px] bg-muted/20 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{outputText}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={handleDetectAI}
                      disabled={isDetecting}
                      className="flex items-center gap-2"
                    >
                      {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                      Detect AI
                    </Button>
                    <Button variant="outline" onClick={handleCopy}>
                      {copied ? (
                        "Copied!"
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : "Humanised text will appear here"}
                  </p>
                </div>
              )}
            </CardContent>
            {aiDetectionResult && (
              <CardFooter className="flex flex-col">
                <div className="w-full p-4 border rounded-md mb-2 mt-2 bg-muted/10">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">AI Detection Score</h3>
                    <Badge className={getScoreColor(aiDetectionResult.score)}>{aiDetectionResult.score}%</Badge>
                  </div>
                  <Progress
                    value={aiDetectionResult.score}
                    className="h-2 mb-3"
                    indicatorClassName={
                      aiDetectionResult.score <= 30
                        ? "bg-green-500"
                        : aiDetectionResult.score <= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }
                  />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Analysis:</p>
                    <p className="text-muted-foreground">{aiDetectionResult.reason}</p>

                    {aiDetectionResult.score > 60 && (
                      <Alert className="mt-3 bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-800" />
                        <AlertTitle className="text-yellow-800">High AI Detection Score</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          Your text still shows strong AI patterns. Consider re-humanizing with different settings or
                          editing manually.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="mt-8 p-6 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-bold mb-4">How to Use the Humaniser</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Choose Your Style</h3>
              <p className="text-muted-foreground">
                <strong>Casual:</strong> Converts text into a conversational, friendly tone.
                <br />
                <strong>Simple:</strong> Simplifies complex concepts using straightforward language.
                <br />
                <strong>ELI5 (Explain Like I'm 5):</strong> Breaks down concepts to their most basic form.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Best For</h3>
              <p className="text-muted-foreground">
                • Technical documentation
                <br />• Academic papers
                <br />• Complex instructions
                <br />• Scientific concepts
              </p>
            </div>
            <div>
              <h3 className="font-medium">Tips</h3>
              <p className="text-muted-foreground">
                • For best results, input text that is between 100-1000 words
                <br />• The more context you provide, the better the humanised output will be
                <br />• Use the "Detect AI" button to check if your humanized text still appears AI-generated
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

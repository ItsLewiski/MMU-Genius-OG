"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import { detectAI } from "@/lib/tools"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MmuGeniusLogo } from "@/components/logo"

export default function AIDetectorPage() {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ score: number; reason: string } | null>(null)

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const detectionResult = await detectAI(inputText)
      setResult(detectionResult)
    } catch (err) {
      console.error("Error detecting AI:", err)
      setError("Failed to analyze your text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setInputText("")
    setResult(null)
    setError(null)
  }

  const getScoreColor = (score: number) => {
    if (score <= 30) return "bg-green-100 text-green-800 border-green-200"
    if (score <= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getScoreText = (score: number) => {
    if (score <= 30) return "Very likely human-written"
    if (score <= 60) return "Possibly AI-generated"
    return "Likely AI-generated"
  }

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold">AI Detector</h1>
            <Badge className="bg-study-accent text-black font-bold">PRO</Badge>
          </div>
          <div className="flex justify-center mb-3">
            <MmuGeniusLogo width={48} height={48} responsive />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze text to determine if it was written by AI or a human.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Text to Analyze</CardTitle>
              <CardDescription>Paste the text you want to check for AI patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter text to analyze..."
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
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Detect AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
              <CardDescription>Analysis of AI patterns in the provided text</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result ? (
                <div className="border rounded-md p-6 min-h-[300px] bg-muted/20">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">AI Probability Score</h3>
                    <div className="inline-block px-4 py-2 rounded-full mb-2 text-lg font-bold">
                      <Badge className={`${getScoreColor(result.score)} text-lg px-3 py-1`}>{result.score}%</Badge>
                    </div>
                    <p className="text-muted-foreground">{getScoreText(result.score)}</p>
                  </div>

                  <Progress
                    value={result.score}
                    className="h-3 mb-6"
                    indicatorClassName={
                      result.score <= 30 ? "bg-green-500" : result.score <= 60 ? "bg-yellow-500" : "bg-red-500"
                    }
                  />

                  <div>
                    <h4 className="font-medium text-lg mb-2">Analysis</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{result.reason}</p>

                    {result.score > 60 && (
                      <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-800" />
                        <AlertTitle className="text-yellow-800">High AI Detection Score</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          This text shows strong AI patterns. If you're trying to create human-like content, consider
                          using our Humanizer tool to rewrite it.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : "Detection results will appear here"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-bold mb-4">About AI Detection</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">How It Works</h3>
              <p className="text-muted-foreground">
                Our AI detector analyzes text patterns, sentence structures, and word choices to identify
                characteristics commonly found in AI-generated content. The analysis produces a probability score
                indicating how likely the text was written by AI.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Understanding the Score</h3>
              <p className="text-muted-foreground">
                <strong>0-30%:</strong> Very likely human-written with natural language patterns.
                <br />
                <strong>31-60%:</strong> Contains some AI-like patterns but may be human-written or edited.
                <br />
                <strong>61-100%:</strong> Likely AI-generated with typical AI patterns and structures.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Limitations</h3>
              <p className="text-muted-foreground">
                • No AI detector is 100% accurate
                <br />• Short texts may not provide enough patterns for reliable detection
                <br />• Heavily edited AI-generated text may appear more human-like
                <br />• Some human writing styles may trigger false positives
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

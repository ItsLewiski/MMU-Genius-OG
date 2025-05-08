"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Edit, Check } from "lucide-react"
import type { Summary } from "@/types"
import { safeGet, safeMap } from "@/lib/safe-data"
import { useToast } from "@/hooks/use-toast"

interface SummarySectionProps {
  summary?: Summary | null
}

export function SummarySection({ summary }: SummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editedSummary, setEditedSummary] = useState("")
  const { toast } = useToast()

  // Initialize editedSummary when summary changes
  useEffect(() => {
    if (summary) {
      setEditedSummary(safeGet(summary, "text", ""))
    }
  }, [summary])

  // Handle case where summary is undefined or null
  if (!summary) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Your Summary Will Appear Here</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            After processing your notes, you'll see a concise summary with key points and tags.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(editedSummary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "Summary text has been copied to your clipboard.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Failed to copy text:", error)
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    try {
      const element = document.createElement("a")
      const keyPoints = safeGet(summary, "keyPoints", [])

      const file = new Blob(
        ["SUMMARY\n\n", editedSummary, "\n\nKEY POINTS\n\n", safeMap(keyPoints, (point) => `• ${point}`).join("\n")],
        { type: "text/plain" },
      )

      element.href = URL.createObjectURL(file)
      element.download = "study-notes-summary.txt"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Download started",
        description: "Your summary is being downloaded.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Failed to download file:", error)
      toast({
        title: "Download failed",
        description: "Could not download the summary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
    toast({
      title: "Changes saved",
      description: "Your edits to the summary have been saved.",
      duration: 2000,
    })
  }

  const keyPoints = safeGet(summary, "keyPoints", [])
  const tags = safeGet(summary, "tags", [])

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Summary</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="min-h-[200px] resize-y bg-gray-800 border-gray-700 text-gray-100"
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none text-gray-200">
            <p>{editedSummary}</p>
          </div>
        )}

        {keyPoints.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Key Points</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-200">
              {safeMap(keyPoints, (point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {safeMap(tags, (tag, index) => (
                <Badge key={index} className={safeGet(tag, "color", "")}>
                  {safeGet(tag, "name", "Tag")}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSaveEdit} className="bg-study-purple hover:bg-study-blue text-white">
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

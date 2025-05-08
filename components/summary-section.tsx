"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Edit, Check } from "lucide-react"
import type { Summary } from "@/types"

interface SummarySectionProps {
  summary: Summary
}

export function SummarySection({ summary }: SummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary.text)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(editedSummary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob(
      ["SUMMARY\n\n", editedSummary, "\n\nKEY POINTS\n\n", summary.keyPoints.map((point) => `• ${point}`).join("\n")],
      { type: "text/plain" },
    )

    element.href = URL.createObjectURL(file)
    element.download = "study-notes-summary.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Summary</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p>{editedSummary}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Key Points</h3>
          <ul className="list-disc pl-5 space-y-1">
            {summary.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {summary.tags.map((tag, index) => (
              <Badge key={index} className={tag.color}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
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

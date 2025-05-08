"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, Eye, Download } from "lucide-react"
import type { UserActivity } from "@/types/auth"
import { SummarySection } from "@/components/summary-section"

interface SummariesViewProps {
  summaries: UserActivity[]
  userId: string
}

export function SummariesView({ summaries, userId }: SummariesViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSummary, setSelectedSummary] = useState<UserActivity | null>(null)

  // Filter summaries based on search term
  const filteredSummaries = summaries.filter(
    (summary) =>
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (summary.data?.summary?.text && summary.data.summary.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (summary.data?.summary?.tags &&
        summary.data.summary.tags.some((tag: any) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search summaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary List or Detail View */}
      {selectedSummary ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedSummary(null)} className="mb-2">
            Back to Summaries
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedSummary.title || "Untitled Summary"}</CardTitle>
              <CardDescription>Created on {new Date(selectedSummary.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSummary.data?.summary && <SummarySection summary={selectedSummary.data.summary} />}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSummaries.length > 0 ? (
            filteredSummaries.map((summary, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{summary.title || "Untitled Summary"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created on {new Date(summary.date).toLocaleDateString()}
                      </p>

                      {/* Preview of summary text */}
                      {summary.data?.summary?.text && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{summary.data.summary.text}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {summary.data?.summary?.tags?.map((tag: any, idx: number) => (
                          <Badge key={idx} className={tag.color || "bg-gray-100 text-gray-800"}>
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => setSelectedSummary(summary)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => {
                          // Download summary as text file
                          const element = document.createElement("a")
                          const summaryText = summary.data?.summary?.text || "No summary available"
                          const keyPoints =
                            summary.data?.summary?.keyPoints?.map((point: string) => `• ${point}`).join("\n") || ""

                          const content = `# ${summary.title || "Untitled Summary"}
Created on ${new Date(summary.date).toLocaleDateString()}

## Summary
${summaryText}

## Key Points
${keyPoints}
`
                          const file = new Blob([content], { type: "text/plain" })
                          element.href = URL.createObjectURL(file)
                          element.download = `${summary.title || "summary"}-${new Date(summary.date).toISOString().split("T")[0]}.txt`
                          document.body.appendChild(element)
                          element.click()
                          document.body.removeChild(element)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No summaries found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try a different search term" : "Create your first summary to get started"}
              </p>
              <Button onClick={() => (window.location.href = "/")}>Create Summary</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

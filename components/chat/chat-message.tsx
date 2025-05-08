"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, RefreshCw, Copy, Pencil } from "lucide-react"
import { MmuGeniusLogo } from "@/components/logo"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    feedback?: "positive" | "negative" | null
  }
  onRegenerate?: (messageId: string) => void
  onFeedback?: (messageId: string, feedback: "positive" | "negative") => void
  isRegenerating?: boolean
  userInitial: string
}

export function ChatMessage({ message, onRegenerate, onFeedback, isRegenerating, userInitial }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)

  // Format the message content to properly render markdown
  const formatContent = (content: string) => {
    // Replace ** with markdown bold syntax if not already in markdown
    if (!content.includes("**")) {
      content = content.replace(/\*([^*]+)\*/g, "**$1**")
    }
    return content
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        // Could show a toast notification here
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    // This would need to be implemented in the parent component
    // For now, just exit edit mode
    setIsEditing(false)
  }

  return (
    <div
      className={`py-6 px-4 md:px-6 ${message.role === "assistant" ? "bg-muted/50" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="container max-w-4xl flex gap-4">
        {message.role === "assistant" ? (
          <Avatar className="h-8 w-8 bg-study-purple text-white">
            <AvatarFallback>
              <MmuGeniusLogo width={20} height={20} />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 bg-blue-600 text-white">
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 space-y-2 w-[95%]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message.role === "assistant" ? "MMU Genius" : "You"}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isRegenerating ? (
              <div className="flex items-center text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Regenerating response...
              </div>
            ) : isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <ReactMarkdown>{formatContent(message.content)}</ReactMarkdown>
            )}
          </div>

          {message.role === "assistant" && onRegenerate && onFeedback && !isEditing && (
            <div
              className={`flex items-center gap-2 transition-opacity duration-200 ${
                showActions || message.feedback ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onRegenerate(message.id)}
                disabled={isRegenerating}
                title="Regenerate"
              >
                <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleCopy}
                disabled={isRegenerating}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${message.feedback === "positive" ? "bg-green-100 text-green-700" : ""}`}
                onClick={() => onFeedback(message.id, "positive")}
                disabled={isRegenerating}
                title="Thumbs up"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${message.feedback === "negative" ? "bg-red-100 text-red-700" : ""}`}
                onClick={() => onFeedback(message.id, "negative")}
                disabled={isRegenerating}
                title="Thumbs down"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          {message.role === "user" && !isEditing && (
            <div
              className={`flex justify-end transition-opacity duration-200 ${
                showActions ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleEdit}
                title="Edit message"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

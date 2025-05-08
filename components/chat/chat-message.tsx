"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react"
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

  // Format the message content to properly render markdown
  const formatContent = (content: string) => {
    // Replace ** with markdown bold syntax if not already in markdown
    if (!content.includes("**")) {
      content = content.replace(/\*([^*]+)\*/g, "**$1**")
    }
    return content
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

        <div className="flex-1 space-y-2">
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
            ) : (
              <ReactMarkdown>{formatContent(message.content)}</ReactMarkdown>
            )}
          </div>

          {message.role === "assistant" && onRegenerate && onFeedback && (
            <div
              className={`flex items-center gap-2 transition-opacity duration-200 ${
                showActions || message.feedback ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${message.feedback === "positive" ? "bg-green-100 text-green-700" : ""}`}
                  onClick={() => onFeedback(message.id, "positive")}
                  disabled={isRegenerating}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${message.feedback === "negative" ? "bg-red-100 text-red-700" : ""}`}
                  onClick={() => onFeedback(message.id, "negative")}
                  disabled={isRegenerating}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => onRegenerate(message.id)}
                disabled={isRegenerating}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRegenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

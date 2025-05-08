"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"

interface ChatInputProps {
  onSendMessage: (content: string) => void
  isProcessing: boolean
}

export function ChatInput({ onSendMessage, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    // Ensure message is defined and not empty before submitting
    if (message && message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-2">
      <TextareaAutosize
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message MMU Genius..."
        className="flex-1 resize-none border-0 bg-transparent p-2 focus:ring-0 focus:outline-none text-sm md:text-base max-h-[200px] text-foreground dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        disabled={isProcessing}
        minRows={1}
        maxRows={5}
      />
      <Button
        type="button"
        size="icon"
        className="h-10 w-10 rounded-full bg-study-purple hover:bg-study-blue text-white"
        onClick={handleSubmit}
        disabled={isProcessing || !message || !message.trim()}
      >
        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </Button>
    </div>
  )
}

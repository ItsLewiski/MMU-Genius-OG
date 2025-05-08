"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb, X, Send, Loader2 } from "lucide-react"
import { askQuestion } from "@/lib/tools"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [isHidden, setIsHidden] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [hasSeenAssistant, setHasSeenAssistant] = useState(false)

  useEffect(() => {
    // Check if the AI assistant should be hidden
    const shouldHide = localStorage.getItem("ai_assistant_hidden") === "true"
    setIsHidden(shouldHide)

    // Listen for changes to the flag
    const handleStorageChange = () => {
      const shouldHide = localStorage.getItem("ai_assistant_hidden") === "true"
      setIsHidden(shouldHide)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const seen = localStorage.getItem("mmu_genius_assistant_seen") === "true"
    setHasSeenAssistant(seen)
  }, [])

  useEffect(() => {
    let initialMessages: Message[] = []
    let shouldOpen = false

    if (!hasSeenAssistant) {
      // Auto-open assistant for first-time users
      shouldOpen = true

      // Add welcome message
      initialMessages = [
        {
          id: "welcome",
          role: "assistant",
          content: "👋 Hi there! I'm the MMU Genius Assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]

      localStorage.setItem("mmu_genius_assistant_seen", "true")
      setHasSeenAssistant(true)
    }

    setIsOpen(shouldOpen)
    setMessages(initialMessages)
    setHasGreeted(shouldOpen)
  }, [hasSeenAssistant])

  if (isHidden) {
    return null
  }

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when assistant is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)

    try {
      // Get AI response, with special handling for certain questions
      let response = ""

      const lowerCaseInput = inputValue.toLowerCase()
      if (
        lowerCaseInput.includes("who created you") ||
        lowerCaseInput.includes("who made you") ||
        lowerCaseInput.includes("who built you")
      ) {
        response = "Lewiski created me. He is the CEO and Co-Founder of MMU Genius."
      } else if (lowerCaseInput.includes("who is the ceo") || lowerCaseInput.includes("who's the ceo")) {
        response = "Lewiski is the CEO and Co-Founder of MMU Genius."
      } else if (lowerCaseInput.includes("who are the executives")) {
        response =
          "The executives at MMU Genius include Lewiski (CEO and Co-Founder), Emilio (COO), Michael (CFO), Gideon (CTO), and Mricho (CMO)."
      } else {
        // For other questions, get a concise response
        response = await askQuestion(inputValue)
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format text with line breaks
  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* Assistant button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg ${
          isOpen ? "bg-gray-700" : "bg-study-purple"
        } hover:bg-study-blue transition-colors`}
      >
        {isOpen ? <X size={22} /> : <Lightbulb size={22} />}
      </Button>

      {/* Assistant chat window */}
      <Card
        className={`fixed bottom-20 right-4 w-80 sm:w-96 z-50 shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-study-purple text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} />
            <h3 className="font-medium">MMU Genius Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-study-purple/80"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-3 bg-white dark:bg-gray-950 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2 max-w-[85%]">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-study-purple text-white">
                      <Lightbulb size={14} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-2 text-sm ${
                    message.role === "user" ? "bg-study-blue/10 ml-auto" : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {formatText(message.content)}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-study-blue text-white">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[85%]">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-study-purple text-white">
                    <Lightbulb size={14} />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-2 bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center">
                    <Loader2 size={16} className="animate-spin opacity-70" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white dark:bg-gray-950">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="resize-none min-h-[40px] max-h-24"
              rows={1}
              disabled={isProcessing}
            />
            <Button
              size="icon"
              className="h-10 w-10 bg-study-purple hover:bg-study-blue"
              disabled={!inputValue.trim() || isProcessing}
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}

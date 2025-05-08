"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb, X, Send, Loader2, RefreshCw, Copy, ThumbsUp, ThumbsDown, Pencil } from "lucide-react"
import { askQuestion } from "@/lib/tools"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DraggableWrapper } from "@/components/draggable-wrapper"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative" | null
}

export function AIAssistant() {
  const [isHidden, setIsHidden] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [hasSeenAssistant, setHasSeenAssistant] = useState(false)
  const { toast } = useToast()

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
    let seen = false

    try {
      seen = localStorage.getItem("mmu_genius_assistant_seen") === "true"
    } catch (e) {
      console.log("Local storage not available")
    }

    if (!seen) {
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

      try {
        localStorage.setItem("mmu_genius_assistant_seen", "true")
      } catch (e) {
        console.log("Local storage not available")
      }
      setHasSeenAssistant(true)
    }

    setIsOpen(shouldOpen)
    setMessages(initialMessages)
    setHasGreeted(shouldOpen)
  }, [])

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

  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message to regenerate and the user message that prompted it
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return

    // Find the most recent user message before this assistant message
    let userMessageContent = ""
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userMessageContent = messages[i].content
        break
      }
    }

    if (!userMessageContent) return

    // Set regenerating state
    setRegeneratingId(messageId)

    try {
      // Get new AI response
      const response = await askQuestion(userMessageContent)

      // Update the message with new content
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: response,
                timestamp: new Date(),
                feedback: null,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error regenerating message:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegeneratingId(null)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Message copied to clipboard",
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Error",
          description: "Failed to copy message",
          variant: "destructive",
        })
      })
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    // Update message with feedback
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              feedback: msg.feedback === feedback ? null : feedback,
            }
          : msg,
      ),
    )

    // Log feedback (could be sent to a server in a real implementation)
    console.log(`Feedback for message ${messageId}: ${feedback}`)

    // Show toast notification
    toast({
      title: feedback === "positive" ? "Thanks for the feedback!" : "Sorry about that",
      description: feedback === "positive" ? "We're glad this was helpful" : "We'll work on improving our responses",
      duration: 3000,
    })
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId)
    if (!message) return

    setEditingMessageId(messageId)
    setEditedContent(message.content)
  }

  const handleSaveEdit = async (messageId: string) => {
    if (!editedContent.trim()) return

    // Find the message and its index
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    // Update the user message
    const updatedMessages = [...messages]
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editedContent,
      timestamp: new Date(),
    }

    // If there's an assistant response after this message, we need to regenerate it
    if (messageIndex + 1 < messages.length && updatedMessages[messageIndex + 1].role === "assistant") {
      // Remove all messages after this one
      updatedMessages.splice(messageIndex + 1)
      setMessages(updatedMessages)
      setEditingMessageId(null)

      // Process the edited message to get a new response
      setIsProcessing(true)

      try {
        const response = await askQuestion(editedContent)

        // Add the new assistant response
        setMessages([
          ...updatedMessages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response,
            timestamp: new Date(),
          },
        ])
      } catch (error) {
        console.error("Error processing edited message:", error)

        // Add error message
        setMessages([
          ...updatedMessages,
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
    } else {
      // Just update the message without regenerating a response
      setMessages(updatedMessages)
      setEditingMessageId(null)
    }
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditedContent("")
  }

  // Format text with line breaks and markdown
  const formatText = (text: string) => {
    // Simple markdown-like formatting
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/- (.*?)(?:\n|$)/g, "• $1\n") // Bullet points

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: formattedText.split("\n").join("<br />"),
        }}
      />
    )
  }

  return (
    <DraggableWrapper>
      {!isHidden && (
        <>
          {/* Assistant button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full w-12 h-12 p-0 shadow-lg ${
              isOpen ? "bg-gray-700" : "bg-study-purple"
            } hover:bg-study-blue transition-colors`}
          >
            {isOpen ? <X size={22} /> : <Lightbulb size={22} />}
          </Button>

          {/* Assistant chat window */}
          <Card
            className={`absolute bottom-16 right-0 w-[95vw] max-w-[400px] shadow-lg overflow-hidden transition-all duration-300 ${
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
                      {editingMessageId === message.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="min-h-[80px] text-sm"
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleSaveEdit(message.id)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : regeneratingId === message.id ? (
                        <div className="flex items-center text-muted-foreground">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Regenerating response...
                        </div>
                      ) : (
                        formatText(message.content)
                      )}

                      {/* Action buttons for assistant messages */}
                      {message.role === "assistant" && !editingMessageId && regeneratingId !== message.id && (
                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            title="Regenerate"
                            onClick={() => handleRegenerateMessage(message.id)}
                          >
                            <RefreshCw size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            title="Copy to clipboard"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 rounded-full ${message.feedback === "positive" ? "bg-green-100 text-green-700" : ""}`}
                            title="Thumbs up"
                            onClick={() => handleFeedback(message.id, "positive")}
                          >
                            <ThumbsUp size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 rounded-full ${message.feedback === "negative" ? "bg-red-100 text-red-700" : ""}`}
                            title="Thumbs down"
                            onClick={() => handleFeedback(message.id, "negative")}
                          >
                            <ThumbsDown size={12} />
                          </Button>
                        </div>
                      )}

                      {/* Edit button for user messages */}
                      {message.role === "user" && !editingMessageId && (
                        <div className="flex justify-end mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            title="Edit message"
                            onClick={() => handleEditMessage(message.id)}
                          >
                            <Pencil size={12} />
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-study-blue text-white">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && !regeneratingId && (
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
                  className="h-10 w-10 bg-study-purple hover:bg-study-blue text-white"
                  disabled={!inputValue.trim() || isProcessing}
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </DraggableWrapper>
  )
}

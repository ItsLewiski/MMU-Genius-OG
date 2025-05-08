"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { Menu, X, Home } from "lucide-react"
import { askQuestion } from "@/lib/tools"
import { MmuGeniusLogo } from "@/components/logo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ChatInterfaceProps {
  user: any
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative" | null
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Sample starter questions for Kenyan university context - reduced to only 2
const SAMPLE_QUESTIONS = [
  "What is the difference between college and university?",
  "How do I choose the right major in university?",
]

export function ChatInterface({ user }: ChatInterfaceProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load chats from localStorage on component mount
  useEffect(() => {
    if (!user) return

    const storedChats = localStorage.getItem(`mmu_genius_chats_${user.id}`)
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats, (key, value) => {
          if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
            return new Date(value)
          }
          return value
        })
        setChats(parsedChats)

        // Set the most recent chat as active
        if (parsedChats.length > 0) {
          const sortedChats = [...parsedChats].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          setActiveChat(sortedChats[0].id)
          setMessages(sortedChats[0].messages)
        }
      } catch (error) {
        console.error("Error parsing chat history:", error)
      }
    }
  }, [user])

  // Hide default AI assistant
  useEffect(() => {
    // Set a flag in localStorage to indicate the AI assistant should be hidden
    localStorage.setItem("ai_assistant_hidden", "true")

    // Clean up when leaving the page
    return () => {
      localStorage.removeItem("ai_assistant_hidden")
    }
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (!user || chats.length === 0) return
    localStorage.setItem(`mmu_genius_chats_${user.id}`, JSON.stringify(chats))
  }, [chats, user])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Generate a unique ID for the message
    const userMessageId = uuidv4()

    // Create a new message
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content,
      timestamp: new Date(),
    }

    // Create a new chat if there's no active chat
    if (!activeChat) {
      const newChatId = uuidv4()
      const newChat: Chat = {
        id: newChatId,
        title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setChats([newChat, ...chats])
      setActiveChat(newChatId)
      setMessages([userMessage])
    } else {
      // Add message to existing chat
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      // Update the chat in the chats array
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return chat
      })

      setChats(updatedChats)
    }

    // Process the message
    setIsProcessing(true)

    try {
      // Get AI response, with special handling for certain questions
      let response = ""

      const lowerCaseContent = content.toLowerCase()
      if (
        lowerCaseContent.includes("who created you") ||
        lowerCaseContent.includes("who made you") ||
        lowerCaseContent.includes("who built you")
      ) {
        response = "**Lewiski** created me. He is the **CEO and Co-Founder** of MMU Genius."
      } else if (lowerCaseContent.includes("who is the ceo") || lowerCaseContent.includes("who's the ceo")) {
        response = "**Lewiski** is the **CEO and Co-Founder** of MMU Genius."
      } else if (lowerCaseContent.includes("who are the executives")) {
        response =
          "The executives at MMU Genius include **Lewiski** (CEO and Co-Founder), **Emilio** (COO), **Michael** (CFO), **Gideon** (CTO), and **Mricho** (CMO)."
      } else {
        // Regular response for other questions
        response = await askQuestion(content)
      }

      // Create the assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        feedback: null,
      }

      // Add the assistant message to the messages
      const updatedMessages = [...(activeChat ? messages : []), userMessage, assistantMessage]
      setMessages(updatedMessages)

      // Update the chat in the chats array
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return chat
      })

      setChats(updatedChats)
    } catch (error) {
      console.error("Error processing message:", error)

      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        feedback: null,
      }

      // Add the error message to the messages
      const updatedMessages = [...(activeChat ? messages : []), userMessage, errorMessage]
      setMessages(updatedMessages)

      // Update the chat in the chats array
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return chat
      })

      setChats(updatedChats)
    } finally {
      setIsProcessing(false)
      setSelectedQuestion(null)
    }
  }

  const handleRegenerate = async (messageId: string) => {
    // Find the message to regenerate
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return

    // Find the user message that prompted this response
    let userMessageIndex = messageIndex - 1
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== "user") {
      userMessageIndex--
    }

    if (userMessageIndex < 0) return

    const userMessage = messages[userMessageIndex]

    setIsRegenerating(true)
    setRegeneratingId(messageId)

    try {
      // Get a new response, with special handling for certain questions
      let response = ""

      const lowerCaseContent = userMessage.content.toLowerCase()
      if (
        lowerCaseContent.includes("who created you") ||
        lowerCaseContent.includes("who made you") ||
        lowerCaseContent.includes("who built you")
      ) {
        response = "**Lewiski** created me. He is the **CEO and Co-Founder** of MMU Genius."
      } else if (lowerCaseContent.includes("who is the ceo") || lowerCaseContent.includes("who's the ceo")) {
        response = "**Lewiski** is the **CEO and Co-Founder** of MMU Genius."
      } else if (lowerCaseContent.includes("who are the executives")) {
        response =
          "The executives at MMU Genius include **Lewiski** (CEO and Co-Founder), **Emilio** (COO), **Michael** (CFO), **Gideon** (CTO), and **Mricho** (CMO)."
      } else {
        // Regular response for other questions
        response = await askQuestion(userMessage.content, true)
      }

      // Create the new assistant message
      const newAssistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        feedback: null,
      }

      // Replace the old message with the new one
      const updatedMessages = [...messages]
      updatedMessages[messageIndex] = newAssistantMessage

      setMessages(updatedMessages)

      // Update the chat in the chats array
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return chat
      })

      setChats(updatedChats)
    } catch (error) {
      console.error("Error regenerating message:", error)
    } finally {
      setIsRegenerating(false)
      setRegeneratingId(null)
    }
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    // Find the message
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    // Update the message with the feedback
    const updatedMessages = [...messages]
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      feedback,
    }

    setMessages(updatedMessages)

    // Update the chat in the chats array
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: updatedMessages,
        }
      }
      return chat
    })

    setChats(updatedChats)
  }

  const handleNewChat = () => {
    // If there are messages in the current chat, show confirmation dialog
    if (messages.length > 0) {
      setShowNewChatDialog(true)
    } else {
      // If no messages, just create a new chat without confirmation
      createNewChat()
    }
  }

  const createNewChat = () => {
    setActiveChat(null)
    setMessages([])
    setSidebarOpen(false)
    setShowNewChatDialog(false)
  }

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setActiveChat(chatId)
      setMessages(chat.messages)
      setSidebarOpen(false)
    }
  }

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)

    if (activeChat === chatId) {
      if (updatedChats.length > 0) {
        setActiveChat(updatedChats[0].id)
        setMessages(updatedChats[0].messages)
      } else {
        setActiveChat(null)
        setMessages([])
      }
    }
  }

  const handleClearAllChats = () => {
    setChats([])
    setActiveChat(null)
    setMessages([])
    setShowClearDialog(false)

    // Clear from localStorage
    if (user) {
      localStorage.removeItem(`mmu_genius_chats_${user.id}`)
    }
  }

  const handleSampleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    handleSendMessage(question)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - increased width from w-80 to w-96 */}
      <div
        className={`fixed md:static top-0 bottom-0 left-0 w-96 bg-white dark:bg-gray-900 border-r z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onClose={() => setSidebarOpen(false)}
          onClearHistory={() => setShowClearDialog(true)}
          onUpgradeClick={() => router.push("/account?tab=subscription")}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="font-semibold">MMU Genius Chat</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Return Home button replacing Regenerate button */}
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <MmuGeniusLogo width={64} height={64} className="mb-4" />
              <h3 className="text-xl font-bold mb-2">Hi, I'm MMU Genius 👋</h3>
              <p className="text-center text-muted-foreground max-w-md mb-8">
                Ask me anything about your studies, and I'll do my best to assist you.
              </p>

              {/* Sample questions in a 1x2 grid for both desktop and mobile */}
              <div className="w-full max-w-md">
                <p className="text-sm font-medium text-center mb-4">Try asking:</p>
                <div className="grid grid-cols-1 gap-3">
                  {SAMPLE_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 px-4 text-left justify-start font-normal text-sm"
                      onClick={() => handleSampleQuestionClick(question)}
                      disabled={isProcessing || selectedQuestion === question}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onRegenerate={handleRegenerate}
                  onFeedback={handleFeedback}
                  isRegenerating={isRegenerating && regeneratingId === message.id}
                  userInitial={user?.name?.charAt(0) || "U"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input - fixed at the bottom */}
        <div className="border-t p-4 sticky bottom-0 bg-background">
          <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Clear All Chats Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all chat history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllChats} className="bg-red-500 hover:bg-red-600 text-white">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Chat Confirmation Dialog */}
      <AlertDialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start a new chat? Your current conversation will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewChat}>Start New Chat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

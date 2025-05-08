"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { MmuGeniusLogo } from "@/components/logo"
import { useEffect } from "react"

export default function AskAnythingPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  // Hide AI assistant on page load
  useEffect(() => {
    // Set a flag in localStorage to indicate the AI assistant should be hidden
    localStorage.setItem("ai_assistant_hidden", "true")

    // Clean up when leaving the page
    return () => {
      localStorage.removeItem("ai_assistant_hidden")
    }
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-study-purple" />
      </div>
    )
  }

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <MmuGeniusLogo width={64} height={64} priority responsive className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">MMU Genius Chat</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto mb-6">
            Please log in to access the MMU Genius chatbot.
          </p>
          <Button
            onClick={() => {
              localStorage.setItem("login_referrer", "/tools/ask-anything")
              router.push("/login")
            }}
            className="bg-study-purple hover:bg-study-blue text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login to Continue
          </Button>
        </div>
      </div>
    )
  }

  // User is authenticated, show chat interface
  // No layout or footer - full screen chat experience
  return (
    <div className="h-screen overflow-hidden">
      <ChatInterface user={user} />
    </div>
  )
}

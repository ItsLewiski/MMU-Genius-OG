"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApiKeyInstructions } from "./api-key-instructions"

interface ErrorHandlerProps {
  children: React.ReactNode
}

export function ErrorHandler({ children }: ErrorHandlerProps) {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isApiKeyError, setIsApiKeyError] = useState(false)

  useEffect(() => {
    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      setHasError(true)

      if (event.error?.message?.includes("API key")) {
        setIsApiKeyError(true)
      } else {
        setErrorMessage(event.error?.message || "An unexpected error occurred")
      }
    }

    window.addEventListener("error", handleError)

    // Check if API key is available
    const checkApiKey = async () => {
      try {
        // This is a client-side check that doesn't expose the key
        const response = await fetch("/api/check-api-key")
        if (!response.ok) {
          setHasError(true)
          setIsApiKeyError(true)
        }
      } catch (error) {
        console.error("API key check failed:", error)
        setHasError(true)
        setIsApiKeyError(true)
      }
    }

    checkApiKey()

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setIsApiKeyError(false)
    window.location.reload()
  }

  if (hasError) {
    if (isApiKeyError) {
      return <ApiKeyInstructions />
    }

    return (
      <div className="container py-8 max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {errorMessage || "An unexpected error occurred. This might be due to API limits or configuration issues."}
            <div className="mt-4">
              <Button onClick={handleRetry}>Try Again</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

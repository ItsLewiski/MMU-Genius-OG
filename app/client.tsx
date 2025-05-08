"use client"
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { AIAssistant } from "@/components/ai-assistant"
import { setupVersionDetection } from "@/lib/version-detection"
import { useEffect, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

// Create a loading fallback component
function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading MMU Genius...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  // Add this useEffect for version detection and client-side rendering check
  useEffect(() => {
    setupVersionDetection()
    setIsClient(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://mmugenius.vercel.app" />
        <meta name="theme-color" content="#5B7CFA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MMU Genius" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              {/* Use Suspense with a loading fallback */}
              <Suspense fallback={<LoadingFallback />}>
                {/* Only render children when on client-side to prevent hydration errors */}
                {isClient ? children : <LoadingFallback />}
              </Suspense>
              <AIAssistant />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}

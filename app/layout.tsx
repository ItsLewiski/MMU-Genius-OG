import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { WebsiteStructuredData, OrganizationStructuredData } from "./structured-data"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { AIAssistant } from "@/components/ai-assistant"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MMU Genius | AI-Powered Study Tools for Students",
  description:
    "Transform your study notes into summaries, flashcards, and practice questions with AI. Get ahead of the bottom 99% with MMU Genius.",
  keywords: "study tools, AI study assistant, flashcards, summarizer, MMU Genius, student tools, academic success",
  authors: [{ name: "Lewiski", url: "https://mmugenius.vercel.app" }],
  creator: "MMU Genius Team",
  publisher: "MMU Genius",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mmugenius.vercel.app",
    title: "MMU Genius | AI-Powered Study Tools for Students",
    description:
      "Transform your study notes into summaries, flashcards, and practice questions with AI. Get ahead of the bottom 99% with MMU Genius.",
    siteName: "MMU Genius",
  },
  twitter: {
    card: "summary_large_image",
    title: "MMU Genius | AI-Powered Study Tools for Students",
    description:
      "Transform your study notes into summaries, flashcards, and practice questions with AI. Get ahead of the bottom 99% with MMU Genius.",
    creator: "@mmugenius",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32" },
      { url: "/favicon.png", sizes: "16x16" },
    ],
    shortcut: "/favicon.png",
    apple: { url: "/favicon.png", sizes: "180x180" },
  },
  metadataBase: new URL("https://mmugenius.vercel.app"),
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://mmugenius.vercel.app" />
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <meta name="theme-color" content="#5B7CFA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MMU Genius" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Suspense>{children}</Suspense>
            <AIAssistant />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

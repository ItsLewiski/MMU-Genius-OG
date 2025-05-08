import type React from "react"
import type { Metadata } from "next"
import ClientComponent from "./client"

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
  return <ClientComponent>{children}</ClientComponent>
}


import './globals.css'
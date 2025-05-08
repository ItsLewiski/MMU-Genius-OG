"use client"

import type React from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

interface PageLayoutProps {
  children: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function PageLayout({ children, activeTab = "home", setActiveTab = () => {} }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

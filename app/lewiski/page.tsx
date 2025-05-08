"use client"

import { useEffect, useState } from "react"
import { AdminPanel } from "@/components/admin/admin-panel"
import { AdminLogin } from "@/components/admin/admin-login"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if admin is logged in
    const isAdmin = localStorage.getItem("mmu_genius_admin") === "true"
    setIsAuthenticated(isAdmin)
  }, [])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 bg-gray-900 text-white">
        <div className="container">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">MMU Genius Admin</span>
            </a>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a href="/" className="text-sm hover:underline">
                Back to Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 bg-white dark:bg-gray-900">
        {isAuthenticated ? (
          <AdminPanel />
        ) : (
          <div className="container max-w-md mx-auto">
            <AdminLogin onLogin={() => setIsAuthenticated(true)} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

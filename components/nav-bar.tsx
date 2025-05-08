"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, UserIcon, LogIn, UserPlus, Wrench, ShoppingBag, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { MmuGeniusLogo } from "@/components/logo"

interface NavBarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Update the tabs array to include "Ask" and reorder items
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "ask", label: "Ask", icon: MessageSquare },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "products", label: "Shop", icon: ShoppingBag },
  ]

  // Update the handleTabClick function to handle the "ask" tab
  const handleTabClick = (tabId: string) => {
    if (tabId === "home" && window.location.pathname !== "/") {
      // If we're not on the homepage and the home tab is clicked, navigate to the homepage
      router.push("/")
    } else if (tabId === "tools") {
      // Navigate to the tools page
      router.push("/tools")
    } else if (tabId === "ask") {
      // Navigate to the ask anything page
      router.push("/tools/ask-anything")
    } else if (tabId === "products") {
      // Navigate to the shop page
      router.push("/shop")
    } else {
      // Otherwise just set the active tab
      setActiveTab(tabId)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav
      className={cn(
        "border-b transition-all duration-300 z-50 bg-background sticky top-0 w-full",
        scrolled && "shadow-md",
      )}
    >
      <div className="container flex h-16 items-center justify-between w-full px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Increased logo size by 1.5x (from 48 to 60) */}
          <MmuGeniusLogo width={60} height={60} className="mr-1" priority responsive />
          <span
            className="text-xl font-bold bg-gradient-to-r from-study-blue to-study-purple bg-clip-text text-transparent cursor-pointer whitespace-nowrap"
            onClick={() => router.push("/")}
          >
            MMU Genius
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={cn("flex items-center gap-2", activeTab === tab.id && "bg-muted")}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/account")}>
                <UserIcon className="h-4 w-4" />
                <span className="hidden md:inline">{user?.name.split(" ")[0]}</span>
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
                onClick={() => router.push("/login")}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>

              <Button
                className="bg-study-purple hover:bg-study-blue text-white flex items-center gap-2"
                onClick={() => router.push("/register")}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden md:inline">Register</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation - ensure it's full width */}
      <div className="md:hidden border-t fixed bottom-0 left-0 right-0 bg-background z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] w-full">
        <div className="flex justify-between py-2 px-4 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={cn("flex flex-col items-center gap-1 h-auto py-2", activeTab === tab.id && "bg-muted")}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            )
          })}

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => router.push("/account")}
            >
              <UserIcon className="h-4 w-4" />
              <span className="text-xs">Account</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => router.push("/login")}
            >
              <LogIn className="h-4 w-4" />
              <span className="text-xs">Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

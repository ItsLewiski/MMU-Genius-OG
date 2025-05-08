"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Smartphone, Wrench, ShoppingCart, Map } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if the app can be installed (PWA)
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Update UI to show the install button
      setIsInstallable(true)
    })

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      // Hide the install button
      setIsInstallable(false)
      // Log install to analytics
      console.log("PWA was installed")
    })
  }, [])

  const handleInstallClick = () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null)
    })
  }

  return (
    <footer className="border-t py-8 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 mt-auto w-full">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MMU Genius</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered study tools for students to learn smarter, not harder.
            </p>

            {/* Mobile App Download Button */}
            <div className="app-download-btn mt-4">
              <Button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-study-purple hover:bg-study-blue text-white"
                disabled={!isInstallable}
              >
                <Smartphone className="h-4 w-4" />
                <span>Download App</span>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Install MMU Genius on your device for easy access</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Advertise with Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sitemap
                </Link>
              </li>
              <li className="md:hidden">
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Summarizer
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Q&A Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/humaniser" className="text-muted-foreground hover:text-foreground transition-colors">
                  Humaniser
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ask-anything"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ask Anything
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ai-detector"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  AI Detector
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Advertise with Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile-only Tools and Products links */}
        <div className="md:hidden mt-4 border-t pt-4">
          <div className="text-lg font-bold mb-2">Quick Access</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/tools")}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Tools
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/products")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/sitemap")}
            >
              <Map className="h-4 w-4 mr-2" />
              Sitemap
            </Button>
          </div>
        </div>

        <div className="border-t dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            Created By Lewiski | &copy; MMU Genius 2025. All Rights Reserved.
            <br />
            <a href="https://mmugenius.vercel.app/" className="hover:underline">
              https://mmugenius.vercel.app/
            </a>
          </p>

          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

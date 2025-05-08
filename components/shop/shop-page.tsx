"use client"

import { useState, useEffect } from "react"
import { BookList } from "@/components/shop/book-list"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CartProvider } from "@/components/shop/cart-context"

export function ShopPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  // Listen for cart updates from localStorage if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const updateCartCount = () => {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        setCartCount(cartItems.length)
      }

      // Initial count
      updateCartCount()

      // Listen for storage events (cart updates)
      window.addEventListener("storage", updateCartCount)

      // Custom event for same-tab updates
      window.addEventListener("cartUpdated", updateCartCount)

      return () => {
        window.removeEventListener("storage", updateCartCount)
        window.removeEventListener("cartUpdated", updateCartCount)
      }
    }
  }, [isAuthenticated])

  return (
    <CartProvider>
      <div className="relative min-h-screen">
        <BookList />

        {/* Floating Cart Button */}
        <div className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-10">
          <Button
            onClick={() => router.push("/cart")}
            className="rounded-full p-4 bg-study-purple hover:bg-study-blue shadow-lg"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </CartProvider>
  )
}

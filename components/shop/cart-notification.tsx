"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, CheckCircle, X } from "lucide-react"

interface CartNotificationProps {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function CartNotification({ isOpen, onClose, productName }: CartNotificationProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const handleContinueShopping = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const handleGoToCart = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      router.push("/cart")
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <Card className="w-80 shadow-lg border-study-purple/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-study-purple">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Added to Cart</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1 text-gray-500"
              onClick={handleContinueShopping}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mb-4">
            <span className="font-medium">{productName}</span> has been added to your cart.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
            <Button size="sm" className="flex-1 text-xs bg-study-purple hover:bg-study-blue" onClick={handleGoToCart}>
              <ShoppingCart className="h-3 w-3 mr-1" />
              Go to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

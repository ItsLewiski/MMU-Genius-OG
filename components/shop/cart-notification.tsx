"use client"

import { useEffect } from "react"
import { Check, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CartNotificationProps {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function CartNotification({ isOpen, onClose, productName }: CartNotificationProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-2 rounded-full">
            <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Added to Cart!</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{productName} has been added to your cart.</p>
            <div className="mt-3 flex space-x-2">
              <Button
                size="sm"
                className="bg-study-purple hover:bg-study-blue text-white"
                onClick={() => {
                  router.push("/cart")
                  onClose()
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/30 h-1">
        <div className="h-full bg-green-500 animate-shrink" style={{ animationDuration: "5s" }}></div>
      </div>
    </div>
  )
}

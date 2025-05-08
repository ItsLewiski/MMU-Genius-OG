"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  // Calculate total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Load cart from localStorage on initial render if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } else {
      // Clear cart if not authenticated
      setItems([])
    }
  }, [isAuthenticated])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(items))
      // Dispatch custom event for other components to listen for cart updates
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }, [items, isAuthenticated])

  const addToCart = (product: any) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item with quantity 1
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))

    // If cart becomes empty, remove from localStorage
    if (items.length === 1) {
      localStorage.removeItem("cartItems")
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cartItems")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
